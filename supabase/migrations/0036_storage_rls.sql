-- Setup Row Level Security for Storage Buckets
-- Ensure 'portofolio' bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portofolio', 'portofolio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read all files in 'portofolio' bucket
DROP POLICY IF EXISTS "Public Access to Portofolio Bucket" ON storage.objects;
CREATE POLICY "Public Access to Portofolio Bucket"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portofolio' );

-- Policy: Authenticated users can insert files to 'portofolio' bucket
DROP POLICY IF EXISTS "Auth Users Insert to Portofolio" ON storage.objects;
CREATE POLICY "Auth Users Insert to Portofolio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'portofolio' );

-- Policy: Authenticated users can update files in 'portofolio' bucket
DROP POLICY IF EXISTS "Auth Users Update Portofolio" ON storage.objects;
CREATE POLICY "Auth Users Update Portofolio"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'portofolio' );

-- Policy: Authenticated users can delete files in 'portofolio' bucket
DROP POLICY IF EXISTS "Auth Users Delete Portofolio" ON storage.objects;
CREATE POLICY "Auth Users Delete Portofolio"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'portofolio' );
