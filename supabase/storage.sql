-- ==============================================================================
-- GIGCRAFT - Supabase Storage Configuration Script
-- Target Bucket: "images"
-- Purpose: Enable public image uploads (gig covers, freelancer avatars, specs)
-- ==============================================================================

-- 1. Create the 'images' storage bucket if it does not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- 2. Enable Row-Level Security on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public View Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Deletes" ON storage.objects;
DROP POLICY IF EXISTS "Give anon and authenticated full access to images" ON storage.objects;

-- 4. Create Policies for the 'images' bucket
-- Policy 1: Allow public read access to anyone (so gig images and avatars load everywhere)
CREATE POLICY "Public View Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy 2: Allow uploads (insert) from both anon and authenticated users
CREATE POLICY "Allow Public Uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Policy 3: Allow updates from both anon and authenticated users
CREATE POLICY "Allow Public Updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Policy 4: Allow deletes from both anon and authenticated users
CREATE POLICY "Allow Public Deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');
