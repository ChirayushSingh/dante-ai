-- Create health_vitals table for time-series health data
CREATE TABLE IF NOT EXISTS public.health_vitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (
        type IN (
            'heart_rate',
            'steps',
            'sleep',
            'o2_saturation',
            'blood_pressure_sys',
            'blood_pressure_dia'
        )
    ),
    value DECIMAL NOT NULL,
    unit TEXT,
    recorded_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);
-- Index for performance on time-based queries
CREATE INDEX IF NOT EXISTS idx_health_vitals_user_time ON public.health_vitals(user_id, recorded_at DESC);
-- Enable RLS
ALTER TABLE public.health_vitals ENABLE ROW LEVEL SECURITY;
-- Create RLS policies
CREATE POLICY "Users can view their own vitals" ON public.health_vitals FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own vitals" ON public.health_vitals FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vitals" ON public.health_vitals FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vitals" ON public.health_vitals FOR DELETE USING (auth.uid() = user_id);
-- Comment for clarity
COMMENT ON TABLE public.health_vitals IS 'Stores time-series biometric data from wearables and manual entry.';