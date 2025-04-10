
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

// Create a Supabase client with the Auth context
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use service role key to bypass RLS policies
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { email, fullName, token } = await req.json();

    // Generate a custom email template
    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email Address</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #2563eb;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 24px;
          }
          .content {
            background-color: #ffffff;
            padding: 30px 20px;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .verify-button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: white;
            text-decoration: none;
          }
          .car-icon {
            display: inline-block;
            margin-right: 8px;
            vertical-align: middle;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <a href="${supabaseUrl}" class="logo">
              <span class="car-icon">🚗</span> Wheel Deals
            </a>
          </div>
          <div class="content">
            <h2>Hello ${fullName || "there"}!</h2>
            <p>Thank you for signing up for Wheel Deals. Please verify your email address to complete your registration and start using our platform.</p>
            <div style="text-align: center;">
              <a href="${token}" class="verify-button">Verify Email Address</a>
            </div>
            <p>If you did not sign up for Wheel Deals, please ignore this email.</p>
            <p>Best regards,<br>The Wheel Deals Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Wheel Deals. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // This function is meant to be called by a Supabase Auth webhook
    // In a production environment, you would use this with an email service provider like Resend, SendGrid, etc.
    // For now, we'll just return the email template for demonstration purposes

    return new Response(
      JSON.stringify({
        success: true,
        emailTemplate,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
