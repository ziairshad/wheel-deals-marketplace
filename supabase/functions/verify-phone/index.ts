
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

// Create a Supabase client with the Auth context
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

// Twilio credentials
const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID") ?? "";
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN") ?? "";
const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  phoneNumber: string;
  action: "send" | "verify";
  code?: string;
  userId?: string;
}

async function sendTwilioSMS(to: string, body: string) {
  const twilioEndpoint = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
  
  const formData = new URLSearchParams();
  formData.append('To', to);
  formData.append('From', twilioPhoneNumber);
  formData.append('Body', body);
  
  const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
  
  try {
    const response = await fetch(twilioEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Twilio API error:", data);
      throw new Error(data.message || "Failed to send SMS");
    }
    
    return data;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Twilio credentials are configured
    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      return new Response(
        JSON.stringify({ 
          error: "Twilio credentials are not configured." 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization") ?? "" },
      },
    });

    const { phoneNumber, action, code, userId } = await req.json() as RequestBody;

    // Validate UAE phone number format (starts with +971)
    if (!phoneNumber.startsWith("+971") || phoneNumber.length < 12) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid UAE phone number. Must start with +971 and have the correct length." 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (action === "send") {
      // Get the session - but don't require it to be present for new signups
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      // Use the provided userId or the one from session if available
      const effectiveUserId = userId || session?.user.id;
      
      // If no user ID is available, return an error
      if (!effectiveUserId) {
        return new Response(
          JSON.stringify({ error: "User ID is required for sending OTP" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      // Generate a 6-digit OTP code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Set expiration time to 5 minutes from now
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      // Store the OTP in the database
      const { data, error } = await supabase
        .from("otp_codes")
        .insert({
          user_id: effectiveUserId,
          phone_number: phoneNumber,
          code: otpCode,
          expires_at: expiresAt.toISOString(),
        })
        .select();

      if (error) {
        console.error("Error storing OTP:", error);
        return new Response(
          JSON.stringify({ error: "Failed to generate OTP" }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      // Send OTP via Twilio SMS
      try {
        const message = `Your Wheel Deals verification code is: ${otpCode}`;
        await sendTwilioSMS(phoneNumber, message);
        
        console.log(`SMS sent to ${phoneNumber} with code ${otpCode}`);
        
        return new Response(
          JSON.stringify({ 
            message: "OTP sent successfully",
            // Always return the code for easier testing during development
            code: otpCode
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      } catch (error) {
        console.error("Failed to send SMS:", error);
        return new Response(
          JSON.stringify({ error: "Failed to send SMS. Please try again later." }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    } 
    else if (action === "verify") {
      if (!code || !userId) {
        return new Response(
          JSON.stringify({ error: "Missing code or user ID" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      // Check the OTP code
      const { data: otpData, error: otpError } = await supabase
        .from("otp_codes")
        .select("*")
        .match({ 
          user_id: userId,
          phone_number: phoneNumber,
          code: code,
          used: false
        })
        .gt("expires_at", new Date().toISOString())
        .single();

      if (otpError || !otpData) {
        return new Response(
          JSON.stringify({ 
            error: "Invalid or expired OTP code" 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      // Mark the OTP as used
      await supabase
        .from("otp_codes")
        .update({ used: true })
        .eq("id", otpData.id);

      // Update the user's profile to mark phone as verified
      await supabase
        .from("profiles")
        .update({ 
          phone_number: phoneNumber,
          phone_verified: true
        })
        .eq("id", userId);

      return new Response(
        JSON.stringify({ success: true }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } 
    else {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
