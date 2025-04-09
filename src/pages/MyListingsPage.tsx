
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Car, ChevronLeft, AlertCircle, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice, formatMileage } from "@/data/cars";
import { cn } from "@/lib/utils";
import { CarListingRow, supabase, addDemoCarListings } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchMyListings } from "@/services/sellCarService";

const MyListingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<CarListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingDemoListings, setAddingDemoListings] = useState(false);

  const getListings = async () => {
    try {
      setLoading(true);
      
      const listingsData = await fetchMyListings(user?.id || '');
      setListings(listingsData);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to load your listings. Please try again later.");
      toast({
        title: "Error",
        description: "There was a problem loading your listings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth", { state: { from: "/my-listings" } });
      return;
    }

    getListings();
  }, [user, navigate, toast]);

  const handleAddDemoListings = async () => {
    if (!user) return;
    
    try {
      setAddingDemoListings(true);
      await addDemoCarListings(user.id);
      
      toast({
        title: "Success",
        description: "10 demo car listings have been added to your account.",
        variant: "default"
      });
      
      // Refresh listings
      await getListings();
    } catch (error) {
      console.error("Error adding demo listings:", error);
      toast({
        title: "Error",
        description: "Failed to add demo listings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAddingDemoListings(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "sold":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
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
            Back to home
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <Car className="h-8 w-8 text-car-blue mr-3" />
            <h1 className="text-3xl font-bold">My Listings</h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => navigate("/sell")}
              className="bg-car-blue hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Listing
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleAddDemoListings}
              disabled={addingDemoListings}
            >
              {addingDemoListings ? "Adding..." : "Add 10 Demo Listings"}
            </Button>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        {loading ? (
          <div className="text-center py-12">
            <p>Loading your listings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-6">You haven't created any car listings yet.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => navigate("/sell")}
                className="bg-car-blue hover:bg-blue-700"
              >
                Create Your First Listing
              </Button>
              <Button 
                variant="outline"
                onClick={handleAddDemoListings}
                disabled={addingDemoListings}
              >
                {addingDemoListings ? "Adding..." : "Add Demo Listings"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="relative aspect-video overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0]} 
                      alt={`${listing.year} ${listing.make} ${listing.model}`} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <Car className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <Badge 
                    className={cn(
                      "absolute top-2 right-2 text-sm px-3 py-1.5",
                      getStatusColor(listing.status)
                    )}
                  >
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">
                      {listing.year} {listing.make} {listing.model}
                    </h3>
                    <span className="font-bold text-car-blue">
                      {formatPrice(listing.price)}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatMileage(listing.mileage)}</span>
                    <span className="text-xs">•</span>
                    <span>{listing.location}</span>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Listed on {new Date(listing.created_at).toLocaleDateString()}
                    </span>
                    <Link 
                      to={`/car/${listing.id}`} 
                      className="text-car-blue hover:underline text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MyListingsPage;
