import { z } from "zod";

const propertyTypeEnum = z.enum(["buy", "rent"]);
const propertyCategoryEnum = z.enum(["apartment", "house", "land"]);

export const createListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  type: propertyTypeEnum,
  category: propertyCategoryEnum,
  price: z.number().min(0),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().min(1, "Address is required"),
  area_sqft: z.number().min(0),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  expiry_at: z.string().datetime().optional().nullable(),
});

export const updateListingSchema = createListingSchema.partial();

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
