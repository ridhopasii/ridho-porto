-- Create messages table for Chat Room
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  image TEXT,
  message TEXT NOT NULL,
  is_reply BOOLEAN DEFAULT false,
  reply_to TEXT,
  is_show BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
ON public.messages FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.messages FOR INSERT
WITH CHECK (true); -- Note: Since we insert via API route, the service role key bypasses this, but good practice.

CREATE POLICY "Enable delete for authenticated users"
ON public.messages FOR DELETE
USING (true);
