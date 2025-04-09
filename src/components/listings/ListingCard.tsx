
import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";
import { CarListingRow } from "@/integrations/supabase/client";
import { formatPrice, formatMileage } from "@/data/cars";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ListingCardProps {
  listing: CarListingRow;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onDeleteClick: (id: string) => void;
}

const ListingCard = ({ listing, onStatusChange, onDeleteClick }: ListingCardProps) => {
  const navigate = useNavigate();

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
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="relative aspect-video overflow-hidden">
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
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-base truncate">
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
        
        <div className="mt-3 flex items-center justify-between">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 px-3 text-xs"
            onClick={() => navigate(`/car/${listing.id}`)}
          >
            View Details
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/edit/${listing.id}`)}>
                Edit
              </DropdownMenuItem>
              
              {listing.status !== "sold" && (
                <DropdownMenuItem 
                  onClick={() => onStatusChange(listing.id, "sold")}
                  className="text-green-600"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Sold
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => onDeleteClick(listing.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
