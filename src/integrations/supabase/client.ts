
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// Create a custom type for car_listings table
export type CarListingRow = {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  body_type: string | null;
  transmission: string | null;
  fuel_type: string | null;
  exterior_color: string | null;
  location: string;
  description: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  status: string;
  created_at: string;
  images: string[] | null;
  vin: string | null;
}

// Helper function to fetch car by id that handles type safety
export const fetchCarById = async (id: string) => {
  const { data, error } = await supabase
    .from('car_listings')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    throw new Error('Failed to fetch car details');
  }
  
  return data as CarListingRow;
};
