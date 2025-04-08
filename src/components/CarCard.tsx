
import { Link } from "react-router-dom";
import { Car, formatPrice, formatMileage } from "@/data/cars";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  const { id, make, model, year, price, mileage, location, images, status } = car;
  
  return (
    <Link to={`/car/${id}`} className="car-card block">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={images[0]} 
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
          <Badge variant="outline" className="car-badge bg-blue-50 text-car-blue border-car-blue">
            {formatPrice(price)}
          </Badge>
        </div>
        
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{formatMileage(mileage)}</span>
          <span className="text-xs">•</span>
          <span className="truncate">{location}</span>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
