
import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import { Car } from "@/data/cars";
import { FilterOptions, getUniqueValues } from "@/utils/filter-utils";

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
  const bodyTypes = ["Any", ...getUniqueValues(cars, "bodyType")];
  const transmissions = ["Any", ...getUniqueValues(cars, "transmission")];
  const fuelTypes = ["Any", ...getUniqueValues(cars, "fuelType")];
  
  // Update when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleChange = (key: keyof FilterOptions, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };
  
  const handleClearFilters = () => {
    const clearedFilters = {
      make: null,
      minPrice: null,
      maxPrice: null,
      minYear: null,
      maxYear: null,
      bodyType: null,
      transmission: null,
      fuelType: null
    };
    
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };
  
  const renderFilterControls = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Filter Vehicles</h2>
        
        <Accordion type="multiple" defaultValue={["make", "price", "year"]}>
          <AccordionItem value="make">
            <AccordionTrigger>Make</AccordionTrigger>
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
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <Label htmlFor="minPrice">Min Price ($)</Label>
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
                  <Label htmlFor="maxPrice">Max Price ($)</Label>
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
          
          <AccordionItem value="bodyType">
            <AccordionTrigger>Body Type</AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                <Label htmlFor="bodyType">Body Type</Label>
                <Select 
                  value={localFilters.bodyType || "Any"} 
                  onValueChange={(value) => handleChange("bodyType", value === "Any" ? null : value)}
                >
                  <SelectTrigger id="bodyType">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        {renderFilterControls()}
      </SheetContent>
    </Sheet>
  ) : (
    <aside className="w-full md:w-64 lg:w-72 sticky top-24 h-fit border rounded-lg p-4 bg-white">
      {renderFilterControls()}
    </aside>
  );
};

export default FilterSidebar;
