-- Run this script in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public."Passkeys" (
  id uuid default gen_random_uuid() primary key,
  "userId" uuid references auth.users(id) on delete cascade,
  "credentialID" text not null unique,
  "credentialPublicKey" bytea not null,
  "counter" bigint not null default 0,
  "transports" text[] default '{}',
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
ALTER TABLE public."Passkeys" ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own passkeys
CREATE POLICY "Users can view own passkeys" ON public."Passkeys"
  FOR SELECT USING (auth.uid() = "userId");

-- Allow insertion of passkeys from service role (API)
CREATE POLICY "Service role can insert passkeys" ON public."Passkeys"
  FOR INSERT WITH CHECK (true);

-- Allow update of passkeys from service role (API)
CREATE POLICY "Service role can update passkeys" ON public."Passkeys"
  FOR UPDATE USING (true);
