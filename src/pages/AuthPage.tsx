
import { useState, useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Car } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import PhoneVerificationForm from "@/components/auth/PhoneVerificationForm";
import * as z from "zod";

type LocationState = {
  from?: { pathname: string };
  verifyPhone?: boolean;
};

const AuthPage = () => {
  const { user, signIn, signUp, loading, sendPhoneVerification, verifyPhoneNumber, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userId, setUserId] = useState<string | undefined>();
  
  const location = useLocation();
  const locationState = location.state as LocationState;
  const redirectPath = locationState?.from?.pathname || "/";
  
  // Check if user needs to verify phone
  useEffect(() => {
    if (locationState?.verifyPhone && user) {
      setShowPhoneVerification(true);
      if (profile?.phone_number) {
        setPhoneNumber(profile.phone_number);
      }
      setUserId(user.id);
    }
  }, [locationState, user, profile]);

  const onLoginSubmit = async (values: z.infer<typeof z.object({
    email: z.string(),
    password: z.string(),
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
    fullName: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  })>) => {
    try {
      setIsLoading(true);
      const newUserId = await signUp(values.email, values.password, values.fullName, values.phoneNumber);
      if (newUserId) {
        setUserId(newUserId);
        setPhoneNumber(values.phoneNumber);
        setShowPhoneVerification(true);
        
        try {
          // Send verification code after successful signup
          await sendPhoneVerification(values.phoneNumber);
        } catch (error) {
          console.error("Failed to send verification code:", error);
          // Continue with verification UI even if sending code fails
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendVerificationCode = async () => {
    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }
    
    try {
      setIsLoading(true);
      await sendPhoneVerification(phoneNumber);
    } catch (error) {
      console.error("Failed to send verification code:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onVerifyPhoneSubmit = async (otp: string) => {
    if (!userId || !phoneNumber) {
      toast.error("Missing user information. Please try again.");
      return;
    }
    
    try {
      setIsLoading(true);
      const success = await verifyPhoneNumber(phoneNumber, otp, userId);
      
      if (success) {
        // Redirect back to the original page
        window.location.href = redirectPath;
      }
    } catch (error) {
      console.error("Failed to verify phone:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Return to signup form
  const handleBackToSignup = () => {
    setShowPhoneVerification(false);
  };

  // If user is already logged in and phone is verified, redirect to home page
  if (user && !loading && profile?.phone_verified && !locationState?.verifyPhone) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Car className="h-8 w-8 text-car-blue" />
            <span className="text-2xl font-bold text-car-blue">Wheel Deals</span>
          </Link>
          
          {showPhoneVerification ? (
            <h1 className="text-2xl font-semibold text-center">Verify Your Phone Number</h1>
          ) : (
            <h1 className="text-2xl font-semibold text-center">
              {activeTab === "login" ? "Welcome back" : "Create an account"}
            </h1>
          )}
          
          {showPhoneVerification ? (
            <p className="text-center text-muted-foreground mt-2">
              Please enter the verification code sent to {phoneNumber}
            </p>
          ) : (
            <p className="text-center text-muted-foreground mt-2">
              {activeTab === "login" 
                ? "Enter your credentials to access your account" 
                : "Fill in your details to create a new account"}
            </p>
          )}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border">
          {showPhoneVerification ? (
            <PhoneVerificationForm
              onVerify={onVerifyPhoneSubmit}
              onBack={handleBackToSignup}
              onResendCode={handleSendVerificationCode}
              phoneNumber={phoneNumber}
              isLoading={isLoading}
            />
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
