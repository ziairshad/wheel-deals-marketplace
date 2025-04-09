import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  UnifiedCar,
  FilterOptions,
  getUniqueValues,
  getUniqueModelsByMake,
} from "@/utils/filter-utils";
import { supabase } from "@/integrations/supabase/client";
import { RangeFilter } from "./RangeFilter";
import { SelectFilter } from "./SelectFilter";
import { CheckboxFilter } from "./CheckboxFilter";
import { CustomSelectFilter } from "./CustomSelectFilter";

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
}) => {
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [regionalSpecs, setRegionalSpecs] = useState<string[]>([]);
  
  // Range states with dynamic min/max values
  const [mileageRange, setMileageRange] = useState<number[]>([0, 200000]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [yearRange, setYearRange] = useState<number[]>([1990, 2024]);
  
  // Min/max values from database
  const [minMaxValues, setMinMaxValues] = useState({
    mileage: { min: 0, max: 200000 },
    price: { min: 0, max: 100000 },
    year: { min: 1990, max: 2024 }
  });

  // Helper function to get car property safely
  const getCarProperty = (car: UnifiedCar, property: string): any => {
    if ('user_id' in car) {
      // This is a CarListingRow
      switch (property) {
        case 'fuelType': return car.fuel_type;
        case 'bodyType': return car.body_type;
        case 'exteriorColor': return car.exterior_color;
        case 'regionalSpecs': return car.regional_specs;
        case 'mileage': return car.mileage;
        case 'price': return car.price;
        case 'year': return car.year;
        default:
          // For properties that have the same name in both types
          return (car as any)[property] ?? null;
      }
    } else {
      // This is a Car from sample data
      return (car as any)[property];
    }
  };

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // Fetch car listings
        const { data: carListings, error } = await supabase
          .from("car_listings")
          .select("*");

        if (error) {
          console.error("Error fetching car listings:", error);
          return;
        }

        if (!carListings || carListings.length === 0) {
          console.log("No car listings found.");
          return;
        }

        // Use TypeScript casting to ensure type safety
        const allCars: UnifiedCar[] = carListings as any[];

        // Set filter options from data
        setMakes(getUniqueValues(allCars, "make"));
        setBodyTypes(getUniqueValues(allCars, "bodyType"));
        setLocations(getUniqueValues(allCars, "location"));
        setRegionalSpecs(getUniqueValues(allCars, "regionalSpecs"));
        
        // Calculate min and max values
        const mileages = allCars.map(car => getCarProperty(car, 'mileage')).filter(Boolean) as number[];
        const prices = allCars.map(car => getCarProperty(car, 'price')).filter(Boolean) as number[];
        const years = allCars.map(car => getCarProperty(car, 'year')).filter(Boolean) as number[];
        
        const mileageMin = mileages.length > 0 ? Math.min(...mileages) : 0;
        const mileageMax = mileages.length > 0 ? Math.max(...mileages) : 200000;
        
        const priceMin = prices.length > 0 ? Math.min(...prices) : 0;
        const priceMax = prices.length > 0 ? Math.max(...prices) : 100000;
        
        const yearMin = years.length > 0 ? Math.min(...years) : 1990;
        const yearMax = years.length > 0 ? Math.max(...years) : 2024;
        
        // Set min/max values
        setMinMaxValues({
          mileage: { min: mileageMin, max: mileageMax },
          price: { min: priceMin, max: priceMax },
          year: { min: yearMin, max: yearMax }
        });
        
        // Update range state values
        setMileageRange([mileageMin, mileageMax]);
        setPriceRange([priceMin, priceMax]);
        setYearRange([yearMin, yearMax]);
        
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
    
    // Reset the sliders to their dynamic min/max values
    setMileageRange([minMaxValues.mileage.min, minMaxValues.mileage.max]);
    setPriceRange([minMaxValues.price.min, minMaxValues.price.max]);
    setYearRange([minMaxValues.year.min, minMaxValues.year.max]);
  };

  const formatMileage = (value: number) => {
    return `${value.toLocaleString()} KM`;
  };
  
  const formatPrice = (value: number) => {
    return `${value.toLocaleString()} AED`;
  };

  const transmissionOptions = [
    { value: "automatic", label: "Automatic" },
    { value: "manual", label: "Manual" },
  ];

  const fuelTypeOptions = [
    { value: "gasoline", label: "Gasoline" },
    { value: "diesel", label: "Diesel" },
    { value: "electric", label: "Electric" },
    { value: "hybrid", label: "Hybrid" },
  ];

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 max-h-[calc(100vh-150px)] flex flex-col overflow-hidden">
      <div className="sticky top-0 bg-white pt-1 pb-3 z-10">
        <h2 className="text-xl font-semibold mb-2">Filter Vehicles</h2>
        <Separator />
      </div>
      <div className="overflow-y-auto flex-1 space-y-4 pr-2">
        <Accordion type="multiple" defaultValue={["make", "price", "year"]}>
          <AccordionItem value="make">
            <AccordionTrigger>Make & Model</AccordionTrigger>
            <AccordionContent>
              <SelectFilter
                title="Make"
                placeholder="Select make"
                value={filters.make}
                options={makes}
                onValueChange={handleMakeChange}
              />

              <SelectFilter
                title="Model"
                placeholder="Select model"
                value={filters.model}
                options={models}
                onValueChange={handleModelChange}
                disabled={!filters.make}
              />
            </AccordionContent>
          </AccordionItem>

          <RangeFilter
            title="Price Range"
            min={minMaxValues.price.min}
            max={minMaxValues.price.max}
            step={1000}
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            formatValue={formatPrice}
            accordionValue="price"
          />

          <RangeFilter
            title="Year Range"
            min={minMaxValues.year.min}
            max={minMaxValues.year.max}
            step={1}
            value={yearRange}
            onValueChange={handleYearRangeChange}
            accordionValue="year"
          />

          <CheckboxFilter
            title="Body Type"
            options={bodyTypes}
            selectedOptions={filters.bodyTypes}
            onOptionChange={handleBodyTypeChange}
            accordionValue="bodyType"
          />

          <CustomSelectFilter
            title="Transmission"
            placeholder="Select transmission"
            value={filters.transmission}
            options={transmissionOptions}
            onValueChange={handleTransmissionChange}
            accordionValue="transmission"
          />

          <CustomSelectFilter
            title="Fuel Type"
            placeholder="Select fuel type"
            value={filters.fuelType}
            options={fuelTypeOptions}
            onValueChange={handleFuelTypeChange}
            accordionValue="fuelType"
          />

          <SelectFilter
            title="Location"
            placeholder="Select location"
            value={filters.location}
            options={locations}
            onValueChange={handleLocationChange}
            accordionValue="location"
          />

          <SelectFilter
            title="Regional Specs"
            placeholder="Select regional specs"
            value={filters.regionalSpecs}
            options={regionalSpecs}
            onValueChange={handleRegionalSpecsChange}
            accordionValue="regionalSpecs"
          />

          <RangeFilter
            title="Mileage Range"
            min={minMaxValues.mileage.min}
            max={minMaxValues.mileage.max}
            step={1000}
            value={mileageRange}
            onValueChange={handleMileageRangeChange}
            formatValue={formatMileage}
            accordionValue="mileage"
          />
        </Accordion>

        <Separator />
        <Button variant="outline" className="w-full mb-4" onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
