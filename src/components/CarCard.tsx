
import { Link } from "react-router-dom";
import { Car, formatPrice, formatMileage } from "@/data/cars";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CarListingRow } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface CarCardProps {
  car: Car | CarListingRow;
}

const CarCard = ({ car }: CarCardProps) => {
  // Determine if we're dealing with a sample Car or a CarListingRow from Supabase
  const isCarListingRow = 'user_id' in car;
  
  // Extract properties based on the car type
  const id = car.id;
  const make = car.make;
  const model = car.model;
  const year = car.year;
  const price = car.price;
  const mileage = car.mileage;
  const location = car.location;
  const status = car.status;
  
  // Get regional specs if available
  const regionalSpecs = isCarListingRow ? car.regional_specs : car.regionalSpecs;
  
  // Handle images differently based on car type
  const images = isCarListingRow 
    ? (car.images || []) 
    : car.images;
  
  // Format the created date if it exists with the DD MMMM YYYY format
  const createdAt = isCarListingRow && car.created_at 
    ? format(new Date(car.created_at), "dd MMMM yyyy")
    : null;
  
  // Use a placeholder if no images
  const imageUrl = images && images.length > 0 
    ? images[0] 
    : '/placeholder.svg';
  
  return (
    <Link to={`/car/${id}`} className="car-card block">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={imageUrl} 
          alt={`${year} ${make} ${model}`} 
          className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
        />
        {status !== "available" && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge className={cn(
              "text-sm px-3 py-1 uppercase",
              status === "sold" ? "bg-red-600" : "bg-yellow-600"
            )}>
              {status}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg truncate">
            {year} {make} {model}
          </h3>
          <Badge variant="outline" className="car-badge bg-blue-50 text-primary border-primary">
            {formatPrice(price)}
          </Badge>
        </div>
        
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{formatMileage(mileage)}</span>
          <span className="text-xs">•</span>
          {regionalSpecs && (
            <>
              <span className="truncate">{regionalSpecs}</span>
              <span className="text-xs">•</span>
            </>
          )}
          <span className="truncate">{location}</span>
        </div>
        
        {createdAt && (
          <div className="mt-1 text-xs text-muted-foreground">
            Listed: {createdAt}
          </div>
        )}
      </div>
    </Link>
  );
};

export default CarCard;
