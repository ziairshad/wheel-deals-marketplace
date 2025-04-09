
import React from "react";
import { useFormContext } from "react-hook-form";
import { Info } from "lucide-react";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const ContactInfoForm: React.FC = () => {
  const form = useFormContext();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Info className="h-5 w-5 mr-2" />
        Contact Information
      </h2>
      <Separator className="mb-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your full name" 
                  {...field} 
                  readOnly 
                  className="bg-gray-100" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your phone number" 
                  {...field} 
                  readOnly 
                  className="bg-gray-100" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your email address" 
                  {...field} 
                  readOnly 
                  className="bg-gray-100" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ContactInfoForm;
