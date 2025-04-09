
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Car } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import VehicleInfoForm from "@/components/sell/VehicleInfoForm";
import ContactInfoForm from "@/components/sell/ContactInfoForm";
import { submitCarListing } from "@/services/sellCarService";
import { CarFormData } from "@/types/car";
import { sellCarFormSchema } from "@/components/sell/SellCarFormSchema";

interface SellCarPageContentProps {
  isEditMode?: boolean;
}

const SellCarPageContent: React.FC<SellCarPageContentProps> = ({ isEditMode = false }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const form = useForm<z.infer<typeof sellCarFormSchema>>({
    resolver: zodResolver(sellCarFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      bodyType: "",
      transmission: "",
      fuelType: "",
      color: "",
      location: "",
      description: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      vin: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof sellCarFormSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a listing",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      await submitCarListing(values as CarFormData, user.id, images);

      toast({
        title: "Listing submitted!",
        description: "Your car listing has been submitted for review.",
      });
      
      form.reset();
      setImages([]);
      navigate('/my-listings');
    } catch (error) {
      console.error("Error submitting listing:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 max-w-3xl">
        <div className="flex items-center mb-6">
          <Car className="h-8 w-8 text-car-blue mr-3" />
          <h1 className="text-3xl font-bold">Sell Your Car</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Complete the form below to list your car for sale. All fields marked with * are required.
        </p>
        
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <VehicleInfoForm 
                images={images} 
                setImages={setImages} 
              />
              <ContactInfoForm />
              
              <div className="flex justify-center mt-8">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="px-8 bg-car-blue hover:bg-blue-700"
                  disabled={uploading}
                >
                  {uploading ? "Submitting..." : "Submit Listing"}
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </main>
      
      <Footer />
    </div>
  );
};

export default SellCarPageContent;
