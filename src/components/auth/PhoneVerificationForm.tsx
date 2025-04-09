
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const verifyPhoneSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

interface PhoneVerificationFormProps {
  onVerify: (otp: string) => Promise<void>;
  onBack: () => void;
  onResendCode: () => Promise<void>;
  phoneNumber: string;
  isLoading: boolean;
}

const PhoneVerificationForm = ({ 
  onVerify, 
  onBack, 
  onResendCode,
  phoneNumber,
  isLoading 
}: PhoneVerificationFormProps) => {
  const verifyPhoneForm = useForm<z.infer<typeof verifyPhoneSchema>>({
    resolver: zodResolver(verifyPhoneSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof verifyPhoneSchema>) => {
    await onVerify(values.otp);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-4 px-0" 
        onClick={onBack}
        disabled={isLoading}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <Form {...verifyPhoneForm}>
        <form onSubmit={verifyPhoneForm.handleSubmit(onSubmit)} className="space-y-4">
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
              onClick={onResendCode}
              disabled={isLoading}
            >
              Resend Code
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PhoneVerificationForm;
