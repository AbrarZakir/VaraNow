// Shared TS types — DB-shaped + DTOs

export type UserRole = "seeker" | "owner_agent" | "admin";
export type PropertyType = "buy" | "rent";
export type PropertyCategory = "apartment" | "house" | "land";
export type PropertyStatus = "available" | "sold" | "rented";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  type: PropertyType;
  category: PropertyCategory;
  price: number;
  latitude: number;
  longitude: number;
  address: string;
  area_sqft: number;
  bedrooms: number;
  bathrooms: number;
  status: PropertyStatus;
  expiry_at: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  sort_order: number;
}

export interface Bookmark {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
}
