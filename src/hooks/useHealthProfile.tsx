import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface HealthProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  blood_type: string | null;
  subscription_tier: string;
  checks_remaining: number;
  // Patient specific enhancements
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;
  primary_physician_name: string | null;
  primary_physician_phone: string | null;
  insurance_provider: string | null;
  insurance_policy_number: string | null;
  activity_level: string | null;
  smoking_status: string | null;
  alcohol_consumption: string | null;
}

export interface ChronicCondition {
  id: string;
  condition_name: string;
  diagnosed_date: string | null;
  notes: string | null;
}

export interface Allergy {
  id: string;
  allergen: string;
  severity: string | null;
  notes: string | null;
}

export interface Medication {
  id: string;
  medication_name: string;
  dosage: string | null;
  frequency: string | null;
  is_current: boolean;
}

export function useHealthProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return (data as unknown) as HealthProfile;
    },
    enabled: !!user,
  });

  const conditionsQuery = useQuery({
    queryKey: ["conditions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("chronic_conditions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ChronicCondition[];
    },
    enabled: !!user,
  });

  const allergiesQuery = useQuery({
    queryKey: ["allergies", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("allergies")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Allergy[];
    },
    enabled: !!user,
  });

  const medicationsQuery = useQuery({
    queryKey: ["medications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_current", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Medication[];
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<HealthProfile>) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update profile: " + error.message);
    },
  });

  const addCondition = useMutation({
    mutationFn: async (condition: { condition_name: string; diagnosed_date?: string; notes?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("chronic_conditions")
        .insert({ ...condition, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conditions"] });
      toast.success("Condition added");
    },
  });

  const deleteCondition = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("chronic_conditions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conditions"] });
      toast.success("Condition removed");
    },
  });

  const addAllergy = useMutation({
    mutationFn: async (allergy: { allergen: string; severity?: string; notes?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("allergies")
        .insert({ ...allergy, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allergies"] });
      toast.success("Allergy added");
    },
  });

  const deleteAllergy = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("allergies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allergies"] });
      toast.success("Allergy removed");
    },
  });

  const addMedication = useMutation({
    mutationFn: async (medication: { medication_name: string; dosage?: string; frequency?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("medications")
        .insert({ ...medication, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast.success("Medication added");
    },
  });

  const deleteMedication = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("medications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast.success("Medication removed");
    },
  });

  // Calculate age from date of birth
  const getAge = () => {
    if (!profileQuery.data?.date_of_birth) return null;
    const today = new Date();
    const birth = new Date(profileQuery.data.date_of_birth);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Get health profile summary for AI context
  const getHealthContext = () => {
    return {
      age: getAge(),
      gender: profileQuery.data?.gender,
      conditions: conditionsQuery.data?.map(c => c.condition_name) || [],
      allergies: allergiesQuery.data?.map(a => a.allergen) || [],
      medications: medicationsQuery.data?.map(m => m.medication_name) || [],
      lifestyle: {
        activity_level: profileQuery.data?.activity_level,
        smoking_status: profileQuery.data?.smoking_status,
        alcohol_consumption: profileQuery.data?.alcohol_consumption,
      },
      contacts: {
        primary_physician: profileQuery.data?.primary_physician_name,
      }
    };
  };

  return {
    profile: profileQuery.data,
    conditions: conditionsQuery.data || [],
    allergies: allergiesQuery.data || [],
    medications: medicationsQuery.data || [],
    isLoading: profileQuery.isLoading,
    updateProfile,
    addCondition,
    deleteCondition,
    addAllergy,
    deleteAllergy,
    addMedication,
    deleteMedication,
    getAge,
    getHealthContext,
  };
}