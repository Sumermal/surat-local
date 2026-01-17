-- Create listing_images table for multiple photos per listing
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  caption_hi TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_listing_images_listing ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_primary ON listing_images(listing_id, is_primary);

-- Enable RLS on listing_images
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;

-- Public can read images
CREATE POLICY "Anyone can view listing images" ON listing_images
  FOR SELECT USING (true);

-- Authenticated users can insert images  
CREATE POLICY "Authenticated users can upload images" ON listing_images
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Users can update their own uploaded images
CREATE POLICY "Users can update own images" ON listing_images
  FOR UPDATE TO authenticated
  USING (uploaded_by = auth.uid());

-- Users can delete their own uploaded images, admins can delete any
CREATE POLICY "Users can delete own images" ON listing_images
  FOR DELETE TO authenticated
  USING (uploaded_by = auth.uid());
