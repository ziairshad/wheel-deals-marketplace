
import React, { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import VehicleInfoForm from "@/components/sell/VehicleInfoForm";
import ContactInfoForm from "@/components/sell/ContactInfoForm";
import { fetchCarById, submitCarListing } from "@/services/sellCarService";
import { CarFormData, convertToFormData } from "@/types/car";
import { sellCarFormSchema } from "@/components/sell/SellCarFormSchema";

const SellCarPageContent = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: editId } = useParams();
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

  // Fetch car data if we're in edit mode
  useEffect(() => {
    const fetchCarData = async () => {
      if (!editId) return;
      
      // Make sure editId is not a template literal but the actual ID
      if (editId === ':id') return;
      
      try {
        setLoading(true);
        console.log("Fetching car with ID:", editId);
        const carData = await fetchCarById(editId);
        
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
  }, [editId, form, toast]);

  const onSubmit = async (values: z.infer<typeof sellCarFormSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a listing",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0 && existingImages.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      await submitCarListing(values as CarFormData, user.id, images, editId);

      toast({
        title: editId ? "Listing updated!" : "Listing submitted!",
        description: editId 
          ? "Your car listing has been updated successfully." 
          : "Your car listing has been submitted for review.",
      });
      
      form.reset();
      setImages([]);
      setExistingImages([]);
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
          <h1 className="text-3xl font-bold">{editId ? 'Edit Your Car' : 'Sell Your Car'}</h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <p>Loading car details...</p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-8">
              Complete the form below to {editId ? 'update' : 'list'} your car for sale. All fields marked with * are required.
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
                      {uploading ? "Submitting..." : (editId ? "Update Listing" : "Submit Listing")}
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

export default SellCarPageContent;
