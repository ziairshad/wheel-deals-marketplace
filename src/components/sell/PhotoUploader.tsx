
import React, { useState } from "react";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDescription, FormLabel } from "@/components/ui/form";

interface PhotoUploaderProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ images, setImages }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      // Limit to 10 images
      const totalImages = [...images, ...newFiles].slice(0, 10);
      setImages(totalImages);
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
        
        {images.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">{images.length} photo{images.length > 1 ? 's' : ''} selected</p>
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden border">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUploader;
