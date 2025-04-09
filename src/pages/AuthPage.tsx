
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  fullName: z.string().min(1, { message: "Please enter your full name" }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

interface LocationState {
  from?: string;
  action?: string;
}

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Check if user was redirected from selling flow
  const locationState = location.state as LocationState | null;
  const redirectPath = locationState?.from || "/";
  const actionType = locationState?.action;
  
  // Set active tab based on the action in location state
  React.useEffect(() => {
    if (actionType === "sell" && activeTab === "login") {
      setActiveTab("signup");
    }
  }, [actionType, activeTab]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await signIn(data.email, data.password);
      navigate(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      await signUp(data.email, data.password, data.fullName, data.phoneNumber);
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account before logging in.",
      });
      
      // Switch to login tab after successful signup
      setActiveTab("login");
      
      // Reset the login form with the email from signup
      loginForm.setValue("email", data.email);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <div className="mx-auto max-w-md">
          <Card className="border-none shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {actionType === "sell" ? "Sign in to sell your car" : "Welcome to Wheel Deals"}
              </CardTitle>
              <CardDescription>
                {actionType === "sell" 
                  ? "Create an account or sign in to list your vehicle for sale" 
                  : "Sign in to your account or create a new one"}
              </CardDescription>
            </CardHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <CardContent className="pt-6">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} type="email" />
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
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full mt-6" 
                        disabled={loading}
                      >
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-sm text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0" 
                      onClick={() => setActiveTab("signup")}
                    >
                      Sign up
                    </Button>
                  </div>
                </CardFooter>
              </TabsContent>
              
              <TabsContent value="signup">
                <CardContent className="pt-6">
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
                              <Input placeholder="your.email@example.com" {...field} type="email" />
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
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
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
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full mt-6" 
                        disabled={loading}
                      >
                        {loading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0" 
                      onClick={() => setActiveTab("login")}
                    >
                      Sign in
                    </Button>
                  </div>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthPage;
