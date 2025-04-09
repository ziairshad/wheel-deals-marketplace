
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Car, Home, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Update local search state when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchParam = searchParams.get("search");
    setSearchQuery(searchParam || "");
  }, [location.search]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchParams = new URLSearchParams(location.search);
    
    if (searchQuery.trim()) {
      searchParams.set("search", searchQuery.trim());
    } else {
      searchParams.delete("search");
    }
    
    // Force a navigation even if the URL appears the same
    const searchString = searchParams.toString();
    const targetUrl = searchString ? `/?${searchString}` : '/';
    
    // Using replace to avoid building up history stack with search operations
    navigate(targetUrl, { replace: true });
  };
  
  // Handle input change and clear search immediately if empty
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    
    // If the field is cleared, immediately update the URL
    if (newValue === "" && searchQuery !== "") {
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete("search");
      navigate(`/?${searchParams.toString()}`, { replace: true });
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-car-blue" />
          <span className="text-xl font-bold text-car-blue">Wheel Deals</span>
        </Link>
        
        <div className="flex-1 mx-8 max-w-xl">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search makes, models, or keywords..."
              className="w-full bg-background pl-8 pr-4"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </form>
        </div>
        
        <nav className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-medium">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          
          <Link to="/sell">
            <Button className="bg-car-blue hover:bg-blue-700">
              Sell Your Car
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
