import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import CarCard from "@/components/CarCard";
import { cars } from "@/data/cars";
import { 
  FilterOptions, 
  filterCars, 
  initialFilterOptions, 
  sortOptions, 
  SortOption 
} from "@/utils/filter-utils";
import { 
  Select, 
  SelectContent,
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterOptions>(initialFilterOptions);
  const [activeSort, setActiveSort] = useState<string>("latest");
  
  // Parse search query from URL when component mounts or URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search");
    
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
  const filteredCars = filterCars(cars, filters);
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
            cars={cars}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="text-muted-foreground">
                {sortedCars.length} {sortedCars.length === 1 ? 'car' : 'cars'} found
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
            
            {sortedCars.length > 0 ? (
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
