
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CarListingRow } from "@/integrations/supabase/client";
import { 
  fetchMyListings, 
  updateCarListingStatus, 
  deleteCarListing 
} from "@/services/sellCarService";
import { useNavigate } from "react-router-dom";

export const useListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<CarListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getListings = useCallback(async () => {
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
  }, [user, toast]);

  useEffect(() => {
    if (!user) {
      navigate("/auth", { state: { from: "/my-listings" } });
      return;
    }

    getListings();
  }, [user, navigate, getListings]);

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

  const openDeleteDialog = (id: string) => {
    setListingToDelete(id);
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    // Only allow closing if not currently deleting
    if (!isDeleting) {
      setShowDeleteDialog(false);
      setListingToDelete(null);
    }
  };

  const handleDeleteListing = async () => {
    if (!listingToDelete || isDeleting) return;
    
    try {
      setIsDeleting(true);
      
      await deleteCarListing(listingToDelete);
      
      // Store the ID before clearing it
      const deletedId = listingToDelete;
      
      // Update state to remove the deleted listing
      setListings(prevListings => 
        prevListings.filter(listing => listing.id !== deletedId)
      );
      
      // Reset states immediately
      setShowDeleteDialog(false);
      setListingToDelete(null);
      setIsDeleting(false);
      
      toast({
        title: "Success",
        description: "Car listing deleted successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error deleting listing:", error);
      
      // Reset the deleting state so user can try again
      setIsDeleting(false);
      
      toast({
        title: "Error",
        description: "Failed to delete the listing.",
        variant: "destructive"
      });
    }
  };

  return {
    listings,
    loading,
    error,
    showDeleteDialog,
    isDeleting,
    handleStatusChange,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteListing,
    setShowDeleteDialog
  };
};
