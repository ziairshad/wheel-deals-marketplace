
import { Car } from "../data/cars";
import { CarListingRow } from "@/integrations/supabase/client";

// Create a unified type that can represent either a Car or CarListingRow
export type UnifiedCar = Car | CarListingRow;

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

// Helper function to handle differences between Car and CarListingRow
const getCarProperty = (car: UnifiedCar, property: string): any => {
  if ('user_id' in car) {
    // This is a CarListingRow
    switch (property) {
      case 'fuelType': return car.fuel_type;
      case 'bodyType': return car.body_type;
      case 'exteriorColor': return car.exterior_color;
      case 'features': return [];
      default:
        // For properties that have the same name in both types
        return (car as any)[property] ?? null;
    }
  } else {
    // This is a Car from sample data
    return (car as any)[property];
  }
};

export const filterCars = (cars: UnifiedCar[], filters: FilterOptions): UnifiedCar[] => {
  return cars.filter(car => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const description = 'description' in car ? car.description : 
                         ('user_id' in car ? car.description : '');
                         
      const searchableText = `${getCarProperty(car, 'make')} ${getCarProperty(car, 'model')} ${description || ''}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    // Filter by make
    if (filters.make && getCarProperty(car, 'make') !== filters.make) {
      return false;
    }
    
    // Filter by model
    if (filters.model && getCarProperty(car, 'model') !== filters.model) {
      return false;
    }
    
    // Filter by location
    if (filters.location && getCarProperty(car, 'location') !== filters.location) {
      return false;
    }
    
    // Filter by price range
    if (filters.minPrice && getCarProperty(car, 'price') < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && getCarProperty(car, 'price') > filters.maxPrice) {
      return false;
    }
    
    // Filter by year range
    if (filters.minYear && getCarProperty(car, 'year') < filters.minYear) {
      return false;
    }
    if (filters.maxYear && getCarProperty(car, 'year') > filters.maxYear) {
      return false;
    }
    
    // Filter by body types (multiple selection)
    if (filters.bodyTypes.length > 0) {
      const bodyType = 'user_id' in car ? car.body_type : car.bodyType;
      if (!filters.bodyTypes.includes(bodyType || '')) {
        return false;
      }
    }
    
    // Filter by transmission
    if (filters.transmission) {
      const transmission = 'user_id' in car ? car.transmission : car.transmission;
      if (transmission !== filters.transmission) {
        return false;
      }
    }
    
    // Filter by fuel type
    if (filters.fuelType) {
      const fuelType = 'user_id' in car ? car.fuel_type : car.fuelType;
      if (fuelType !== filters.fuelType) {
        return false;
      }
    }
    
    // Filter by mileage range
    if (filters.minMileage && getCarProperty(car, 'mileage') < filters.minMileage) {
      return false;
    }
    if (filters.maxMileage && getCarProperty(car, 'mileage') > filters.maxMileage) {
      return false;
    }
    
    return true;
  });
};

export const getUniqueValues = <T extends string>(cars: UnifiedCar[], property: string): string[] => {
  const values = cars.map(car => getCarProperty(car, property)).filter(value => 
    typeof value === 'string' || typeof value === 'number'
  ) as string[];
  
  return [...new Set(values)].sort();
};

export const getUniqueModelsByMake = (cars: UnifiedCar[], make: string | null): string[] => {
  if (!make) return [];
  
  const models = cars
    .filter(car => getCarProperty(car, 'make') === make)
    .map(car => getCarProperty(car, 'model'));
  
  return [...new Set(models)].sort();
};

// Sorting options
export type SortOption = {
  id: string;
  label: string;
  sortFn: (a: UnifiedCar, b: UnifiedCar) => number;
};

export const sortOptions: SortOption[] = [
  {
    id: "latest",
    label: "Latest",
    sortFn: (a, b) => {
      const dateA = 'user_id' in a ? new Date(a.created_at) : new Date(a.listedDate);
      const dateB = 'user_id' in b ? new Date(b.created_at) : new Date(b.listedDate);
      return dateB.getTime() - dateA.getTime();
    }
  },
  {
    id: "price-low-high",
    label: "Price: Low to High",
    sortFn: (a, b) => getCarProperty(a, 'price') - getCarProperty(b, 'price')
  },
  {
    id: "price-high-low",
    label: "Price: High to Low",
    sortFn: (a, b) => getCarProperty(b, 'price') - getCarProperty(a, 'price')
  },
  {
    id: "year-new-old",
    label: "Year: Newest First",
    sortFn: (a, b) => getCarProperty(b, 'year') - getCarProperty(a, 'year')
  },
  {
    id: "year-old-new",
    label: "Year: Oldest First",
    sortFn: (a, b) => getCarProperty(a, 'year') - getCarProperty(b, 'year')
  },
  {
    id: "mileage-low-high",
    label: "Mileage: Low to High",
    sortFn: (a, b) => getCarProperty(a, 'mileage') - getCarProperty(b, 'mileage')
  }
];
