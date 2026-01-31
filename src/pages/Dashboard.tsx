import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EnhancedSymptomChecker } from "@/components/dashboard/EnhancedSymptomChecker";
import { EmergencyMode } from "@/components/dashboard/EmergencyMode";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { useOnboarding } from "@/hooks/useOnboarding";

const Dashboard = () => {
  const { needsOnboarding, isChecking, completeOnboarding } = useOnboarding();

  // Show loading while checking onboarding status
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show onboarding wizard for new users
  if (needsOnboarding) {
    return <OnboardingWizard onComplete={completeOnboarding} />;
  }

  return (
    <DashboardLayout>
      <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 p-8">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          {/* Abstract friendly shapes or illustration placeholder */}
          <div className="w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Hello, Friend! 👋
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            How are you feeling today? I'm here to help you check your symptoms and stay healthy.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <EnhancedSymptomChecker />
        <EmergencyMode />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
