import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  Calendar, 
  ChevronRight, 
  FileText, 
  Download,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const historyData = [
  {
    id: "1",
    date: "Jan 14, 2026",
    symptoms: ["Headache", "Fever", "Fatigue"],
    topPrediction: "Common Cold",
    confidence: 78,
    severity: "low",
  },
  {
    id: "2",
    date: "Jan 10, 2026",
    symptoms: ["Chest Pain", "Shortness of Breath"],
    topPrediction: "Anxiety",
    confidence: 65,
    severity: "medium",
  },
  {
    id: "3",
    date: "Jan 5, 2026",
    symptoms: ["Stomach Pain", "Nausea"],
    topPrediction: "Food Poisoning",
    confidence: 82,
    severity: "low",
  },
];

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = historyData.filter(
    (item) =>
      item.topPrediction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-success/10 text-success";
      case "medium":
        return "bg-warning/10 text-warning";
      case "high":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Check History</h1>
            <p className="text-muted-foreground">
              View and manage your past symptom checks
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by symptom or condition..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>

        {/* History List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No history found matching your search</p>
            </div>
          ) : (
            filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card rounded-xl border border-border p-5 shadow-soft hover:shadow-medium transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(item.severity)}`}>
                        {item.severity} risk
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">
                      {item.topPrediction}
                      <span className="text-muted-foreground font-normal text-sm ml-2">
                        {item.confidence}% confidence
                      </span>
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {item.symptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default History;
