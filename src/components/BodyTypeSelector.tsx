
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BodyTypeSelectorProps {
  bodyTypes: string[];
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

export const BodyTypeSelector = ({ 
  bodyTypes, 
  selectedTypes, 
  onChange 
}: BodyTypeSelectorProps) => {
  const handleChange = (value: string) => {
    if (value === "Any") {
      onChange([]);
      return;
    }
    
    // If already selected, remove it; otherwise, add it
    if (selectedTypes.includes(value)) {
      onChange(selectedTypes.filter(t => t !== value));
    } else {
      onChange([...selectedTypes, value]);
    }
  };

  // Get the display value for the trigger
  const getDisplayValue = () => {
    if (selectedTypes.length === 0) return "Any";
    if (selectedTypes.length === 1) return selectedTypes[0];
    return `${selectedTypes.length} selected`;
  };

  return (
    <div className="mb-6">
      <Label htmlFor="bodyType" className="text-sm font-medium mb-2 block">Body Type</Label>
      <Select 
        value={getDisplayValue()} 
        onValueChange={handleChange}
      >
        <SelectTrigger id="bodyType" className="w-full">
          <SelectValue placeholder="Any" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Any">Any</SelectItem>
          {bodyTypes.map(type => (
            <SelectItem 
              key={type} 
              value={type}
              className={cn(
                selectedTypes.includes(type) && "bg-primary/10 text-primary font-medium"
              )}
            >
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Display selected types as tags */}
      {selectedTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTypes.map(type => (
            <div 
              key={type}
              className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center"
            >
              <span>{type}</span>
              <button 
                onClick={() => handleChange(type)}
                className="ml-1.5 text-primary hover:text-primary/80"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BodyTypeSelector;
