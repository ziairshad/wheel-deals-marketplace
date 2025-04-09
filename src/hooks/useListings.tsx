
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

  // Clean implementation of opening delete dialog
  const openDeleteDialog = (id: string) => {
    if (isDeleting) return; // Prevent multiple dialogs
    setListingToDelete(id);
    setShowDeleteDialog(true);
  };

  // Safe implementation of closing dialog
  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setShowDeleteDialog(false);
  };

  // This function runs when the dialog is fully closed (animation complete)
  const resetDeleteState = () => {
    // Only reset the ID if we're not in the process of deleting
    if (!isDeleting) {
      setListingToDelete(null);
    }
  };

  const handleDeleteListing = async () => {
    if (!listingToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Store the ID before any other operations
      const deletedId = listingToDelete;
      
      // Perform the deletion
      await deleteCarListing(deletedId);
      
      // Update local state to remove the deleted listing
      setListings(prevListings => 
        prevListings.filter(listing => listing.id !== deletedId)
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
      // First close the dialog
      setShowDeleteDialog(false);
      
      // Then reset deleting state
      setIsDeleting(false);
      
      // Finally clear the ID after a short delay
      setTimeout(() => {
        setListingToDelete(null);
      }, 150);
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
