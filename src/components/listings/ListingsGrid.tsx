
import React from "react";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CarListingRow } from "@/integrations/supabase/client";
import ListingCard from "./ListingCard";

interface ListingsGridProps {
  listings: CarListingRow[];
  onStatusChange: (id: string, status: string) => Promise<void>;
  onDeleteClick: (id: string) => void;
  loading: boolean;
  error: string | null;
}

const ListingsGrid = ({ 
  listings, 
  onStatusChange, 
  onDeleteClick, 
  loading, 
  error 
}: ListingsGridProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading your listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
        <Car className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onStatusChange={onStatusChange}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};

export default ListingsGrid;
