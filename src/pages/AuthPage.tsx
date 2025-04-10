
import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client"; 
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our new components
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import EmailVerification from "@/components/auth/EmailVerification";
import AuthHeader from "@/components/auth/AuthHeader";

// Zod schema types
import * as z from "zod";

type LocationState = {
  from?: { pathname: string };
};

const AuthPage = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [emailSent, setEmailSent] = useState(false);
  
  const location = useLocation();
  const locationState = location.state as LocationState;
  const redirectPath = locationState?.from?.pathname || "/";

  const onLoginSubmit = async (values: z.infer<typeof z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })>) => {
    try {
      setIsLoading(true);
      await signIn(values.email, values.password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (values: z.infer<typeof z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phoneNumber: z.string(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })>) => {
    try {
      setIsLoading(true);
      
      // Check for duplicate email
      const { count: emailCount, error: emailError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('email', values.email);
      
      if (emailError) {
        console.error("Email check error:", emailError);
        toast.error("Error checking email availability");
        setIsLoading(false);
        return;
      }
      
      if (emailCount && emailCount > 0) {
        toast.error("Email already in use. Please use a different email address.");
        setIsLoading(false);
        return;
      }
      
      // Check for duplicate phone number
      const { count: phoneCount, error: phoneError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('phone_number', values.phoneNumber);
      
      if (phoneError) {
        console.error("Phone check error:", phoneError);
        toast.error("Error checking phone availability");
        setIsLoading(false);
        return;
      }
      
      if (phoneCount && phoneCount > 0) {
        toast.error("Phone number already in use. Please use a different phone number.");
        setIsLoading(false);
        return;
      }
      
      // If all checks pass, proceed with signup
      await signUp(values.email, values.password, values.fullName, values.phoneNumber);
      setEmailSent(true);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, redirect to home page
  if (user && !loading) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <AuthHeader activeTab={activeTab} emailSent={emailSent} />
        
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          {emailSent ? (
            <EmailVerification onBackToLogin={() => setActiveTab("login")} />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm onSubmit={onLoginSubmit} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="signup">
                <SignupForm onSubmit={onSignupSubmit} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          )}
        </div>
        
        <div className="text-center mt-4">
          <Link to="/" className="text-muted-foreground hover:text-gray-900">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
