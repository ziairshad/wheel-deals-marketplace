
import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { emirates } from "@/data/cars";
import { FilterOptions } from "@/utils/filter-utils";

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterSidebar = ({ filters, onFilterChange }: FilterSidebarProps) => {
  const isMobile = useIsMobile();
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  
  // Define static values for dropdowns since we no longer derive them from cars prop
  const makes = ["Any", "Toyota", "Honda", "BMW", "Mercedes-Benz", "Audi", "Ford", "Chevrolet", "Nissan", "Hyundai", "Kia"];
  const bodyTypes = ["Sedan", "SUV", "Coupe", "Hatchback", "Convertible", "Truck", "Van"];
  const transmissions = ["Any", "Automatic", "Manual"];
  const fuelTypes = ["Any", "Petrol", "Diesel", "Hybrid", "Electric"];
  const locations = ["Any", ...emirates];
  
  // Default mileage values
  const minAvailableMileage = 0;
  const maxAvailableMileage = 200000;
  
  // Get models based on make
  const getModelsByMake = (make: string | null) => {
    if (!make || make === "Any") return ["Any"];
    
    // Basic mapping of makes to models
    const modelMap: Record<string, string[]> = {
      "Toyota": ["Any", "Camry", "Corolla", "RAV4", "Land Cruiser", "Prado"],
      "Honda": ["Any", "Civic", "Accord", "CR-V", "Pilot"],
      "BMW": ["Any", "3 Series", "5 Series", "X3", "X5", "X7"],
      "Mercedes-Benz": ["Any", "C-Class", "E-Class", "S-Class", "GLC", "GLE"],
      "Audi": ["Any", "A3", "A4", "A6", "Q3", "Q5", "Q7"],
      "Ford": ["Any", "Mustang", "F-150", "Explorer", "Edge"],
      "Chevrolet": ["Any", "Malibu", "Camaro", "Tahoe", "Suburban"],
      "Nissan": ["Any", "Altima", "Maxima", "Pathfinder", "Patrol"],
      "Hyundai": ["Any", "Elantra", "Sonata", "Tucson", "Santa Fe"],
      "Kia": ["Any", "Optima", "Sorento", "Sportage"]
    };
    
    return modelMap[make] || ["Any"];
  };
  
  const models = localFilters.make ? getModelsByMake(localFilters.make) : ["Any"];
  
  // Update when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleChange = (key: keyof FilterOptions, value: any) => {
    // If make changes, reset model
    if (key === 'make' && localFilters.make !== value) {
      setLocalFilters(prev => ({ 
        ...prev, 
        [key]: value,
        model: null 
      }));
    } else {
      setLocalFilters(prev => ({ ...prev, [key]: value }));
    }
  };
  
  const handleBodyTypeChange = (bodyTypes: string[]) => {
    setLocalFilters(prev => ({ ...prev, bodyTypes }));
  };
  
  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };
  
  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      make: null,
      model: null,
      minPrice: null,
      maxPrice: null,
      minYear: null,
      maxYear: null,
      bodyTypes: [],
      transmission: null,
      fuelType: null,
      location: null,
      minMileage: null,
      maxMileage: null,
      search: localFilters.search // Preserve the search value when clearing
    };
    
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };
  
  const formatMileage = (value: number) => `${value.toLocaleString()} km`;
  
  const renderFilterControls = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-3">Filter Vehicles</h2>
        
        {/* Body Type Selector (outside accordion) */}
        <div className="mb-3">
          <Label htmlFor="bodyType" className="mb-1 block text-sm">Body Type</Label>
          <Select 
            value={localFilters.bodyTypes.length === 1 ? localFilters.bodyTypes[0] : ""}
            onValueChange={(value) => {
              handleBodyTypeChange(value ? [value] : []);
            }}
          >
            <SelectTrigger id="bodyType" className="h-8">
              <SelectValue placeholder="Any Body Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {bodyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Accordion type="multiple" defaultValue={["make", "price", "year", "location", "mileage"]} className="space-y-2">
          <AccordionItem value="make" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Make & Model</AccordionTrigger>
            <AccordionContent className="pt-1 pb-2">
              <div className="space-y-2">
                <div>
                  <Label htmlFor="make" className="mb-1 block text-sm">Make</Label>
                  <Select 
                    value={localFilters.make || "Any"} 
                    onValueChange={(value) => handleChange("make", value === "Any" ? null : value)}
                  >
                    <SelectTrigger id="make" className="h-8">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      {makes.map((make) => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {localFilters.make && (
                  <div>
                    <Label htmlFor="model" className="mb-1 block text-sm">Model</Label>
                    <Select 
                      value={localFilters.model || "Any"} 
                      onValueChange={(value) => handleChange("model", value === "Any" ? null : value)}
                    >
                      <SelectTrigger id="model" className="h-8">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="location" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Location</AccordionTrigger>
            <AccordionContent className="pt-1 pb-2">
              <div>
                <Label htmlFor="location" className="mb-1 block text-sm">Emirate</Label>
                <Select 
                  value={localFilters.location || "Any"} 
                  onValueChange={(value) => handleChange("location", value === "Any" ? null : value)}
                >
                  <SelectTrigger id="location" className="h-8">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Price Range</AccordionTrigger>
            <AccordionContent className="pt-1 pb-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="minPrice" className="mb-1 block text-sm">Min Price (AED)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="Min"
                    className="h-8"
                    value={localFilters.minPrice || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : null;
                      handleChange("minPrice", value);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice" className="mb-1 block text-sm">Max Price (AED)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Max"
                    className="h-8"
                    value={localFilters.maxPrice || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : null;
                      handleChange("maxPrice", value);
                    }}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="year" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Year Range</AccordionTrigger>
            <AccordionContent className="pt-1 pb-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="minYear" className="mb-1 block text-sm">Min Year</Label>
                  <Input
                    id="minYear"
                    type="number"
                    placeholder="Min"
                    className="h-8"
                    value={localFilters.minYear || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : null;
                      handleChange("minYear", value);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="maxYear" className="mb-1 block text-sm">Max Year</Label>
                  <Input
                    id="maxYear"
                    type="number"
                    placeholder="Max"
                    className="h-8"
                    value={localFilters.maxYear || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : null;
                      handleChange("maxYear", value);
                    }}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="mileage" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Mileage Range</AccordionTrigger>
            <AccordionContent className="pt-1 pb-2">
              <div className="space-y-4 pt-2 px-1">
                <Slider
                  defaultValue={[minAvailableMileage, maxAvailableMileage]}
                  min={minAvailableMileage}
                  max={maxAvailableMileage}
                  step={1000}
                  value={[
                    localFilters.minMileage || minAvailableMileage,
                    localFilters.maxMileage || maxAvailableMileage
                  ]}
                  onValueChange={(values) => {
                    handleChange("minMileage", values[0]);
                    handleChange("maxMileage", values[1]);
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>{formatMileage(localFilters.minMileage || minAvailableMileage)}</div>
                  <div>{formatMileage(localFilters.maxMileage || maxAvailableMileage)}</div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="transmission" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Transmission</AccordionTrigger>
            <AccordionContent className="pt-1 pb-2">
              <div>
                <Label htmlFor="transmission" className="mb-1 block text-sm">Transmission Type</Label>
                <Select 
                  value={localFilters.transmission || "Any"} 
                  onValueChange={(value) => handleChange("transmission", value === "Any" ? null : value)}
                >
                  <SelectTrigger id="transmission" className="h-8">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissions.map((transmission) => (
                      <SelectItem key={transmission} value={transmission}>
                        {transmission}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="fuelType" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Fuel Type</AccordionTrigger>
            <AccordionContent className="pt-1 pb-2">
              <div>
                <Label htmlFor="fuelType" className="mb-1 block text-sm">Fuel Type</Label>
                <Select 
                  value={localFilters.fuelType || "Any"} 
                  onValueChange={(value) => handleChange("fuelType", value === "Any" ? null : value)}
                >
                  <SelectTrigger id="fuelType" className="h-8">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((fuel) => (
                      <SelectItem key={fuel} value={fuel}>
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="flex flex-col space-y-2 mt-2">
        <Button 
          className="w-full h-8 text-sm" 
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-8 text-sm" 
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
  
  return isMobile ? (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="mb-4 flex items-center gap-2 h-8 text-sm">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
        {renderFilterControls()}
      </SheetContent>
    </Sheet>
  ) : (
    <aside className="w-full md:w-64 lg:w-72 sticky top-24 h-fit border rounded-lg p-3 bg-white overflow-y-auto max-h-[calc(100vh-180px)]">
      {renderFilterControls()}
    </aside>
  );
};

export default FilterSidebar;
