-- Migration: Add username column to profile table

DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profile') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'username') THEN
      ALTER TABLE profile ADD COLUMN "username" TEXT DEFAULT '@ridhopasii';
    END IF;
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Profile') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Profile' AND column_name = 'username') THEN
      ALTER TABLE "Profile" ADD COLUMN "username" TEXT DEFAULT '@ridhopasii';
    END IF;
  END IF;
END $$;
