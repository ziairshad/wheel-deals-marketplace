
import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Car, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import VehicleInfoForm from "@/components/sell/VehicleInfoForm";
import ContactInfoForm from "@/components/sell/ContactInfoForm";
import { fetchCarById, submitCarListing } from "@/services/sellCarService";
import { CarFormData, convertToFormData } from "@/types/car";
import { sellCarFormSchema } from "@/components/sell/SellCarFormSchema";

interface EditCarPageContentProps {
  carId: string;
}

const EditCarPageContent: React.FC<EditCarPageContentProps> = ({ carId }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
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

  // Fetch car data for editing
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        console.log("Fetching car with ID:", carId);
        const carData = await fetchCarById(carId);
        
        if (carData) {
          console.log("Fetched car data:", carData);
          
          // Convert from API format to form format
          const formData = convertToFormData(carData);
          console.log("Converted form data:", formData);
          
          // Set form values
          Object.entries(formData).forEach(([key, value]) => {
            form.setValue(key as any, value);
          });
          
          // Store existing images
          if (carData.images && carData.images.length > 0) {
            setExistingImages(carData.images);
            console.log("Setting existing images:", carData.images);
          }
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
        toast({
          title: "Error",
          description: "Failed to load car details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarData();
  }, [carId, form, toast]);

  const onSubmit = async (values: z.infer<typeof sellCarFormSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update a listing",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      await submitCarListing(values as CarFormData, user.id, images, carId);

      toast({
        title: "Listing updated!",
        description: "Your car listing has been updated successfully.",
      });
      
      navigate('/my-listings');
    } catch (error) {
      console.error("Error updating listing:", error);
      toast({
        title: "Error",
        description: "There was an error updating your listing. Please try again.",
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
        <div className="mb-6">
          <Link 
            to="/my-listings" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to my listings
          </Link>
        </div>
        
        <div className="flex items-center mb-6">
          <Car className="h-8 w-8 text-car-blue mr-3" />
          <h1 className="text-3xl font-bold">Edit Your Car</h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <p>Loading car details...</p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-8">
              Update your car listing details below. All fields marked with * are required.
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
                      {uploading ? "Updating..." : "Update Listing"}
                    </Button>
                  </div>
                </form>
              </Form>
            </FormProvider>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default EditCarPageContent;
