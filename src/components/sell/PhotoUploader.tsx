
import React, { useState, useEffect } from "react";
import { FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDescription, FormLabel } from "@/components/ui/form";

interface PhotoUploaderProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  existingImages?: string[];
  onExistingImagesChange?: (images: string[]) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ 
  images, 
  setImages,
  existingImages = [],
  onExistingImagesChange
}) => {
  const [localExistingImages, setLocalExistingImages] = useState<string[]>([]);
  
  // Update local state when prop changes
  useEffect(() => {
    setLocalExistingImages(existingImages);
  }, [existingImages]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      // Limit to 10 images total (existing + new)
      const totalImagesCount = localExistingImages.length + images.length + newFiles.length;
      if (totalImagesCount > 10) {
        const availableSlots = 10 - localExistingImages.length - images.length;
        const filesToAdd = newFiles.slice(0, Math.max(0, availableSlots));
        setImages([...images, ...filesToAdd]);
      } else {
        setImages([...images, ...newFiles]);
      }
    }
  };
  
  const removeExistingImage = (index: number) => {
    const updatedExistingImages = localExistingImages.filter((_, i) => i !== index);
    setLocalExistingImages(updatedExistingImages);
    
    // Notify parent component about the change if callback exists
    if (onExistingImagesChange) {
      onExistingImagesChange(updatedExistingImages);
    }
  };

  return (
    <div className="mt-6">
      <FormLabel className="block mb-2">Photos *</FormLabel>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <FileUp className="h-10 w-10 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag and drop images here, or click to browse
        </p>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          Upload Photos
        </Button>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <FormDescription className="mt-2">
          Upload up to 10 photos. First photo will be the main listing image.
        </FormDescription>
        
        {/* Display existing images */}
        {localExistingImages.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Existing Photos</p>
            <div className="flex flex-wrap gap-2">
              {localExistingImages.map((imageUrl, index) => (
                <div key={`existing-${index}`} className="relative w-16 h-16 rounded-md overflow-hidden border">
                  <img
                    src={imageUrl}
                    alt={`Existing preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={() => removeExistingImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Display newly uploaded images */}
        {images.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">New Photos ({images.length})</p>
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={`new-${index}`} className="relative w-16 h-16 rounded-md overflow-hidden border">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`New preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-2 text-sm text-muted-foreground">
          Total: {localExistingImages.length + images.length}/10 photos
        </div>
      </div>
    </div>
  );
};

export default PhotoUploader;
