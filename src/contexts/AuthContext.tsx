
import React, { createContext, useContext, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProfile, Profile } from "@/hooks/useProfile";
import { 
  checkIfEmailExists, 
  checkIfPhoneExists, 
  sendPhoneVerificationCode, 
  verifyPhoneWithCode 
} from "@/utils/authUtils";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<string | undefined>;
  signOut: () => Promise<void>;
  loading: boolean;
  sendPhoneVerification: (phoneNumber: string) => Promise<string | undefined>;
  verifyPhoneNumber: (phoneNumber: string, code: string, userId: string) => Promise<boolean>;
  loadingProfile: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { profile, loadingProfile, fetchProfile, setProfile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast.success("Signed in successfully!");
          // Fetch profile when user signs in
          if (session?.user) {
            fetchProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          toast.info("Signed out successfully!");
          setProfile(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Fetch profile if session exists
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in.");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phoneNumber: string) => {
    try {
      // Check if email is already registered
      const emailExists = await checkIfEmailExists(email);
      if (emailExists) {
        toast.error("This email is already registered. Please use a different email address.");
        throw new Error("Email already in use");
      }

      // Check if phone number already exists
      const phoneExists = await checkIfPhoneExists(phoneNumber);
      if (phoneExists) {
        toast.error("This phone number is already registered. Please use a different phone number.");
        throw new Error("Phone number already in use");
      }

      // Try to sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: fullName,
            phone_number: phoneNumber
          }
        }
      });

      if (error) {
        // If error includes "already registered", it means the email is already in use
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered. Please use a different email address.");
        } else {
          toast.error(error.message || "Failed to sign up.");
        }
        throw error;
      }
      
      toast.success("Account created! Please check your email to verify your account.");
      
      // Return user ID for phone verification
      return data?.user?.id;
    } catch (error: any) {
      throw error;
    }
  };

  const sendPhoneVerification = async (phoneNumber: string) => {
    return sendPhoneVerificationCode(phoneNumber);
  };

  const verifyPhoneNumber = async (phoneNumber: string, code: string, userId: string) => {
    const success = await verifyPhoneWithCode(phoneNumber, code, userId);
    
    if (success) {
      // Refresh profile data
      await fetchProfile(userId);
    }
    
    return success;
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out.");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile,
      signIn, 
      signUp, 
      signOut, 
      loading,
      sendPhoneVerification,
      verifyPhoneNumber,
      loadingProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
