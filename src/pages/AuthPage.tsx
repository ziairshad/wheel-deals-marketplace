
import { useState, useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Car, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// Validate UAE phone number
const uaePhoneRegex = /^\+971[0-9]{9}$/;

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phoneNumber: z.string().regex(uaePhoneRegex, "Please enter a valid UAE mobile number (format: +971XXXXXXXXX)."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const verifyPhoneSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

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

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "+971",
      password: "",
      confirmPassword: "",
    },
  });
  
  const verifyPhoneForm = useForm<z.infer<typeof verifyPhoneSchema>>({
    resolver: zodResolver(verifyPhoneSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      await signIn(values.email, values.password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      setIsLoading(true);
      const newUserId = await signUp(values.email, values.password, values.fullName, values.phoneNumber);
      if (newUserId) {
        setUserId(newUserId);
        setPhoneNumber(values.phoneNumber);
        setShowPhoneVerification(true);
        
        // Send verification code
        await sendPhoneVerification(values.phoneNumber);
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
  
  const onVerifyPhoneSubmit = async (values: z.infer<typeof verifyPhoneSchema>) => {
    if (!userId || !phoneNumber) {
      toast.error("Missing user information. Please try again.");
      return;
    }
    
    try {
      setIsLoading(true);
      const success = await verifyPhoneNumber(phoneNumber, values.otp, userId);
      
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
            <>
              <Button 
                variant="ghost" 
                className="mb-4 px-0" 
                onClick={handleBackToSignup}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Form {...verifyPhoneForm}>
                <form onSubmit={verifyPhoneForm.handleSubmit(onVerifyPhoneSubmit)} className="space-y-4">
                  <FormField
                    control={verifyPhoneForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col space-y-2">
                    <Button 
                      type="submit" 
                      className="w-full mt-6 bg-car-blue hover:bg-blue-700" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify Phone Number"}
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleSendVerificationCode}
                      disabled={isLoading}
                    >
                      Resend Code
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full mt-6 bg-car-blue hover:bg-blue-700" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UAE Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+971XXXXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">Format: +971XXXXXXXXX</p>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full mt-6 bg-car-blue hover:bg-blue-700" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
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
