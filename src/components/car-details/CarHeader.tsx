
import React from "react";
import { formatPrice } from "@/data/cars";
import { Badge } from "@/components/ui/badge";
import { CarListingRow } from "@/integrations/supabase/client";

interface CarHeaderProps {
  car: CarListingRow;
}

const CarHeader = ({ car }: CarHeaderProps) => {
  const carTitle = `${car.year} ${car.make} ${car.model}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          {carTitle}
        </h1>
        <div className="flex items-center mt-1">
          {car.status !== "available" && (
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
            </Badge>
          )}
          <span className="text-sm text-muted-foreground ml-2">
            Listed on {new Date(car.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="text-3xl font-bold text-car-blue">
        {formatPrice(car.price)}
      </div>
    </div>
  );
};

export default CarHeader;
