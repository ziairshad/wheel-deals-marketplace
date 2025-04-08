
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

import { Car, emirates } from "@/data/cars";
import { FilterOptions, getUniqueValues, getUniqueModelsByMake } from "@/utils/filter-utils";

interface FilterSidebarProps {
  cars: Car[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterSidebar = ({ cars, filters, onFilterChange }: FilterSidebarProps) => {
  const isMobile = useIsMobile();
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  
  // Get unique values for dropdowns
  const makes = ["Any", ...getUniqueValues(cars, "make")];
  const models = localFilters.make ? ["Any", ...getUniqueModelsByMake(cars, localFilters.make)] : [];
  const bodyTypes = getUniqueValues(cars, "bodyType");
  const transmissions = ["Any", ...getUniqueValues(cars, "transmission")];
  const fuelTypes = ["Any", ...getUniqueValues(cars, "fuelType")];
  const locations = ["Any", ...emirates];
  
  // Get min/max mileage for the range slider
  const mileages = cars.map(car => car.mileage);
  const minAvailableMileage = Math.min(...mileages);
  const maxAvailableMileage = Math.max(...mileages);
  
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
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Filter Vehicles</h2>
        
        {/* Body Type Selector (outside accordion) */}
        <div className="mb-4">
          <Label htmlFor="bodyType">Body Type</Label>
          <Select 
            value={localFilters.bodyTypes.length === 1 ? localFilters.bodyTypes[0] : ""}
            onValueChange={(value) => {
              handleBodyTypeChange(value ? [value] : []);
            }}
          >
            <SelectTrigger id="bodyType">
              <SelectValue placeholder="Any Body Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              {bodyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Accordion type="multiple" defaultValue={["make", "price", "year", "location", "mileage"]}>
          <AccordionItem value="make">
            <AccordionTrigger>Make & Model</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <Label htmlFor="make">Select Make</Label>
                  <Select 
                    value={localFilters.make || "Any"} 
                    onValueChange={(value) => handleChange("make", value === "Any" ? null : value)}
                  >
                    <SelectTrigger id="make">
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
                    <Label htmlFor="model">Select Model</Label>
                    <Select 
                      value={localFilters.model || "Any"} 
                      onValueChange={(value) => handleChange("model", value === "Any" ? null : value)}
                    >
                      <SelectTrigger id="model">
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
          
          <AccordionItem value="location">
            <AccordionTrigger>Location</AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                <Label htmlFor="location">Emirate</Label>
                <Select 
                  value={localFilters.location || "Any"} 
                  onValueChange={(value) => handleChange("location", value === "Any" ? null : value)}
                >
                  <SelectTrigger id="location">
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

          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <Label htmlFor="minPrice">Min Price (AED)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="Min"
                    value={localFilters.minPrice || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : null;
                      handleChange("minPrice", value);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice">Max Price (AED)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Max"
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
          
          <AccordionItem value="year">
            <AccordionTrigger>Year Range</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <Label htmlFor="minYear">Min Year</Label>
                  <Input
                    id="minYear"
                    type="number"
                    placeholder="Min"
                    value={localFilters.minYear || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : null;
                      handleChange("minYear", value);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="maxYear">Max Year</Label>
                  <Input
                    id="maxYear"
                    type="number"
                    placeholder="Max"
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
          
          <AccordionItem value="mileage">
            <AccordionTrigger>Mileage Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-4 px-1">
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
          
          <AccordionItem value="transmission">
            <AccordionTrigger>Transmission</AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                <Label htmlFor="transmission">Transmission Type</Label>
                <Select 
                  value={localFilters.transmission || "Any"} 
                  onValueChange={(value) => handleChange("transmission", value === "Any" ? null : value)}
                >
                  <SelectTrigger id="transmission">
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
          
          <AccordionItem value="fuelType">
            <AccordionTrigger>Fuel Type</AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select 
                  value={localFilters.fuelType || "Any"} 
                  onValueChange={(value) => handleChange("fuelType", value === "Any" ? null : value)}
                >
                  <SelectTrigger id="fuelType">
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
      
      <div className="flex flex-col space-y-2">
        <Button 
          className="w-full" 
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
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
        <Button variant="outline" className="mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
        {renderFilterControls()}
      </SheetContent>
    </Sheet>
  ) : (
    <aside className="w-full md:w-64 lg:w-72 sticky top-24 h-fit border rounded-lg p-4 bg-white overflow-y-auto max-h-[calc(100vh-180px)]">
      {renderFilterControls()}
    </aside>
  );
};

export default FilterSidebar;
