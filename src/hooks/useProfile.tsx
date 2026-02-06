import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type UserRole = 'patient' | 'doctor' | 'clinic_admin' | 'admin';

export interface UserProfile {
    id: string;
    user_id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
    role: UserRole;
    subscription_tier: string;
}

export function useProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!user) {
            setProfile(null);
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (error) throw error;
                setProfile(data as any as UserProfile);
            } catch (err: any) {
                setError(err);
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

        // Subscribe to changes
        const subscription = supabase
            .channel(`profile:${user.id}`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "profiles", filter: `user_id=eq.${user.id}` },
                (payload) => {
                    setProfile(payload.new as any as UserProfile);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    return { profile, loading, error };
}
