
import { useState } from "react";
import { Car, Truck, PlaneTakeoff, Bike } from "lucide-react";
import { cn } from "@/lib/utils";

interface BodyTypeSelectorProps {
  bodyTypes: string[];
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

interface BodyTypeOption {
  value: string;
  label: string;
  icon: React.ElementType;
}

const bodyTypeOptions: BodyTypeOption[] = [
  { value: "Sedan", label: "Sedan", icon: Car },
  { value: "SUV", label: "SUV", icon: Car },
  { value: "Truck", label: "Truck", icon: Truck },
  { value: "Hatchback", label: "Hatchback", icon: Car },
  { value: "Coupe", label: "Coupe", icon: Car },
  { value: "Convertible", label: "Convertible", icon: Car },
  { value: "Van", label: "Van", icon: Truck },
  { value: "Wagon", label: "Wagon", icon: Car },
];

export const BodyTypeSelector = ({ 
  bodyTypes, 
  selectedTypes, 
  onChange 
}: BodyTypeSelectorProps) => {
  // Filter options to only include body types that exist in our data
  const availableOptions = bodyTypeOptions.filter(option => 
    bodyTypes.includes(option.value)
  );
  
  // Add any body types from the data that aren't in our predefined options
  const missingBodyTypes = bodyTypes.filter(
    type => !bodyTypeOptions.some(option => option.value === type)
  );
  
  const allOptions = [
    ...availableOptions,
    ...missingBodyTypes.map(type => ({
      value: type,
      label: type,
      icon: Bike // Changed from Bicycle to Bike which exists in lucide-react
    }))
  ];

  const toggleBodyType = (value: string) => {
    if (selectedTypes.includes(value)) {
      onChange(selectedTypes.filter(t => t !== value));
    } else {
      onChange([...selectedTypes, value]);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3">Body Type</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {allOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleBodyType(option.value)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg border transition-colors",
              selectedTypes.includes(option.value)
                ? "bg-primary/10 border-primary text-primary"
                : "bg-background border-border hover:bg-accent"
            )}
            type="button"
          >
            <option.icon className="h-8 w-8 mb-2" />
            <span className="text-xs">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BodyTypeSelector;
