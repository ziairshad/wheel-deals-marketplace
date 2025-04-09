import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Car, 
  ChevronLeft, 
  Calendar, 
  Gauge, 
  Fuel, 
  RefreshCw, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  Check,
  Copy
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CarGallery from "@/components/CarGallery";
import { fetchCarById, CarListingRow } from "@/integrations/supabase/client";
import { formatPrice, formatMileage } from "@/data/cars";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const CarDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [copySuccess, setCopySuccess] = useState(false);

  const { data: car, isLoading, error } = useQuery({
    queryKey: ['car', id],
    queryFn: async () => {
      if (!id) throw new Error('Car ID is required');
      return await fetchCarById(id);
    }
  });

  const copyVinToClipboard = () => {
    if (!car?.vin) return;
    
    navigator.clipboard.writeText(car.vin)
      .then(() => {
        setCopySuccess(true);
        toast({
          title: "VIN Copied",
          description: "Vehicle Identification Number has been copied to clipboard."
        });
        
        // Reset the copy success state after 2 seconds
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy VIN: ', err);
        toast({
          title: "Copy Failed",
          description: "Could not copy the VIN. Please try again.",
          variant: "destructive"
        });
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="aspect-video w-full rounded-lg mb-6" />
              <div className="flex space-x-2 mb-8">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="w-24 h-24 rounded-md" />
                ))}
              </div>
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-64 w-full mb-6" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 text-center">
          <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Car Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The car listing you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button>Browse Available Cars</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const carTitle = `${car.year} ${car.make} ${car.model}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to listings
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Gallery */}
            <CarGallery 
              images={car.images || []} 
              title={carTitle} 
            />
            
            {/* Car Title & Price */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {carTitle}
                </h1>
                <div className="flex items-center mt-1">
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground ml-2">
                    Listed on {new Date(car.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-3xl font-bold text-car-blue">
                {formatPrice(car.price)}
              </div>
            </div>
            
            {/* Car Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-xs">Year</span>
                </div>
                <span className="text-lg font-medium">{car.year}</span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-muted-foreground mb-1">
                  <Gauge className="h-4 w-4 mr-1" />
                  <span className="text-xs">Mileage</span>
                </div>
                <span className="text-lg font-medium">{formatMileage(car.mileage)}</span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-muted-foreground mb-1">
                  <Fuel className="h-4 w-4 mr-1" />
                  <span className="text-xs">Fuel</span>
                </div>
                <span className="text-lg font-medium">{car.fuel_type || 'Not specified'}</span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-muted-foreground mb-1">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  <span className="text-xs">Transmission</span>
                </div>
                <span className="text-lg font-medium">{car.transmission || 'Not specified'}</span>
              </div>
            </div>

            {/* VIN Number */}
            {car.vin && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-muted-foreground text-sm mb-1">VIN (Vehicle Identification Number)</div>
                    <span className="text-base font-medium font-mono">{car.vin}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyVinToClipboard}
                    className="h-8 gap-1"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy VIN</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {car.description || "No description provided."}
              </p>
            </div>
          </div>
          
          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h2 className="font-semibold">Contact Information</h2>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
                  <div>
                    <div className="text-sm text-muted-foreground">Seller</div>
                    <div className="font-medium">{car.contact_name || "Not provided"}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium">{car.location}</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="font-medium">{car.contact_phone || "Not provided"}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">{car.contact_email || "Not provided"}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Safety Tips */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Safety Tips</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Meet in a public, well-lit place</li>
                <li>• Don't pay in advance or via wire transfer</li>
                <li>• Test drive the vehicle before purchasing</li>
                <li>• Verify the VIN and vehicle history</li>
                <li>• Consider having a mechanic inspect it</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CarDetailsPage;
