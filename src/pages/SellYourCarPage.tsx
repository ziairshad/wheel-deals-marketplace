
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Car, FileUp, Info } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { emirates } from "@/data/cars";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
});

const bodyTypes = [
  "Sedan", "SUV", "Truck", "Hatchback", 
  "Coupe", "Convertible", "Van", "Wagon"
];

const transmissions = ["Automatic", "Manual"];
const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];

const SellYourCarPageContent = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      // Limit to 10 images
      const totalImages = [...images, ...newFiles].slice(0, 10);
      setImages(totalImages);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

      // Insert car listing into database
      const { data: carData, error: carError } = await supabase
        .from('car_listings')
        .insert([
          {
            user_id: user.id,
            make: values.make,
            model: values.model,
            year: parseInt(values.year),
            price: parseInt(values.price),
            mileage: parseInt(values.mileage),
            body_type: values.bodyType,
            transmission: values.transmission,
            fuel_type: values.fuelType,
            exterior_color: values.color,
            location: values.location,
            description: values.description,
            contact_name: values.contactName,
            contact_phone: values.contactPhone,
            contact_email: values.contactEmail,
            status: 'pending',
            vin: values.vin,
          }
        ])
        .select()
        .single();

      if (carError) {
        throw carError;
      }

      // Upload images
      const carId = carData.id;
      const imageUrls = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${carId}/${i}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('car_images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('car_images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      // Update car listing with image URLs
      const { error: updateError } = await supabase
        .from('car_listings')
        .update({ images: imageUrls })
        .eq('id', carId);

      if (updateError) {
        throw updateError;
      }

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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Vehicle Information Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Vehicle Information
              </h2>
              <Separator className="mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Toyota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Camry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2020" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (AED) *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mileage (KM) *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIN (Vehicle Identification Number) *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 1HGCM82633A123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bodyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select body type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bodyTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmission *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transmission" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transmissions.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fuelTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Black" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select emirate" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {emirates.map(emirate => (
                            <SelectItem key={emirate} value={emirate}>{emirate}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your car, include features, condition, and any other relevant details."
                          rows={5}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-6">
                <FormLabel className="block mb-2">Photos *</FormLabel>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileUp className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop images here, or click to browse
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Upload Photos
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <FormDescription className="mt-2">
                    Upload up to 10 photos. First photo will be the main listing image.
                  </FormDescription>
                  
                  {images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">{images.length} photo{images.length > 1 ? 's' : ''} selected</p>
                      <div className="flex flex-wrap gap-2">
                        {images.map((image, index) => (
                          <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden border">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                              onClick={() => setImages(images.filter((_, i) => i !== index))}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact Information Section */}
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
                        <Input placeholder="Your full name" {...field} />
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
                        <Input placeholder="Your phone number" {...field} />
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
                        <Input placeholder="Your email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
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
