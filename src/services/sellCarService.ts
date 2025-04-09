
import { CarFormData } from "@/types/car";
import { CarListingRow } from "@/integrations/supabase/client";

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
      status: 'pending',
      vin: formData.vin,
    };

    // Insert car listing into database
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/car_listings`, {
      method: 'POST',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(carListingData)
    });

    if (!response.ok) {
      throw new Error('Failed to submit car listing');
    }

    const carData = await response.json();
    const carId = carData[0].id;

    // Upload images
    const imageUrls = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${carId}/${i}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/car_images/${filePath}`, {
        method: 'POST',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/car_images/${filePath}`;
      imageUrls.push(publicUrl);
    }

    // Update car listing with image URLs
    const updateResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/car_listings?id=eq.${carId}`, {
      method: 'PATCH',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ images: imageUrls })
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update car listing with images');
    }

    return { success: true, carId };
  } catch (error) {
    console.error("Error submitting listing:", error);
    throw error;
  }
}

export async function fetchMyListings(userId: string): Promise<CarListingRow[]> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/car_listings?user_id=eq.${userId}&select=*&order=created_at.desc`, {
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }
    
    const data = await response.json();
    return data as CarListingRow[];
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}
