-- Phase 1: Database Schema Extensions

-- Add role to profiles
ALTER TABLE public.profiles ADD COLUMN role TEXT CHECK (role IN ('patient', 'doctor', 'clinic_admin', 'admin')) DEFAULT 'patient';

-- Clinics table
CREATE TABLE public.clinics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  onboarding_status TEXT DEFAULT 'pending' CHECK (onboarding_status IN ('pending', 'verified', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE UNIQUE,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE SET NULL,
  specialization TEXT,
  license_number TEXT,
  availability JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  patient_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  medications JSONB NOT NULL DEFAULT '[]',
  instructions TEXT,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Clinics: Viewable by anyone? Or only associated doctors/admins?
CREATE POLICY "Clinics are viewable by anyone" ON public.clinics FOR SELECT USING (true);
CREATE POLICY "Only clinic admins can update clinics" ON public.clinics FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'clinic_admin'));

-- Doctors: Viewable by anyone. Managed by self.
CREATE POLICY "Doctors are viewable by anyone" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Doctors can manage own record" ON public.doctors FOR ALL USING (user_id = auth.uid());

-- Appointments: Patients see own. Doctors see theirs. Clinic admins see clinic's.
CREATE POLICY "Users can view own appointments" ON public.appointments FOR SELECT 
  USING (patient_id = auth.uid() OR doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

CREATE POLICY "Patients can book appointments" ON public.appointments FOR INSERT 
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Involved parties can update appointments" ON public.appointments FOR UPDATE 
  USING (patient_id = auth.uid() OR doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

-- Prescriptions: Patients see own. Doctors see theirs.
CREATE POLICY "Users can view own prescriptions" ON public.prescriptions FOR SELECT 
  USING (patient_id = auth.uid() OR doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

CREATE POLICY "Doctors can issue prescriptions" ON public.prescriptions FOR INSERT 
  WITH CHECK (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

-- Invoices: Patients see own. Clinic admins see clinic's.
CREATE POLICY "Users can view own invoices" ON public.invoices FOR SELECT 
  USING (patient_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.doctors d 
    JOIN public.profiles p ON d.user_id = p.user_id 
    WHERE d.clinic_id = invoices.clinic_id AND p.user_id = auth.uid() AND p.role = 'clinic_admin'
  ));

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- Update handle_new_user to include role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Updated at triggers
CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON public.clinics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
