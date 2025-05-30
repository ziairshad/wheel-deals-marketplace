
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCarById } from "@/integrations/supabase/client";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import VehicleInfoForm from "@/components/sell/VehicleInfoForm";
import ContactInfoForm from "@/components/sell/ContactInfoForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { sellCarFormSchema } from "@/components/sell/SellCarFormSchema";
import { submitCarListing } from "@/services/sellCarService";
import { CarFormData } from "@/types/car";

interface EditCarPageContentProps {
  carId: string;
}

const EditCarPageContent: React.FC<EditCarPageContentProps> = ({ carId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: car, isLoading, error } = useQuery({
    queryKey: ['car', carId],
    queryFn: () => fetchCarById(carId)
  });
  
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
      regionalSpecs: "",
    },
  });
  
  // Initialize form with car data when it's loaded
  useEffect(() => {
    if (car) {
      console.log("Fetched car data:", car);
      
      // Convert data types to match form schema
      const formData = {
        make: car.make,
        model: car.model,
        year: car.year.toString(),
        price: car.price.toString(),
        mileage: car.mileage.toString(),
        bodyType: car.body_type || "",
        transmission: car.transmission || "",
        fuelType: car.fuel_type || "",
        color: car.exterior_color || "",
        location: car.location,
        description: car.description || "",
        contactName: car.contact_name || "",
        contactPhone: car.contact_phone || "",
        contactEmail: car.contact_email || "",
        vin: car.vin || "",
        regionalSpecs: car.regional_specs || "",
      };
      
      console.log("Converted form data:", formData);
      form.reset(formData);
      
      // Set existing images
      if (car.images && car.images.length > 0) {
        console.log("Setting existing images:", car.images);
        setExistingImages(car.images);
      }
    }
  }, [car, form]);
  
  const onSubmit = async (data: z.infer<typeof sellCarFormSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to edit a listing",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Ensure all required fields are present in the data passed to submitCarListing
      const carFormData: CarFormData = {
        make: data.make,
        model: data.model,
        year: data.year,
        price: data.price,
        mileage: data.mileage,
        bodyType: data.bodyType,
        transmission: data.transmission,
        fuelType: data.fuelType,
        color: data.color,
        location: data.location,
        description: data.description,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        vin: data.vin,
        regionalSpecs: data.regionalSpecs,
      };
      
      await submitCarListing(carFormData, user.id, images, carId, existingImages);
      
      toast({
        title: "Success",
        description: "Your listing has been updated",
      });
      
      navigate(`/car/${carId}`);
    } catch (error) {
      console.error("Error updating listing:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your listing",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="text-center py-12">Loading car details...</div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <p className="text-red-500">Error loading car details. Please try again.</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 max-w-3xl">
        <div className="flex items-center mb-6">
          <Car className="h-8 w-8 text-car-blue mr-3" />
          <h1 className="text-3xl font-bold">Edit Your Car Listing</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Update your car listing information below. All fields marked with * are required.
        </p>
        
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <VehicleInfoForm 
                images={images} 
                setImages={setImages} 
                existingImages={existingImages}
                onExistingImagesChange={setExistingImages}
              />
              <ContactInfoForm />
              
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/my-listings")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="lg"
                  className="px-8 bg-car-blue hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Listing"}
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

export default EditCarPageContent;
