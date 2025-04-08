
import { Car } from "../data/cars";

export type FilterOptions = {
  make: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minYear: number | null;
  maxYear: number | null;
  bodyType: string | null;
  transmission: string | null;
  fuelType: string | null;
};

export const initialFilterOptions: FilterOptions = {
  make: null,
  minPrice: null,
  maxPrice: null,
  minYear: null,
  maxYear: null,
  bodyType: null,
  transmission: null,
  fuelType: null
};

export const filterCars = (cars: Car[], filters: FilterOptions): Car[] => {
  return cars.filter(car => {
    // Filter by make
    if (filters.make && car.make !== filters.make) {
      return false;
    }
    
    // Filter by price range
    if (filters.minPrice && car.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && car.price > filters.maxPrice) {
      return false;
    }
    
    // Filter by year range
    if (filters.minYear && car.year < filters.minYear) {
      return false;
    }
    if (filters.maxYear && car.year > filters.maxYear) {
      return false;
    }
    
    // Filter by body type
    if (filters.bodyType && car.bodyType !== filters.bodyType) {
      return false;
    }
    
    // Filter by transmission
    if (filters.transmission && car.transmission !== filters.transmission) {
      return false;
    }
    
    // Filter by fuel type
    if (filters.fuelType && car.fuelType !== filters.fuelType) {
      return false;
    }
    
    return true;
  });
};

export const getUniqueValues = <T extends keyof Car>(cars: Car[], property: T): string[] => {
  const values = cars.map(car => car[property]).filter(value => 
    typeof value === 'string' || typeof value === 'number'
  ) as string[];
  
  return [...new Set(values)].sort();
};
