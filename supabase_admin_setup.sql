-- Create admin table
CREATE TABLE IF NOT EXISTS admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_admin_user_id ON admin(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_email ON admin(email);

-- Enable RLS on admin table
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only authenticated users can read admin records
CREATE POLICY "Authenticated users can read admin records" ON admin
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- RLS Policy: Only service role can create admin records (for setup)
CREATE POLICY "Service role can create admin records" ON admin
  FOR INSERT
  WITH CHECK (false); -- Will be bypassed by service role

-- RLS Policy: Only service role can update admin records
CREATE POLICY "Service role can update admin records" ON admin
  FOR UPDATE
  USING (false); -- Will be bypassed by service role

-- RLS Policy: Only service role can delete admin records
CREATE POLICY "Service role can delete admin records" ON admin
  FOR DELETE
  USING (false); -- Will be bypassed by service role

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin 
    WHERE user_id = user_uuid
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN is_admin(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Messages table RLS policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public can create messages
CREATE POLICY "Public can create messages" ON messages
  FOR INSERT
  WITH CHECK (true);

-- Admin can read all messages
CREATE POLICY "Admin can read all messages" ON messages
  FOR SELECT
  USING (is_current_user_admin());

-- Admin can delete messages
CREATE POLICY "Admin can delete messages" ON messages
  FOR DELETE
  USING (is_current_user_admin());

-- Testimonials table RLS policies
ALTER TABLE testimonial ENABLE ROW LEVEL SECURITY;

-- Public can read testimonials
CREATE POLICY "Public can read testimonials" ON testimonial
  FOR SELECT
  USING (true);

-- Admin can manage testimonials
CREATE POLICY "Admin can manage testimonials" ON testimonial
  FOR ALL
  USING (is_current_user_admin());

-- Articles table RLS policies
ALTER TABLE article ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
CREATE POLICY "Public can read published articles" ON article
  FOR SELECT
  USING (published = true);

-- Admin can manage all articles
CREATE POLICY "Admin can manage articles" ON article
  FOR ALL
  USING (is_current_user_admin());

-- Projects table RLS policies
ALTER TABLE project ENABLE ROW LEVEL SECURITY;

-- Public can read projects
CREATE POLICY "Public can read projects" ON project
  FOR SELECT
  USING (true);

-- Admin can manage projects
CREATE POLICY "Admin can manage projects" ON project
  FOR ALL
  USING (is_current_user_admin());

-- Awards table RLS policies
ALTER TABLE award ENABLE ROW LEVEL SECURITY;

-- Public can read awards
CREATE POLICY "Public can read awards" ON award
  FOR SELECT
  USING (true);

-- Admin can manage awards
CREATE POLICY "Admin can manage awards" ON award
  FOR ALL
  USING (is_current_user_admin());

-- Services table RLS policies
ALTER TABLE service ENABLE ROW LEVEL SECURITY;

-- Public can read services
CREATE POLICY "Public can read services" ON service
  FOR SELECT
  USING (true);

-- Admin can manage services
CREATE POLICY "Admin can manage services" ON service
  FOR ALL
  USING (is_current_user_admin());

-- Education table RLS policies
ALTER TABLE education ENABLE ROW LEVEL SECURITY;

-- Public can read education
CREATE POLICY "Public can read education" ON education
  FOR SELECT
  USING (true);

-- Admin can manage education
CREATE POLICY "Admin can manage education" ON education
  FOR ALL
  USING (is_current_user_admin());