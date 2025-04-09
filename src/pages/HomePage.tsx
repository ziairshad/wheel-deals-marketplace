
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import CarCard from "@/components/CarCard";
import { cars as sampleCars } from "@/data/cars";
import { 
  FilterOptions, 
  filterCars, 
  initialFilterOptions, 
  sortOptions 
} from "@/utils/filter-utils";
import { 
  Select, 
  SelectContent,
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase, CarListingRow } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterOptions>(initialFilterOptions);
  const [activeSort, setActiveSort] = useState<string>("latest");
  const [allCars, setAllCars] = useState<(typeof sampleCars[0] | CarListingRow)[]>([...sampleCars]);
  const [loading, setLoading] = useState(true);
  
  // Fetch cars from Supabase
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("car_listings")
          .select("*")
          .eq("status", "available");
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform Supabase data to match the format of sample cars
          const transformedCars = data.map(car => ({
            ...car,
            id: car.id,
            price: car.price,
            mileage: car.mileage,
            year: car.year,
            make: car.make,
            model: car.model,
            bodyType: car.body_type || undefined,
            transmission: car.transmission || undefined,
            fuelType: car.fuel_type || undefined,
            color: car.exterior_color || undefined,
            location: car.location,
            description: car.description || undefined,
            images: car.images || [],
            features: [],
            seller: {
              name: car.contact_name || "Seller",
              phone: car.contact_phone || "Not provided",
              email: car.contact_email || "Not provided"
            }
          }));
          
          // Combine sample cars with real cars from database
          setAllCars([...sampleCars, ...transformedCars]);
        }
      } catch (error) {
        console.error("Error fetching car listings:", error);
        toast({
          title: "Error",
          description: "Failed to load car listings. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
  }, [toast]);
  
  // Parse search query from URL when component mounts or URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search");
    
    console.log("URL search changed:", searchQuery);
    
    // Update filters with search query from URL or clear it
    setFilters(prev => ({ ...prev, search: searchQuery || null }));
  }, [location.search]);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    const updatedFilters = { ...newFilters };
    
    // If search was updated in filters, update URL
    if (filters.search !== newFilters.search) {
      const searchParams = new URLSearchParams(location.search);
      
      if (newFilters.search) {
        searchParams.set("search", newFilters.search);
      } else {
        searchParams.delete("search");
      }
      
      navigate({ search: searchParams.toString() }, { replace: true });
    }
    
    setFilters(updatedFilters);
  };
  
  const handleSortChange = (value: string) => {
    setActiveSort(value);
  };
  
  // Apply filters and sorting
  const filteredCars = filterCars(allCars, filters);
  const sortedCars = [...filteredCars].sort(
    sortOptions.find(option => option.id === activeSort)?.sortFn || 
    sortOptions[0].sortFn
  );
  
  const activeSortOption = sortOptions.find(option => option.id === activeSort);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container py-6 flex-1">
        {/* Search results heading */}
        {filters.search && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              Search results for "{filters.search}"
            </h1>
            <p className="text-muted-foreground">
              Found {filteredCars.length} cars matching your search
            </p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          <FilterSidebar 
            cars={allCars}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="text-muted-foreground">
                {loading ? 'Loading...' : `${sortedCars.length} ${sortedCars.length === 1 ? 'car' : 'cars'} found`}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Sort by:</span>
                <Select
                  value={activeSort}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue>
                      {activeSortOption?.label || "Latest"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <p>Loading cars...</p>
              </div>
            ) : sortedCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;
