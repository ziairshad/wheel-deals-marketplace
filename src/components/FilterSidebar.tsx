
import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UnifiedCar,
  FilterOptions,
  getUniqueValues,
  getUniqueModelsByMake,
} from "@/utils/filter-utils";
import { supabase } from "@/integrations/supabase/client";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
}) => {
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [regionalSpecs, setRegionalSpecs] = useState<string[]>([]);
  const [mileageRange, setMileageRange] = useState<number[]>([0, 200000]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [yearRange, setYearRange] = useState<number[]>([1990, 2024]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const { data: carListings, error } = await supabase
          .from("car_listings")
          .select("*");

        if (error) {
          console.error("Error fetching car listings:", error);
          return;
        }

        if (!carListings) {
          console.log("No car listings found.");
          return;
        }

        // Use TypeScript casting to ensure type safety
        const allCars: UnifiedCar[] = carListings as any[];

        setMakes(getUniqueValues(allCars, "make"));
        setBodyTypes(getUniqueValues(allCars, "bodyType"));
        setLocations(getUniqueValues(allCars, "location"));
        setRegionalSpecs(getUniqueValues(allCars, "regionalSpecs"));
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilterData();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const { data: carListings, error } = await supabase
          .from("car_listings")
          .select("*");

        if (error) {
          console.error("Error fetching car listings:", error);
          return;
        }

        if (!carListings) {
          console.log("No car listings found.");
          return;
        }

        // Use TypeScript casting to ensure type safety
        const allCars: UnifiedCar[] = carListings as any[];

        setModels(getUniqueModelsByMake(allCars, filters.make));
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, [filters.make, filters.model]);

  const handleMakeChange = (make: string) => {
    onFilterChange({ ...filters, make, model: null });
  };

  const handleModelChange = (model: string) => {
    onFilterChange({ ...filters, model });
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    onFilterChange({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  const handleYearRangeChange = (value: number[]) => {
    setYearRange(value);
    onFilterChange({
      ...filters,
      minYear: value[0],
      maxYear: value[1],
    });
  };

  const handleBodyTypeChange = (bodyType: string) => {
    const newBodyTypes = filters.bodyTypes.includes(bodyType)
      ? filters.bodyTypes.filter((type) => type !== bodyType)
      : [...filters.bodyTypes, bodyType];
    onFilterChange({ ...filters, bodyTypes: newBodyTypes });
  };

  const handleTransmissionChange = (transmission: string) => {
    onFilterChange({ ...filters, transmission });
  };

  const handleFuelTypeChange = (fuelType: string) => {
    onFilterChange({ ...filters, fuelType });
  };

  const handleLocationChange = (location: string) => {
    onFilterChange({ ...filters, location });
  };

  const handleRegionalSpecsChange = (regionalSpecs: string) => {
    onFilterChange({ ...filters, regionalSpecs });
  };

  const handleMileageRangeChange = (value: number[]) => {
    setMileageRange(value);
    onFilterChange({
      ...filters,
      minMileage: value[0],
      maxMileage: value[1],
    });
  };

  const handleResetFilters = () => {
    onFilterChange({
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
      search: null,
      regionalSpecs: null,
    });
    setMileageRange([0, 200000]);
    setPriceRange([0, 100000]);
    setYearRange([1990, 2024]);
  };

  const formatMileage = (value: number) => {
    return `${value.toLocaleString()} mi`;
  };
  
  const formatPrice = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="h-full overflow-auto space-y-4 pr-2">
      <Accordion type="multiple" defaultValue={["make", "model", "price", "year"]}>
        <AccordionItem value="make">
          <AccordionTrigger className="py-3">Make</AccordionTrigger>
          <AccordionContent>
            <Select onValueChange={handleMakeChange} value={filters.make || ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select make" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {makes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="model">
          <AccordionTrigger className="py-3">Model</AccordionTrigger>
          <AccordionContent>
            <Select
              onValueChange={handleModelChange}
              value={filters.model || ""}
              disabled={!filters.make}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="py-3">Price Range</AccordionTrigger>
          <AccordionContent>
            <DualRangeSlider
              min={0}
              max={100000}
              step={1000}
              defaultValue={[0, 100000]}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              formatValue={formatPrice}
              aria-label="price-range"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="year">
          <AccordionTrigger className="py-3">Year Range</AccordionTrigger>
          <AccordionContent>
            <DualRangeSlider
              min={1990}
              max={2024}
              step={1}
              defaultValue={[1990, 2024]}
              value={yearRange}
              onValueChange={handleYearRangeChange}
              aria-label="year-range"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bodyType">
          <AccordionTrigger className="py-3">Body Type</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-2">
              {bodyTypes.map((bodyType) => (
                <div key={bodyType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`bodyType-${bodyType}`}
                    checked={filters.bodyTypes.includes(bodyType)}
                    onCheckedChange={() => handleBodyTypeChange(bodyType)}
                  />
                  <Label htmlFor={`bodyType-${bodyType}`} className="text-sm cursor-pointer">
                    {bodyType}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="transmission">
          <AccordionTrigger className="py-3">Transmission</AccordionTrigger>
          <AccordionContent>
            <Select
              onValueChange={handleTransmissionChange}
              value={filters.transmission || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="fuelType">
          <AccordionTrigger className="py-3">Fuel Type</AccordionTrigger>
          <AccordionContent>
            <Select
              onValueChange={handleFuelTypeChange}
              value={filters.fuelType || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasoline">Gasoline</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger className="py-3">Location</AccordionTrigger>
          <AccordionContent>
            <Select
              onValueChange={handleLocationChange}
              value={filters.location || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="regionalSpecs">
          <AccordionTrigger className="py-3">Regional Specs</AccordionTrigger>
          <AccordionContent>
            <Select
              onValueChange={handleRegionalSpecsChange}
              value={filters.regionalSpecs || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select regional specs" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {regionalSpecs.map((regionalSpec) => (
                  <SelectItem key={regionalSpec} value={regionalSpec}>
                    {regionalSpec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mileage">
          <AccordionTrigger className="py-3">Mileage Range</AccordionTrigger>
          <AccordionContent>
            <DualRangeSlider
              min={0}
              max={200000}
              step={1000}
              defaultValue={[0, 200000]}
              value={mileageRange}
              onValueChange={handleMileageRangeChange}
              formatValue={formatMileage}
              aria-label="mileage-range"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />
      <Button variant="outline" className="w-full" onClick={handleResetFilters}>
        Reset Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;
