
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Car, Home, Search, LogOut, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { user, profile, signOut } = useAuth();
  const isMobile = useIsMobile();
  
  // Update local search state when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchParam = searchParams.get("search");
    setSearchQuery(searchParam || "");
  }, [location.search]);
  
  // Get user display name (prioritize profile, fallback to email)
  const getUserDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    return user?.email || "";
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.[0].toUpperCase() || "U";
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only proceed with search if we're not already on the home page
    // or if we are on the home page but with different search params
    const searchParams = new URLSearchParams(location.search);
    const currentSearch = searchParams.get("search");
    
    if (searchQuery.trim() === currentSearch && location.pathname === "/") {
      return; // No need to navigate if search is the same and we're on homepage
    }
    
    // Create a new URLSearchParams object for the search
    const newSearchParams = new URLSearchParams();
    
    if (searchQuery.trim()) {
      newSearchParams.set("search", searchQuery.trim());
    }
    
    // Construct the target URL
    const searchString = newSearchParams.toString();
    const targetUrl = searchString ? `/?${searchString}` : '/';
    
    // Navigate to home with search parameter
    navigate(targetUrl);
  };
  
  // Handle input change and trigger search if field is cleared
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    
    // If the field is cleared, immediately update the URL
    if (newValue === "" && searchQuery !== "" && location.pathname === "/") {
      navigate("/", { replace: true });
    }
  };
  
  // Handle sell button click
  const handleSellClick = () => {
    if (!user) {
      navigate("/auth", { state: { from: "/sell", action: "sell" } });
    } else {
      navigate("/sell");
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">Wheel Deals</span>
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
          {!isMobile && (
            <Link to="/" className="flex items-center gap-1.5 text-sm font-medium">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          )}
          
          <Button onClick={handleSellClick}>
            {isMobile ? "Sell" : "Sell Your Car"}
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={getUserDisplayName()} />}
                    <AvatarFallback className="bg-gray-200 text-gray-700">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-muted-foreground">
                  {getUserDisplayName()}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/my-listings")}>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>My Listings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Header;
