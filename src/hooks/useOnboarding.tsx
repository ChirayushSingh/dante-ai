import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export function useOnboarding() {
  const { user } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    } else {
      setIsChecking(false);
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("date_of_birth, gender")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking onboarding status:", error);
        setNeedsOnboarding(false);
      } else {
        // User needs onboarding if they haven't filled in basic info
        const isNewUser = !data?.date_of_birth && !data?.gender;
        setNeedsOnboarding(isNewUser);
      }
    } catch (error) {
      console.error("Error checking onboarding:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const completeOnboarding = () => {
    setNeedsOnboarding(false);
  };

  return {
    needsOnboarding,
    isChecking,
    completeOnboarding,
  };
}
