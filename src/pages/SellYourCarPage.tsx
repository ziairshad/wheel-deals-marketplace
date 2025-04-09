import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Car } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import VehicleInfoForm from "@/components/sell/VehicleInfoForm";
import ContactInfoForm from "@/components/sell/ContactInfoForm";
import { submitCarListing, fetchCarListingById } from "@/services/sellCarService";
import { CarFormData } from "@/types/car";
import { CarListingRow } from "@/integrations/supabase/client";

// Define the form schema
const formSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  price: z.string().min(1, "Price is required"),
  mileage: z.string().min(1, "Mileage is required"),
  bodyType: z.string().min(1, "Body type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  color: z.string().min(1, "Color is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  contactName: z.string().min(1, "Contact name is required"),
  contactPhone: z.string().min(7, "Valid phone number required"),
  contactEmail: z.string().email("Invalid email address"),
  vin: z.string().min(17, "VIN must be at least 17 characters").max(17, "VIN must be exactly 17 characters"),
  id: z.string().optional(),
});

const SellYourCarPageContent = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [isEditMode, setIsEditMode] = useState(!!editId);
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  // Fetch car data if in edit mode
  useEffect(() => {
    if (editId) {
      const fetchCarData = async () => {
        setLoading(true);
        try {
          const carData = await fetchCarListingById(editId);
          if (carData) {
            // Convert numbers to strings for the form
            form.reset({
              id: carData.id,
              make: carData.make,
              model: carData.model,
              year: String(carData.year),
              price: String(carData.price),
              mileage: String(carData.mileage),
              bodyType: carData.body_type || "",
              transmission: carData.transmission || "",
              fuelType: carData.fuel_type || "",
              color: carData.exterior_color || "", // Changed from color to exterior_color
              location: carData.location,
              description: carData.description || "",
              contactName: carData.contact_name || "",
              contactPhone: carData.contact_phone || "",
              contactEmail: carData.contact_email || "",
              vin: carData.vin || "",
            });
            
            // Set existing images
            if (carData.images && carData.images.length > 0) {
              setExistingImages(carData.images);
            }
          }
        } catch (error) {
          console.error("Error fetching car data:", error);
          toast({
            title: "Error",
            description: "Failed to load car listing data.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchCarData();
    }
  }, [editId, form, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a listing",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0 && !isEditMode) {
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
        title: isEditMode ? "Listing updated!" : "Listing submitted!",
        description: isEditMode 
          ? "Your car listing has been updated successfully." 
          : "Your car listing has been submitted for review.",
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex justify-center items-center">
          <p>Loading...</p>
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
          <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Your Listing' : 'Sell Your Car'}</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Complete the form below to {isEditMode ? 'update' : 'list'} your car for sale. All fields marked with * are required.
        </p>
        
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <VehicleInfoForm 
                images={images} 
                setImages={setImages} 
                existingImages={existingImages}
              />
              <ContactInfoForm />
              
              <div className="flex justify-center mt-8">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="px-8 bg-car-blue hover:bg-blue-700"
                  disabled={uploading}
                >
                  {uploading ? "Submitting..." : (isEditMode ? "Update Listing" : "Submit Listing")}
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

// Wrap the component with ProtectedRoute
const SellYourCarPage = () => {
  return <SellYourCarPageContent />;
};

export default SellYourCarPage;
