
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CarGalleryProps {
  images: string[];
  title?: string; // Make title optional
}

const CarGallery = ({ images, title = "Car" }: CarGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  return (
    <div className="rounded-lg overflow-hidden bg-gray-100 border">
      {/* Main image */}
      <div className="relative aspect-video md:aspect-[16/9] overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        
        {/* Navigation buttons - only show if there are multiple images */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        )}
      </div>
      
      {/* Thumbnails - only show if there are multiple images */}
      {images.length > 1 && (
        <div className="flex overflow-x-auto p-2 gap-2 bg-white">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "flex-shrink-0 rounded overflow-hidden w-16 h-16 md:w-20 md:h-20 border-2 transition",
                currentImageIndex === index
                  ? "border-car-blue"
                  : "border-transparent hover:border-gray-300"
              )}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarGallery;
