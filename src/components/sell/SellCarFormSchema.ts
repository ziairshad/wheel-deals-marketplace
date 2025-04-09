
import * as z from "zod";

// Define the form schema
export const sellCarFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  price: z.string().min(1, "Price is required"),
  mileage: z.string().min(1, "Mileage is required"),
  bodyType: z.string().min(1, "Body type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  color: z.string().min(1, "Color is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  contactName: z.string().min(1, "Contact name is required"),
  contactPhone: z.string().min(7, "Valid phone number required"),
  contactEmail: z.string().email("Invalid email address"),
  vin: z.string().min(17, "VIN must be at least 17 characters").max(17, "VIN must be exactly 17 characters"),
  regionalSpecs: z.string().min(1, "Regional specs is required"),
});
