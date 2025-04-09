
import React, { useState } from "react";
import { 
  Calendar, 
  Gauge, 
  Fuel, 
  RefreshCw,
  Copy,
  Globe,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMileage } from "@/data/cars";
import { useToast } from "@/hooks/use-toast";
import { CarListingRow } from "@/integrations/supabase/client";

interface CarSpecsProps {
  car: CarListingRow;
}

const CarSpecs = ({ car }: CarSpecsProps) => {
  const { toast } = useToast();
  const [copySuccess, setCopySuccess] = useState(false);

  const copyVinToClipboard = () => {
    if (!car?.vin) return;
    
    navigator.clipboard.writeText(car.vin)
      .then(() => {
        setCopySuccess(true);
        toast({
          title: "VIN Copied",
          description: "Vehicle Identification Number has been copied to clipboard."
        });
        
        // Reset the copy success state after 2 seconds
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy VIN: ', err);
        toast({
          title: "Copy Failed",
          description: "Could not copy the VIN. Please try again.",
          variant: "destructive"
        });
      });
  };

  return (
    <div className="space-y-6">
      {/* Car Specs Grid - All specs in a single grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Year */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center text-muted-foreground mb-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-xs">Year</span>
          </div>
          <span className="text-lg font-medium">{car.year}</span>
        </div>
        
        {/* Mileage */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center text-muted-foreground mb-1">
            <Gauge className="h-4 w-4 mr-1" />
            <span className="text-xs">Mileage</span>
          </div>
          <span className="text-lg font-medium">{formatMileage(car.mileage)}</span>
        </div>
        
        {/* Fuel */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center text-muted-foreground mb-1">
            <Fuel className="h-4 w-4 mr-1" />
            <span className="text-xs">Fuel</span>
          </div>
          <span className="text-lg font-medium">{car.fuel_type || 'Not specified'}</span>
        </div>
        
        {/* Transmission */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center text-muted-foreground mb-1">
            <RefreshCw className="h-4 w-4 mr-1" />
            <span className="text-xs">Transmission</span>
          </div>
          <span className="text-lg font-medium">{car.transmission || 'Not specified'}</span>
        </div>
        
        {/* Regional Specs */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center text-muted-foreground mb-1">
            <Globe className="h-4 w-4 mr-1" />
            <span className="text-xs">Regional Specs</span>
          </div>
          <span className="text-lg font-medium">{car.regional_specs || 'Not specified'}</span>
        </div>

        {/* VIN Number */}
        {car.vin && (
          <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
            <div>
              <div className="flex items-center text-muted-foreground mb-1">
                <FileText className="h-4 w-4 mr-1" />
                <span className="text-xs">VIN</span>
              </div>
              <span className="text-lg font-medium font-mono break-all">{car.vin}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={copyVinToClipboard}
              className="h-8 w-8 flex-shrink-0"
              title="Copy VIN"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarSpecs;
