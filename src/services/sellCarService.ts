
import { CarFormData } from "@/types/car";
import { CarListingRow, supabase } from "@/integrations/supabase/client";

export const submitCarListing = async (
  formData: CarFormData,
  userId: string,
  images: File[]
) => {
  try {
    // Upload images to storage
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;
        
        // Upload file
        const { error: uploadError } = await supabase.storage
          .from('car_images')
          .upload(filePath, image);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('car_images')
          .getPublicUrl(filePath);
          
        return data.publicUrl;
      })
    );
    
    // Prepare listing data
    const listingData = {
      user_id: userId,
      make: formData.make,
      model: formData.model,
      year: parseInt(formData.year as string),
      price: parseInt(formData.price as string),
      mileage: parseInt(formData.mileage as string),
      body_type: formData.bodyType,
      transmission: formData.transmission,
      fuel_type: formData.fuelType,
      exterior_color: formData.color, // Changed from color to exterior_color
      location: formData.location,
      description: formData.description,
      contact_name: formData.contactName,
      contact_phone: formData.contactPhone,
      contact_email: formData.contactEmail,
      vin: formData.vin,
      images: imageUrls.length > 0 ? imageUrls : undefined,
      status: 'available',
      created_at: new Date().toISOString(), // Convert Date to string
    };
    
    // Check if we're editing (formData has an id)
    if (formData.id) {
      const { error } = await supabase
        .from('car_listings')
        .update(listingData)
        .eq('id', formData.id);
        
      if (error) throw error;
      
      return formData.id;
    } else {
      // Insert new listing
      const { data, error } = await supabase
        .from('car_listings')
        .insert(listingData)
        .select('id')
        .single();
        
      if (error) throw error;
      
      return data.id;
    }
  } catch (error) {
    console.error('Error submitting car listing:', error);
    throw error;
  }
};

export const fetchMyListings = async (userId: string): Promise<CarListingRow[]> => {
  try {
    // Fetch all listings for the current user
    const { data, error } = await supabase
      .from('car_listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data as CarListingRow[];
  } catch (error) {
    console.error('Error fetching user listings:', error);
    throw error;
  }
};

export const fetchCarListingById = async (id: string): Promise<CarListingRow | null> => {
  try {
    const { data, error } = await supabase
      .from('car_listings')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data as CarListingRow;
  } catch (error) {
    console.error('Error fetching car listing:', error);
    throw error;
  }
};

export const updateCarListingStatus = async (id: string, status: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('car_listings')
      .update({ status })
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error updating car listing status:', error);
    throw error;
  }
};

export const deleteCarListing = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('car_listings')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting car listing:', error);
    throw error;
  }
};
