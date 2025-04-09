
import { CarFormData } from "@/types/car";
import { CarListingRow, supabase } from "@/integrations/supabase/client";

export async function submitCarListing(formData: CarFormData, userId: string, images: File[]) {
  try {
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
      status: 'available', // Ensure status is set to 'available'
      vin: formData.vin,
    };

    // Insert car listing into database using Supabase client
    const { data: carData, error: insertError } = await supabase
      .from('car_listings')
      .insert(carListingData)
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting car listing:", insertError);
      throw new Error('Failed to submit car listing');
    }

    const carId = carData.id;
    const imageUrls = [];

    // Upload images to Supabase Storage
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${carId}/${i}-${Date.now()}.${fileExt}`;
      
      // Check if bucket exists first
      const { data: buckets } = await supabase.storage.listBuckets();
      
      let bucketExists = false;
      if (buckets) {
        bucketExists = buckets.some(bucket => bucket.name === 'car_images');
      }
      
      // If bucket doesn't exist, try to create it
      if (!bucketExists) {
        try {
          await supabase.storage.createBucket('car_images', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
            fileSizeLimit: 5242880, // 5MB
          });
        } catch (error) {
          console.error("Error creating bucket:", error);
          // Continue anyway, as the bucket might exist despite the error
        }
      }

      try {
        // Upload the file to Supabase Storage
        const { error: uploadError, data: uploadData } = await supabase
          .storage
          .from('car_images')
          .upload(fileName, file);

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
          imageUrls.push(publicUrlData.publicUrl);
        }
      } catch (error) {
        console.error("Error in image upload process:", error);
      }
    }

    // Update car listing with image URLs if we have any
    if (imageUrls.length > 0) {
      const { error: updateError } = await supabase
        .from('car_listings')
        .update({ images: imageUrls })
        .eq('id', carId);

      if (updateError) {
        console.error("Error updating car listing with images:", updateError);
        // We'll continue anyway since the listing was created
      }
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
