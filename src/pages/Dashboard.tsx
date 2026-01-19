import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ConversationalSymptomChecker } from "@/components/dashboard/ConversationalSymptomChecker";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <ConversationalSymptomChecker />
    </DashboardLayout>
  );
};

export default Dashboard;