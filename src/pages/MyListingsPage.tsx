
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Car, ChevronLeft, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useListings } from "@/hooks/useListings";
import ListingsGrid from "@/components/listings/ListingsGrid";
import DeleteListingDialog from "@/components/listings/DeleteListingDialog";

const MyListingsPage = () => {
  const navigate = useNavigate();
  const {
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
  } = useListings();

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
        
        <ListingsGrid
          listings={listings}
          onStatusChange={handleStatusChange}
          onDeleteClick={openDeleteDialog}
          loading={loading}
          error={error}
        />
      </main>
      
      <Footer />

      {/* Only render dialog when needed */}
      {showDeleteDialog && (
        <DeleteListingDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onClose={closeDeleteDialog}
          onConfirm={handleDeleteListing}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default MyListingsPage;
