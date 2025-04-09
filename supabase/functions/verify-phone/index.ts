
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

// Create a Supabase client with the Auth context
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization") ?? "" },
      },
    });

    // Get the session to verify the user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // For this demo, we'll just simulate sending and verifying OTPs
    // In a production app, you would integrate with an SMS provider like Twilio

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
      if (!session) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { 
            status: 401, 
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
          user_id: session.user.id,
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

      // In a real implementation, send SMS here
      console.log(`Simulating sending OTP ${otpCode} to ${phoneNumber}`);

      return new Response(
        JSON.stringify({ 
          message: "OTP sent successfully",
          // In development, return the code for testing
          code: otpCode
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
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
