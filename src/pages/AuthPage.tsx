import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Car } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client"; 
import { toast } from "sonner";
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

type LocationState = {
  from?: { pathname: string };
};

const AuthPage = () => {
  const { user, signIn, signUp, loading, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [emailSent, setEmailSent] = useState(false);
  
  const location = useLocation();
  const locationState = location.state as LocationState;
  const redirectPath = locationState?.from?.pathname || "/";
  
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
      
      // Check if email exists - simplified approach to avoid type depth issues
      const emailQuery = await supabase
        .from('profiles')
        .select('id')
        .eq('email', values.email);
      
      if (emailQuery.data && emailQuery.data.length > 0) {
        toast.error("Email already in use. Please use a different email address.");
        setIsLoading(false);
        return;
      }
      
      // Check if phone number exists - simplified approach to avoid type depth issues
      const phoneQuery = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', values.phoneNumber);
      
      if (phoneQuery.data && phoneQuery.data.length > 0) {
        toast.error("Phone number already in use. Please use a different phone number.");
        setIsLoading(false);
        return;
      }
      
      // If all checks pass, proceed with signup
      await signUp(values.email, values.password, values.fullName, values.phoneNumber);
      setEmailSent(true);
    } catch (error: any) {
      console.error("Signup error:", error);
      // Error is already shown in toast by the signUp function
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
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Car className="h-8 w-8 text-car-blue" />
            <span className="text-2xl font-bold text-car-blue">Wheel Deals</span>
          </Link>
          
          {emailSent ? (
            <h1 className="text-2xl font-semibold text-center">Check Your Email</h1>
          ) : (
            <h1 className="text-2xl font-semibold text-center">
              {activeTab === "login" ? "Welcome back" : "Create an account"}
            </h1>
          )}
          
          {emailSent ? (
            <p className="text-center text-muted-foreground mt-2">
              We've sent you a verification email. Please check your inbox and click the link to verify your account.
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
          {emailSent ? (
            <div className="text-center space-y-4">
              <div className="bg-blue-50 text-blue-700 p-4 rounded-md">
                <p>A verification link has been sent to your email address. Please click the link to complete your registration.</p>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => setActiveTab("login")}
              >
                Return to Login
              </Button>
            </div>
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
