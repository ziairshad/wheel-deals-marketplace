
import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarGallery from "@/components/CarGallery";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

import { cars, formatPrice, formatMileage } from "@/data/cars";
import { cn } from "@/lib/utils";

const CarDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const car = cars.find((c) => c.id === id);
  
  useEffect(() => {
    if (!car) {
      navigate("/", { replace: true });
    }
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [car, navigate]);
  
  if (!car) {
    return null;
  }

  const handleContactSeller = () => {
    if (!user) {
      toast.error("Please sign in to contact the seller");
      navigate("/auth", { state: { from: `/car/${id}` } });
      return;
    }
    
    // Here would be the actual contact seller functionality
    toast.success("Contact request sent to seller!");
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("VIN copied to clipboard");
  };
  
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
          {/* Left column - car details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold">
                  {car.year} {car.make} {car.model}
                </h1>
                <Badge 
                  className={cn(
                    "text-sm px-3 py-1.5",
                    car.status === "available" 
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : car.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  )}
                >
                  {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2">{car.location}</p>
            </div>
            
            <CarGallery images={car.images} title={`${car.year} ${car.make} ${car.model}`} />
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Vehicle Description</h2>
              <p className="text-muted-foreground">{car.description}</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Features & Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {car.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-2 bg-gray-50 rounded"
                  >
                    <div className="h-2 w-2 rounded-full bg-car-blue mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column - Pricing & details */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-car-blue mb-4">
                {formatPrice(car.price)}
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Mileage</p>
                    <p className="font-medium">{formatMileage(car.mileage)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-medium">{car.year}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">VIN</span>
                    <span className="font-medium flex items-center">
                      {car.vin}
                      <button 
                        onClick={() => copyToClipboard(car.vin)}
                        className="ml-2 p-1 rounded-full hover:bg-gray-100"
                        aria-label="Copy VIN to clipboard"
                      >
                        <Copy className="h-4 w-4 text-gray-500" />
                      </button>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exterior Color</span>
                    <span className="font-medium">{car.exteriorColor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interior Color</span>
                    <span className="font-medium">{car.interiorColor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Type</span>
                    <span className="font-medium">{car.fuelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transmission</span>
                    <span className="font-medium">{car.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Body Type</span>
                    <span className="font-medium">{car.bodyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Drivetrain</span>
                    <span className="font-medium">{car.drivetrain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Engine</span>
                    <span className="font-medium">{car.engine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Listed Date</span>
                    <span className="font-medium">{car.listedDate}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Contact Seller</h2>
              <div className="mb-4">
                <p className="text-muted-foreground">
                  {car.sellerType === "dealer" ? "Dealership" : "Private Seller"}
                </p>
                <p className="font-medium">{car.sellerName}</p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-car-blue hover:bg-blue-700"
                  onClick={handleContactSeller}
                >
                  Call Seller
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleContactSeller}
                >
                  Email Seller
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CarDetailsPage;
