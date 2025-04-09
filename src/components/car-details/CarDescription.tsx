
import React from "react";
import { CarListingRow } from "@/integrations/supabase/client";

interface CarDescriptionProps {
  car: CarListingRow;
}

const CarDescription = ({ car }: CarDescriptionProps) => {
  return (
    <div className="bg-white border rounded-lg p-5">
      <h2 className="text-xl font-semibold mb-3">Description</h2>
      <p className="text-muted-foreground whitespace-pre-line">
        {car.description || "No description provided."}
      </p>
    </div>
  );
};

export default CarDescription;
