import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SymptomChecker } from "@/components/dashboard/SymptomChecker";
import { 
  Activity, 
  TrendingUp, 
  FileText, 
  Clock 
} from "lucide-react";

const stats = [
  { icon: Activity, label: "Checks This Month", value: "3", change: "+2 from last month" },
  { icon: TrendingUp, label: "Accuracy Rate", value: "87%", change: "Based on feedback" },
  { icon: FileText, label: "Reports Generated", value: "2", change: "PDF downloads" },
  { icon: Clock, label: "Last Check", value: "2 days ago", change: "Common Cold analysis" },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            Enter your symptoms below to get AI-powered health insights.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl border border-border p-5 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">{stat.change}</p>
            </div>
          ))}
        </motion.div>

        {/* Symptom Checker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SymptomChecker />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
