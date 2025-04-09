
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if an email is already registered
 */
export const checkIfEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { error: emailCheckError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false // Only check if email exists, don't create a magic link
      }
    });
    
    // If no error, email doesn't exist. If error is "Email not confirmed", it exists
    return !emailCheckError || emailCheckError.message.includes("Email not confirmed");
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};

/**
 * Check if a phone number is already registered
 */
export const checkIfPhoneExists = async (phoneNumber: string): Promise<boolean> => {
  try {
    const { data: existingUserWithPhone, error: phoneCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone_number', phoneNumber)
      .maybeSingle();

    if (phoneCheckError) {
      console.error("Error checking phone number:", phoneCheckError);
      return false;
    }

    return !!existingUserWithPhone;
  } catch (error) {
    console.error("Error checking phone number:", error);
    return false;
  }
};

/**
 * Send phone verification code
 */
export const sendPhoneVerificationCode = async (phoneNumber: string): Promise<string | undefined> => {
  try {
    const response = await supabase.functions.invoke("verify-phone", {
      body: { 
        phoneNumber, 
        action: "send" 
      },
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to send verification code");
    }

    toast.success("Verification code sent to your phone");
    return response.data.code; // In dev mode, we return the code for easier testing
  } catch (error: any) {
    toast.error(error.message || "Failed to send verification code");
    throw error;
  }
};

/**
 * Verify phone number with code
 */
export const verifyPhoneWithCode = async (phoneNumber: string, code: string, userId: string): Promise<boolean> => {
  try {
    const response = await supabase.functions.invoke("verify-phone", {
      body: { 
        phoneNumber, 
        code,
        userId,
        action: "verify" 
      },
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to verify phone number");
    }
    
    toast.success("Phone number verified successfully");
    return true;
  } catch (error: any) {
    toast.error(error.message || "Failed to verify phone number");
    return false;
  }
};
