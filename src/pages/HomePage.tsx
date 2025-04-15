import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Car, SortDesc } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import FilterSidebar from "@/components/FilterSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { CarListingRow, supabase } from "@/integrations/supabase/client";
import { UnifiedCar, filterCars, initialFilterOptions, sortOptions, FilterOptions } from "@/utils/filter-utils";
import { placeholderCars } from "@/utils/placeholder-cars";
import { sortOptionsToDatabase } from "@/utils/sort-utils";

const ITEMS_PER_PAGE = 12;

const HomePage = () => {
  const [filteredCars, setFilteredCars] = useState<UnifiedCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(initialFilterOptions);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();
  
  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Update filters when search parameter changes
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    setFilters(prevFilters => ({
      ...prevFilters,
      search: searchQuery || null
    }));
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Calculate pagination range
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        
        // First get total count
        const { count: totalItems, error: countError } = await supabase
          .from('car_listings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'available')
          .match(filters);
          
        if (countError) {
          throw new Error(`Failed to get total count: ${countError.message}`);
        }
        
        // Convert sort option to database format
        const dbSort = sortOptionsToDatabase(selectedSort);
        
        // Then fetch paginated data
        const { data: carListings, error: fetchError } = await supabase
          .from('car_listings')
          .select('*')
          .eq('status', 'available')
          .match(filters)
          .order(dbSort.column, { ascending: dbSort.ascending })
          .range(from, to);
        
        if (fetchError) {
          throw new Error(`Failed to fetch car listings: ${fetchError.message}`);
        }
        
        if (!carListings) {
          setFilteredCars([]);
          setTotalCount(0);
          return;
        }
        
        setTotalCount(totalItems || 0);
        setFilteredCars(carListings as CarListingRow[]);
        
      } catch (error) {
        console.error("Error in fetchData:", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred");
        setFilteredCars([]);
        setTotalCount(0);
        
        toast({
          title: "Error loading data",
          description: error instanceof Error ? error.message : "Could not retrieve car listings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filters, selectedSort, currentPage, toast]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (sortId: string) => {
    const newSortOption = sortOptions.find(option => option.id === sortId);
    if (newSortOption) {
      setSelectedSort(newSortOption);
      setCurrentPage(1); // Reset to first page when sort changes
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 py-8 relative">
        {/* Filter Sidebar (visible on larger screens) */}
        <aside className="hidden lg:block h-fit sticky top-24">
          <FilterSidebar 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>
        
        {/* Mobile Filter Button (visible on smaller screens) */}
        {isMobile && (
          <Button 
            onClick={toggleFilters}
            className="lg:hidden mb-4"
          >
            {isFilterOpen ? "Close Filters" : "Open Filters"}
          </Button>
        )}
        
        {/* Mobile Filter Overlay */}
        {isMobile && isFilterOpen && (
          <div className="fixed inset-0 bg-black/50 z-50">
            <aside className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg p-4 overflow-auto">
              <FilterSidebar 
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              <Button onClick={toggleFilters} className="mt-4 w-full">Close Filters</Button>
            </aside>
          </div>
        )}
        
        {/* Car Listings */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-video rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">Error loading cars</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <p className="text-muted-foreground mb-4 md:mb-0">
                  Showing <span className="font-medium text-foreground">
                    {filteredCars.length}
                  </span> of <span className="font-medium text-foreground">
                    {totalCount}
                  </span> cars
                </p>
                
                <div className="flex items-center gap-2">
                  <SortDesc className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm mr-2">Sort by:</span>
                  <Select 
                    value={selectedSort.id} 
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={selectedSort.label} />
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
              
              {filteredCars.length === 0 ? (
                <div className="text-center py-12">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">No cars found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to see more results.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCars.map((car) => (
                      <CarCard key={car.id} car={car} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <div className="flex items-center gap-2">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
