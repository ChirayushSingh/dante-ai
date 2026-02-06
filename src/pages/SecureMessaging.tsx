import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DoctorMessaging } from "@/components/dashboard/DoctorMessaging";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Loader2, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function SecureMessaging() {
    const { user } = useAuth();
    const { profile, loading } = useProfile();
    const [assignedDoctor, setAssignedDoctor] = useState<any>(null);
    const [fetchingDoc, setFetchingDoc] = useState(false);

    useEffect(() => {
        if (user && profile?.role === 'patient') {
            fetchAssignedDoctor();
        }
    }, [user, profile]);

    const fetchAssignedDoctor = async () => {
        setFetchingDoc(true);
        try {
            // For demo: get the first doctor from the first appointment
            const { data, error } = await (supabase
                .from('appointments' as any) as any)
                .select('*, doctors(*, profiles(*))')
                .eq('patient_id', user?.id)
                .limit(1)
                .single();

            if (data?.doctors) {
                setAssignedDoctor({
                    id: data.doctors.id,
                    name: data.doctors.profiles?.full_name || "Your Doctor",
                    user_id: data.doctors.user_id
                });
            }
        } catch (err) {
            console.error("Error fetching doctor:", err);
        } finally {
            setFetchingDoc(false);
        }
    };

    if (loading || fetchingDoc) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <MessageSquare className="h-8 w-8 text-primary" />
                        Secure Messaging
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Direct, HIPAA-compliant communication with your medical team.
                    </p>
                </div>

                {assignedDoctor ? (
                    <DoctorMessaging
                        patientId={user?.id || ""}
                        patientName={profile?.full_name || "Patient"}
                        onClose={() => { }}
                    />
                ) : (
                    <div className="p-12 text-center rounded-3xl bg-muted/50 border-2 border-dashed border-muted">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold">No active conversations</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                            Conversations are initiated by your provider or after your first appointment.
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
