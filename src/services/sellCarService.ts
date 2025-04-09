
import { supabase } from "@/integrations/supabase/client";
import { CarFormData } from "@/types/car";

export async function submitCarListing(formData: CarFormData, userId: string, images: File[]) {
  try {
    // Insert car listing into database
    const { data: carData, error: carError } = await supabase
      .from('car_listings')
      .insert([
        {
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
        }
      ])
      .select()
      .single();

    if (carError) {
      throw carError;
    }

    // Upload images
    const carId = carData.id;
    const imageUrls = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${carId}/${i}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('car_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('car_images')
        .getPublicUrl(filePath);

      imageUrls.push(publicUrl);
    }

    // Update car listing with image URLs
    const { error: updateError } = await supabase
      .from('car_listings')
      .update({ images: imageUrls })
      .eq('id', carId);

    if (updateError) {
      throw updateError;
    }

    return { success: true, carId };
  } catch (error) {
    console.error("Error submitting listing:", error);
    throw error;
  }
}

export async function fetchMyListings(userId: string) {
  try {
    const { data, error } = await supabase
      .from('car_listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}
