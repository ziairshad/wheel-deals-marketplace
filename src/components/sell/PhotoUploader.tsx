
import React, { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";

interface PhotoUploaderProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  existingImages?: string[];
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ 
  images, 
  setImages,
  existingImages = []
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Create preview URLs
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
      
      setImages(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    
    // Also remove the preview
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
      setPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="mt-6">
      <div className="mb-2">
        <FormLabel>Photos *</FormLabel>
        <p className="text-sm text-muted-foreground mt-1">
          Upload clear photos of your vehicle. Include exterior, interior, and any damage.
        </p>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {/* Show existing images from database */}
        {existingImages.map((url, index) => (
          <div 
            key={`existing-${index}`} 
            className="relative aspect-square border rounded-md overflow-hidden bg-gray-50"
          >
            <img 
              src={url} 
              alt={`Existing car image ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 right-0 p-1">
              <span className="inline-flex items-center justify-center bg-black/50 text-white text-xs px-2 py-1 rounded">
                Existing
              </span>
            </div>
          </div>
        ))}

        {/* Show new images being uploaded */}
        {images.map((_, index) => (
          <div 
            key={`new-${index}`} 
            className="relative aspect-square border rounded-md overflow-hidden bg-gray-50"
          >
            {previews[index] && (
              <img 
                src={previews[index]} 
                alt={`Car preview ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            )}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        
        {/* Upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square flex flex-col items-center justify-center border border-dashed rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <Camera className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-sm text-muted-foreground">Add photos</span>
        </button>
      </div>
    </div>
  );
};

export default PhotoUploader;
