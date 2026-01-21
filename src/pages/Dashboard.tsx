import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ConversationalSymptomChecker } from "@/components/dashboard/ConversationalSymptomChecker";
import { EmergencyMode } from "@/components/dashboard/EmergencyMode";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <ConversationalSymptomChecker />
      <EmergencyMode />
    </DashboardLayout>
  );
};

export default Dashboard;