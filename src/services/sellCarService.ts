
import { CarFormData } from "@/types/car";
import { CarListingRow, supabase } from "@/integrations/supabase/client";

export async function fetchCarById(carId: string) {
  try {
    console.log("Fetching car with ID:", carId);
    const { data, error } = await supabase
      .from('car_listings')
      .select('*')
      .eq('id', carId)
      .single();
    
    if (error) {
      console.error("Error fetching car:", error);
      throw new Error(`Failed to fetch car details: ${error.message}`);
    }
    
    if (!data) {
      console.error("No car found with ID:", carId);
      throw new Error(`No car found with ID: ${carId}`);
    }
    
    console.log("Successfully fetched car data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching car:", error);
    throw error;
  }
}

export async function submitCarListing(formData: CarFormData, userId: string, images: File[], editId?: string, existingImages: string[] = []) {
  try {
    console.log("Submitting car listing:", { formData, userId, imagesCount: images.length, existingImagesCount: existingImages.length, editId });
    
    // Prepare the car listing data
    const carListingData = {
      user_id: userId,
      make: formData.make,
      model: formData.model,
      year: parseInt(formData.year),
      price: parseInt(formData.price),
      mileage: parseInt(formData.mileage),
      body_type: formData.bodyType,
      transmission: formData.transmission,
      fuel_type: formData.fuelType,
      exterior_color: formData.color,
      location: formData.location,
      description: formData.description,
      contact_name: formData.contactName,
      contact_phone: formData.contactPhone,
      contact_email: formData.contactEmail,
      status: 'available',
      vin: formData.vin,
      regional_specs: formData.regionalSpecs,
    };

    let carId = editId;
    
    if (editId) {
      // If editing, update existing record
      const { error: updateError } = await supabase
        .from('car_listings')
        .update(carListingData)
        .eq('id', editId);
        
      if (updateError) {
        console.error("Error updating car listing:", updateError);
        throw new Error('Failed to update car listing');
      }
    } else {
      // If creating new, insert record
      const { data: carData, error: insertError } = await supabase
        .from('car_listings')
        .insert(carListingData)
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting car listing:", insertError);
        throw new Error('Failed to submit car listing');
      }
      
      carId = carData.id;
    }

    // Track all image URLs (both existing and new)
    let allImageUrls = [...existingImages];
    
    // Only process images if we have new ones to upload
    if (images.length > 0) {
      // Upload images to Supabase Storage
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${carId}/${i}-${Date.now()}.${fileExt}`;
        
        // The bucket was already created via SQL migration, so we can directly upload
        console.log(`Uploading image ${i+1}/${images.length} to car_images/${fileName}`);
        
        try {
          // Upload the file to Supabase Storage
          const { error: uploadError, data: uploadData } = await supabase
            .storage
            .from('car_images')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error("Error uploading image:", uploadError);
            continue; // Try to upload the next image
          }

          // Get the public URL for the uploaded image
          const { data: publicUrlData } = supabase
            .storage
            .from('car_images')
            .getPublicUrl(fileName);

          if (publicUrlData) {
            console.log("Image uploaded, public URL:", publicUrlData.publicUrl);
            allImageUrls.push(publicUrlData.publicUrl);
          }
        } catch (error) {
          console.error("Error in image upload process:", error);
        }
      }
    }

    // Update car listing with all image URLs (existing + new), even if it's an empty array
    console.log("Updating car with images:", { carId, imageUrlsCount: allImageUrls.length });
    
    const { error: updateError } = await supabase
      .from('car_listings')
      .update({ images: allImageUrls })
      .eq('id', carId);

    if (updateError) {
      console.error("Error updating car listing with images:", updateError);
    }

    return { success: true, carId };
  } catch (error) {
    console.error("Error submitting listing:", error);
    throw error;
  }
}

export async function fetchMyListings(userId: string): Promise<CarListingRow[]> {
  try {
    const { data, error } = await supabase
      .from('car_listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching listings:", error);
      throw new Error('Failed to fetch listings');
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}

export async function updateCarListingStatus(id: string, status: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('car_listings')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error("Error updating car listing status:", error);
      throw new Error('Failed to update car listing status');
    }
  } catch (error) {
    console.error("Error updating car listing status:", error);
    throw error;
  }
}

export async function deleteCarListing(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('car_listings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting car listing:", error);
      throw new Error('Failed to delete car listing');
    }
  } catch (error) {
    console.error("Error deleting car listing:", error);
    throw error;
  }
}
