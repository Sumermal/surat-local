-- Create storage bucket for listing images
-- Note: This needs to be run with service role permissions
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images',
  'listing-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public to view images
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'listing-images');

-- Allow authenticated users to upload images  
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'listing-images');

-- Allow users to update their own images
CREATE POLICY "User Update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'listing-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own images
CREATE POLICY "User Delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'listing-images' AND (storage.foldername(name))[1] = auth.uid()::text);
