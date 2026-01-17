export interface Area {
  id: string
  name: string
  name_hi: string
  slug: string
  description: string | null
  description_hi: string | null
  image_url: string | null
  listing_count?: number
}

export interface Category {
  id: string
  name: string
  name_hi: string
  slug: string
  icon: string
  description: string | null
  description_hi: string | null
  listing_count?: number
}

export interface Listing {
  id: string
  name: string
  name_hi: string | null
  slug: string
  description: string | null
  description_hi: string | null
  address: string
  address_hi: string | null
  phone: string | null
  email: string | null
  website: string | null
  hours: string | null
  hours_hi: string | null
  image_url: string | null
  images: string[] | null
  latitude: number | null
  longitude: number | null
  is_verified: boolean
  is_featured: boolean
  area_id: string
  category_id: string
  created_at: string
  updated_at: string
  area?: Area
  category?: Category
  avg_rating?: number
  review_count?: number
}

export interface ListingImage {
  id: string
  listing_id: string
  image_url: string
  caption: string | null
  caption_hi: string | null
  display_order: number
  is_primary: boolean
  uploaded_by: string | null
  created_at: string
}

export interface Review {
  id: string
  listing_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  profile?: {
    full_name: string | null
    avatar_url: string | null
  }
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: "user" | "admin"
  created_at: string
}

export interface UserSubmission {
  id: string
  user_id: string
  area_id: string
  category_id: string
  name: string
  description: string | null
  address: string
  phone: string | null
  status: "pending" | "approved" | "rejected"
  submission_data?: {
    name_hi?: string
    description_hi?: string
    address_hi?: string
    email?: string
    website?: string
    hours?: string
    images?: {
      url: string
      caption?: string
      caption_hi?: string
      is_primary?: boolean
    }[]
  }
  created_at: string
}
