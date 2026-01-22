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
      <EnhancedSymptomChecker />
      <EmergencyMode />
    </DashboardLayout>
  );
};

export default Dashboard;
