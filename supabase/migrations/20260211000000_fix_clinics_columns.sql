-- Ensure clinics table has all required columns
-- This migration is idempotent - it only adds columns if they don't exist
DO $$ BEGIN -- Add address column if it doesn't exist
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'clinics'
        AND column_name = 'address'
) THEN
ALTER TABLE public.clinics
ADD COLUMN address TEXT;
END IF;
-- Add phone column if it doesn't exist
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'clinics'
        AND column_name = 'phone'
) THEN
ALTER TABLE public.clinics
ADD COLUMN phone TEXT;
END IF;
-- Add email column if it doesn't exist
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'clinics'
        AND column_name = 'email'
) THEN
ALTER TABLE public.clinics
ADD COLUMN email TEXT;
END IF;
END $$;
-- Add INSERT policy for clinics if it doesn't exist
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
        AND tablename = 'clinics'
        AND policyname = 'Authenticated users can create clinics'
) THEN CREATE POLICY "Authenticated users can create clinics" ON public.clinics FOR
INSERT WITH CHECK (auth.uid() IS NOT NULL);
END IF;
END $$;