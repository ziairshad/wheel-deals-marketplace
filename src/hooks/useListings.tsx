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

  // Completely revised dialog management
  const openDeleteDialog = (id: string) => {
    // Only allow opening if not already open or deleting
    if (!showDeleteDialog && !isDeleting) {
      setListingToDelete(id);
      setShowDeleteDialog(true);
    }
  };

  const closeDeleteDialog = () => {
    // Only allow closing if not currently deleting
    if (!isDeleting) {
      setShowDeleteDialog(false);
    }
  };

  // Clean reset function that can be called when needed
  const resetDeleteState = useCallback(() => {
    if (!isDeleting) {
      setListingToDelete(null);
      setShowDeleteDialog(false);
    }
  }, [isDeleting]);

  const handleDeleteListing = async () => {
    if (!listingToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Perform the deletion
      await deleteCarListing(listingToDelete);
      
      // Update local state to remove the deleted listing
      setListings(prevListings => 
        prevListings.filter(listing => listing.id !== listingToDelete)
      );
      
      toast({
        title: "Success",
        description: "Car listing deleted successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error deleting listing:", error);
      
      toast({
        title: "Error",
        description: "Failed to delete the listing.",
        variant: "destructive"
      });
    } finally {
      // Reset all states in one batch to avoid UI glitches
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setListingToDelete(null);
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
    setShowDeleteDialog,
    resetDeleteState
  };
};
