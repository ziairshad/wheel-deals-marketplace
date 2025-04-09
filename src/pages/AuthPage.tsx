import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, User, Phone, CheckCircle } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

// Define schemas for the forms using Zod
const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name is required"),
  phoneNumber: z.string().min(7, "Valid phone number required"),
});

const verifyPhoneFormSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

const AuthPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [isPhoneVerificationSent, setIsPhoneVerificationSent] = useState(false);
  const [userIdForVerification, setUserIdForVerification] = useState<string | undefined>(undefined);

  const { signIn, signUp, user, loading, sendPhoneVerification, verifyPhoneNumber } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form definitions using react-hook-form
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
    },
  });

  const verifyPhoneForm = useForm<z.infer<typeof verifyPhoneFormSchema>>({
    resolver: zodResolver(verifyPhoneFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleSignIn = async (data: z.infer<typeof loginFormSchema>) => {
    setIsSubmitting(true);
    try {
      await signIn(data.email, data.password);
      // After successful sign in, redirect
      const from = location.state?.from?.pathname || "/";
      navigate(from);
    } catch (error) {
      // Error handling already done in the signIn function
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (data: z.infer<typeof registerFormSchema>) => {
    setIsSubmitting(true);
    try {
      const userId = await signUp(data.email, data.password, data.fullName, data.phoneNumber);
      if (userId) {
        setUserIdForVerification(userId);
        setIsPhoneVerificationSent(true);
        setActiveTab("verify-phone");
      }
    } catch (error) {
      // Error handling already done in the signUp function
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendVerificationCode = async (phoneNumber: string) => {
    setIsSubmitting(true);
    try {
      await sendPhoneVerification(phoneNumber);
    } catch (error) {
      // Error handling already done in the sendPhoneVerification function
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (data: z.infer<typeof verifyPhoneFormSchema>) => {
    setIsSubmitting(true);
    try {
      if (!userIdForVerification) {
        throw new Error("User ID not available for verification.");
      }
      const isVerified = await verifyPhoneNumber(registerForm.getValues().phoneNumber, data.code, userIdForVerification);
      if (isVerified) {
        toast({
          title: "Success",
          description: "Your phone number has been verified successfully!",
        });
        const from = location.state?.from?.pathname || "/";
        navigate(from);
      }
    } catch (error) {
      // Error handling already done in the verifyPhoneNumber function
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      const from = location.state?.from?.pathname || "/";
      navigate(from);
    }
  }, [user, loading, navigate, location.state]);

  // Check if we need to show the phone verification tab on mount
  useEffect(() => {
    if (location.state?.verifyPhone) {
      setActiveTab("verify-phone");
    }
  }, [location.state]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8 max-w-xl">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 text-car-blue mr-3" />
          <h1 className="text-3xl font-bold">
            {activeTab === "login"
              ? "Login"
              : activeTab === "register"
              ? "Register"
              : "Verify Phone"}
          </h1>
        </div>

        <p className="text-muted-foreground mb-8">
          {activeTab === "login"
            ? "Sign in to access your account and manage your car listings."
            : activeTab === "register"
            ? "Create a new account to start listing your cars for sale."
            : "Verify your phone number to complete your registration."}
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            {isPhoneVerificationSent && (
              <TabsTrigger value="verify-phone">Verify Phone</TabsTrigger>
            )}
          </TabsList>
          <Separator className="mb-4" />

          <TabsContent value="login" className="space-y-6">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleSignIn)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
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
                        <Input type="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-car-blue hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-car-blue hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="verify-phone" className="space-y-6">
            {isPhoneVerificationSent ? (
              <>
                <p className="text-muted-foreground">
                  We have sent a verification code to your phone number. Please enter the code below to verify your
                  account.
                </p>
                <Form {...verifyPhoneForm}>
                  <form onSubmit={verifyPhoneForm.handleSubmit(handleVerifyCode)} className="space-y-4">
                    <FormField
                      control={verifyPhoneForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Code</FormLabel>
                          <FormControl>
                            <Input placeholder="######" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-car-blue hover:bg-blue-700" disabled={isSubmitting}>
                      {isSubmitting ? "Verifying..." : "Verify"}
                    </Button>
                  </form>
                </Form>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">
                  Before you can start listing your cars, we need to verify your phone number.
                </p>
                <Button
                  onClick={() => handleSendVerificationCode(registerForm.getValues().phoneNumber)}
                  className="bg-car-blue hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending Code..." : "Send Verification Code"}
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;
