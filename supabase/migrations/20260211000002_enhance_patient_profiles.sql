-- Add comprehensive health and administrative fields to profiles table
DO $$ BEGIN -- Emergency Contact
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'emergency_contact_name'
) THEN
ALTER TABLE public.profiles
ADD COLUMN emergency_contact_name TEXT;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'emergency_contact_phone'
) THEN
ALTER TABLE public.profiles
ADD COLUMN emergency_contact_phone TEXT;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'emergency_contact_relationship'
) THEN
ALTER TABLE public.profiles
ADD COLUMN emergency_contact_relationship TEXT;
END IF;
-- Primary Physician
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'primary_physician_name'
) THEN
ALTER TABLE public.profiles
ADD COLUMN primary_physician_name TEXT;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'primary_physician_phone'
) THEN
ALTER TABLE public.profiles
ADD COLUMN primary_physician_phone TEXT;
END IF;
-- Insurance
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'insurance_provider'
) THEN
ALTER TABLE public.profiles
ADD COLUMN insurance_provider TEXT;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'insurance_policy_number'
) THEN
ALTER TABLE public.profiles
ADD COLUMN insurance_policy_number TEXT;
END IF;
-- Lifestyle
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'activity_level'
) THEN
ALTER TABLE public.profiles
ADD COLUMN activity_level TEXT;
-- e.g., sedentary, active, very_active
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'smoking_status'
) THEN
ALTER TABLE public.profiles
ADD COLUMN smoking_status TEXT;
-- e.g., non_smoker, occasional, regular
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'alcohol_consumption'
) THEN
ALTER TABLE public.profiles
ADD COLUMN alcohol_consumption TEXT;
-- e.g., none, social, regular
END IF;
END $$;