import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EnhancedSymptomChecker } from "@/components/dashboard/EnhancedSymptomChecker";
import { EmergencyMode } from "@/components/dashboard/EmergencyMode";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { useOnboarding } from "@/hooks/useOnboarding";
import { VoiceConsultation } from "@/components/dashboard/VoiceConsultation";
import { InteractiveBodyMap } from "@/components/tools/InteractiveBodyMap";
import { SmartVitalsDashboard } from "@/components/dashboard/SmartVitalsDashboard";
import { DoctorPortal } from "@/components/dashboard/DoctorPortal";
import { DigitalTwinCard } from "@/components/dashboard/DigitalTwinCard";
import { CameraVitals } from "@/components/dashboard/CameraVitals";
import { GuardianVoiceAI } from "@/components/dashboard/GuardianVoiceAI";
import { EnvironmentalGuardian } from "@/components/dashboard/EnvironmentalGuardian";
import { useProfile } from "@/hooks/useProfile";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Calendar, ChevronRight, Activity, Brain, LineChart, ShieldAlert, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { needsOnboarding, isChecking, completeOnboarding } = useOnboarding();
  const { profile, loading: profileLoading } = useProfile();
  const [selectedBodyAreas, setSelectedBodyAreas] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const isDoctor = profile?.role === 'doctor' || profile?.role === 'clinic_admin';

  // Check for doctor onboarding
  useEffect(() => {
    if (user && isDoctor && !profileLoading) {
      const checkDoctorRecord = async () => {
        const { data, error } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!data && !error) {
          navigate('/dashboard/onboarding');
        }
      };
      checkDoctorRecord();
    }
  }, [user, isDoctor, profileLoading, navigate]);

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
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Welcome Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 p-8">
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

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DigitalTwinCard score={84} />
            </div>
            <Card className="border-none shadow-xl bg-primary/5 p-6 flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" />
                Health Protection
              </h3>
              <p className="text-muted-foreground mb-4">Your AI twin confirms you are well-protected against current local flu trends.</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/dashboard/analytics')}
              >
                View detailed trends
              </Button>
            </Card>
          </div>

          {!profile?.blood_type && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-3xl bg-accent/10 border border-accent/20 flex flex-col md:flex-row items-center justify-between gap-4"
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

          {/* Structured Content with Tabs */}
          <Tabs defaultValue="assessment" className="space-y-8">
            <TabsList className="bg-muted/50 p-1 h-auto grid grid-cols-2 md:grid-cols-4 rounded-2xl max-w-4xl mx-auto gap-1">
              <TabsTrigger value="assessment" className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Brain className="w-4 h-4 mr-2" />
                Assessment AI
              </TabsTrigger>
              <TabsTrigger value="guardian" className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Shield className="w-4 h-4 mr-2" />
                Guardian AI
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <LineChart className="w-4 h-4 mr-2" />
                Smart Monitoring
              </TabsTrigger>
              <TabsTrigger value="care" className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <ShieldAlert className="w-4 h-4 mr-2" />
                Care & Support
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assessment" className="space-y-8 focus-visible:outline-none">
              <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
                <div className="space-y-6">
                  <EnhancedSymptomChecker />
                  <VoiceConsultation />
                </div>
                <div className="space-y-6">
                  <div className="rounded-3xl border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" />
                      Interactive Body Map
                    </h3>
                    <InteractiveBodyMap
                      onPartSelect={(area) => {
                        setSelectedBodyAreas(prev =>
                          prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guardian" className="space-y-8 focus-visible:outline-none">
              <div className="grid gap-8 lg:grid-cols-2">
                <CameraVitals />
                <div className="space-y-8">
                  <GuardianVoiceAI />
                  <EnvironmentalGuardian />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-8 focus-visible:outline-none">
              <SmartVitalsDashboard />
            </TabsContent>

            <TabsContent value="care" className="space-y-8 focus-visible:outline-none">
              <div className="grid gap-6 md:grid-cols-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate('/dashboard/book')}
                  className="p-8 rounded-3xl bg-blue-600 text-white cursor-pointer shadow-xl shadow-blue-200 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-white/20 rounded-2xl">
                      <Calendar className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl">Book an Appointment</h3>
                      <p className="text-blue-100 mt-1">Schedule a visit with your doctor or clinic specialist.</p>
                    </div>
                    <ChevronRight className="ml-auto h-8 w-8" />
                  </div>
                </motion.div>

                <EmergencyMode />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
