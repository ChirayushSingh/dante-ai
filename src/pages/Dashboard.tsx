import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EnhancedSymptomChecker } from "@/components/dashboard/EnhancedSymptomChecker";
import { EmergencyMode } from "@/components/dashboard/EmergencyMode";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { useOnboarding } from "@/hooks/useOnboarding";
import { VoiceConsultation } from "@/components/dashboard/VoiceConsultation";
import { InteractiveBodyMap } from "@/components/tools/InteractiveBodyMap";
import { SmartVitalsDashboard } from "@/components/dashboard/SmartVitalsDashboard";
import { DoctorPortal } from "@/components/dashboard/DoctorPortal";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Calendar, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { needsOnboarding, isChecking, completeOnboarding } = useOnboarding();
  const { profile, loading: profileLoading } = useProfile();
  const [selectedBodyAreas, setSelectedBodyAreas] = useState<string[]>([]);
  const navigate = useNavigate();

  // Show loading while checking onboarding status or profile
  if (isChecking || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // Show onboarding wizard for new users (patients mostly)
  if (needsOnboarding && profile?.role === 'patient') {
    return <OnboardingWizard onComplete={completeOnboarding} />;
  }

  const isDoctor = profile?.role === 'doctor' || profile?.role === 'clinic_admin';

  return (
    <DashboardLayout>
      {isDoctor ? (
        <div className="space-y-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'Doctor'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                You are using the Diagnova <span className="font-semibold">Doctor / Clinic</span> workspace.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1 border border-primary/20">
              Doctor Mode
            </span>
          </div>
          <DoctorPortal />
        </div>
      ) : (
        <>
          <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 p-8">
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <div className="w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-1">
                  Hello, {profile?.full_name?.split(' ')[0] || 'Friend'}! 👋
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl">
                  How are you feeling today? I'm here to help you check your symptoms and stay healthy.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 border border-emerald-200 mt-2 sm:mt-0">
                Patient Mode
              </span>
            </div>
          </div>

          {!profile?.blood_type && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 rounded-3xl bg-accent/10 border border-accent/20 flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/20 rounded-2xl">
                  <Activity className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Complete Your Medical Profile</h3>
                  <p className="text-muted-foreground text-sm">Add your allergies, conditions and blood type for better AI insights.</p>
                </div>
              </div>
              <Button onClick={() => navigate('/dashboard/registration')} className="bg-accent hover:bg-accent/90 text-white whitespace-nowrap">
                Complete Now
              </Button>
            </motion.div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <EnhancedSymptomChecker />

            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => window.location.href = '/dashboard/book'}
                className="p-6 rounded-3xl bg-blue-600 text-white cursor-pointer shadow-xl shadow-blue-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Book an Appointment</h3>
                    <p className="text-blue-100 text-sm">Schedule a visit with your doctor.</p>
                  </div>
                  <ChevronRight className="ml-auto" />
                </div>
              </motion.div>

              <EmergencyMode />
            </div>
          </div>

          <div className="grid gap-6">
            <VoiceConsultation />
            <InteractiveBodyMap
              onPartSelect={(area) => {
                setSelectedBodyAreas(prev =>
                  prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
                );
              }}
            />
            <SmartVitalsDashboard />
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
