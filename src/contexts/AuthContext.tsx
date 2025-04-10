
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  phone_verified: boolean | null;
  created_at: string;
  updated_at: string;
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<string | undefined>;
  signOut: () => Promise<void>;
  loading: boolean;
  sendPhoneVerification: (phoneNumber: string, userId?: string) => Promise<string | undefined>;
  verifyPhoneNumber: (phoneNumber: string, code: string, userId: string) => Promise<boolean>;
  loadingProfile: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    setLoadingProfile(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

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

      if (error) throw error;
      
      toast.success("Account created! Please check your email to verify your account.");
      
      // Return user ID for phone verification
      return data?.user?.id;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up.");
      throw error;
    }
  };

  const sendPhoneVerification = async (phoneNumber: string, userId?: string) => {
    try {
      // If userId is not provided but user is logged in, use the logged-in user's ID
      const effectiveUserId = userId || user?.id;
      
      if (!effectiveUserId) {
        throw new Error("User ID is required to verify phone number");
      }

      const response = await supabase.functions.invoke("verify-phone", {
        body: { 
          phoneNumber, 
          userId: effectiveUserId,
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

  const verifyPhoneNumber = async (phoneNumber: string, code: string, userId: string) => {
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

      // Refresh profile data
      await fetchProfile(userId);
      
      toast.success("Phone number verified successfully");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to verify phone number");
      return false;
    }
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
