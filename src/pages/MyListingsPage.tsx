
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Car, ChevronLeft, AlertCircle, Plus, Edit, Trash, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice, formatMileage } from "@/data/cars";
import { cn } from "@/lib/utils";
import { CarListingRow, supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchMyListings, updateCarListingStatus, deleteCarListing } from "@/services/sellCarService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MyListingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<CarListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);

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

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateCarListingStatus(id, status);
      
      toast({
        title: "Success",
        description: `Car listing marked as ${status}.`,
        variant: "default"
      });
      
      // Update the listings in our state
      setListings(prevListings => 
        prevListings.map(listing => 
          listing.id === id ? { ...listing, status } : listing
        )
      );
    } catch (error) {
      console.error(`Error updating listing status:`, error);
      toast({
        title: "Error",
        description: "Failed to update listing status.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      await deleteCarListing(id);
      
      toast({
        title: "Success",
        description: "Car listing deleted successfully.",
        variant: "default"
      });
      
      // Remove the listing from our state
      setListings(prevListings => 
        prevListings.filter(listing => listing.id !== id)
      );
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error",
        description: "Failed to delete the listing.",
        variant: "destructive"
      });
    } finally {
      setListingToDelete(null);
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
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate("/sell")}
                className="bg-car-blue hover:bg-blue-700"
              >
                Create Your First Listing
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <div key={listing.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="relative aspect-auto h-32 overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0]} 
                      alt={`${listing.year} ${listing.make} ${listing.model}`} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <Car className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <Badge 
                    className={cn(
                      "absolute top-2 right-2 text-xs px-2 py-0.5",
                      getStatusColor(listing.status)
                    )}
                  >
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-sm truncate">
                      {listing.year} {listing.make} {listing.model}
                    </h3>
                    <span className="font-bold text-car-blue text-sm">
                      {formatPrice(listing.price)}
                    </span>
                  </div>
                  
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatMileage(listing.mileage)}</span>
                    <span className="text-xs">•</span>
                    <span className="truncate">{listing.location}</span>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 px-2 text-xs"
                        onClick={() => navigate(`/car/${listing.id}`)}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-7 px-2 text-xs" 
                        onClick={() => navigate(`/sell?edit=${listing.id}`)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="flex space-x-1">
                      {listing.status !== "sold" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 px-2 text-xs bg-green-50 text-green-600 hover:text-green-700 hover:bg-green-100 border-green-200"
                          onClick={() => handleStatusChange(listing.id, "sold")}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Sold
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 px-2 text-xs bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 border-red-200"
                            onClick={() => setListingToDelete(listing.id)}
                          >
                            <Trash className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this car listing. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setListingToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteListing(listing.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
