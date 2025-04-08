
import { useState } from "react";
import { Grid2X2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import FilterSidebar from "@/components/FilterSidebar";

import { cars } from "@/data/cars";
import { FilterOptions, filterCars, initialFilterOptions } from "@/utils/filter-utils";

const HomePage = () => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilterOptions);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const filteredCars = filterCars(cars, filters);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter sidebar */}
          <FilterSidebar 
            cars={cars} 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
          
          {/* Car listings */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {filteredCars.length} {filteredCars.length === 1 ? 'Car' : 'Cars'} Available
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">View:</span>
                  <ToggleGroup type="single" value={viewMode} onValueChange={(value) => {
                    if (value) setViewMode(value as "grid" | "list");
                  }}>
                    <ToggleGroupItem value="grid" aria-label="Grid view">
                      <Grid2X2 className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="List view">
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <Button variant="outline" size="sm">
                  Sort by: Latest
                </Button>
              </div>
            </div>
            
            {filteredCars.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <h2 className="text-xl font-semibold text-muted-foreground">No cars match your filters</h2>
                <p className="mt-2 text-muted-foreground">Try adjusting your search criteria</p>
                <Button 
                  className="mt-4" 
                  variant="outline" 
                  onClick={() => setFilters(initialFilterOptions)}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className={`grid ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "grid-cols-1 gap-4"
              }`}>
                {filteredCars.map((car) => (
                  <div key={car.id} className="animate-fade-in">
                    <CarCard car={car} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
