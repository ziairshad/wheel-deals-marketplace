
import { Car } from "../data/cars";

export type FilterOptions = {
  make: string | null;
  model: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minYear: number | null;
  maxYear: number | null;
  bodyTypes: string[];
  transmission: string | null;
  fuelType: string | null;
  location: string | null;
  minMileage: number | null;
  maxMileage: number | null;
  search: string | null;
};

export const initialFilterOptions: FilterOptions = {
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
  search: null
};

export const filterCars = (cars: Car[], filters: FilterOptions): Car[] => {
  return cars.filter(car => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = `${car.make} ${car.model} ${car.description}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    // Filter by make
    if (filters.make && car.make !== filters.make) {
      return false;
    }
    
    // Filter by model
    if (filters.model && car.model !== filters.model) {
      return false;
    }
    
    // Filter by location
    if (filters.location && car.location !== filters.location) {
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
    
    // Filter by body types (multiple selection)
    if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(car.bodyType)) {
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
    
    // Filter by mileage range
    if (filters.minMileage && car.mileage < filters.minMileage) {
      return false;
    }
    if (filters.maxMileage && car.mileage > filters.maxMileage) {
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

export const getUniqueModelsByMake = (cars: Car[], make: string | null): string[] => {
  if (!make) return [];
  
  const models = cars
    .filter(car => car.make === make)
    .map(car => car.model);
  
  return [...new Set(models)].sort();
};

// Sorting options
export type SortOption = {
  id: string;
  label: string;
  sortFn: (a: Car, b: Car) => number;
};

export const sortOptions: SortOption[] = [
  {
    id: "latest",
    label: "Latest",
    sortFn: (a, b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime()
  },
  {
    id: "price-low-high",
    label: "Price: Low to High",
    sortFn: (a, b) => a.price - b.price
  },
  {
    id: "price-high-low",
    label: "Price: High to Low",
    sortFn: (a, b) => b.price - a.price
  },
  {
    id: "year-new-old",
    label: "Year: Newest First",
    sortFn: (a, b) => b.year - a.year
  },
  {
    id: "year-old-new",
    label: "Year: Oldest First",
    sortFn: (a, b) => a.year - b.year
  },
  {
    id: "mileage-low-high",
    label: "Mileage: Low to High",
    sortFn: (a, b) => a.mileage - b.mileage
  }
];
