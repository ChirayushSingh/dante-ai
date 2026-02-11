-- Add reason_for_visit and insurance fields to appointments table
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'appointments'
        AND column_name = 'reason_for_visit'
) THEN
ALTER TABLE public.appointments
ADD COLUMN reason_for_visit TEXT;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'appointments'
        AND column_name = 'insurance_provider'
) THEN
ALTER TABLE public.appointments
ADD COLUMN insurance_provider TEXT;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'appointments'
        AND column_name = 'insurance_id'
) THEN
ALTER TABLE public.appointments
ADD COLUMN insurance_id TEXT;
END IF;
END $$;