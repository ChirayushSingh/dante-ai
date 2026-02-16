-- Add date_of_birth and gender to profiles if they don't exist
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'date_of_birth'
) THEN
ALTER TABLE public.profiles
ADD COLUMN date_of_birth DATE;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'gender'
) THEN
ALTER TABLE public.profiles
ADD COLUMN gender TEXT;
END IF;
END $$;