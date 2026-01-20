import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  Calendar, 
  ChevronRight, 
  FileText, 
  Download,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UrgencyBadge } from "@/components/dashboard/UrgencyBadge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface SymptomCheck {
  id: string;
  created_at: string;
  symptoms: any[];
  predictions: any[];
  urgency_level: string | null;
  urgency_explanation: string | null;
  ai_summary: string | null;
}

const History = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [historyData, setHistoryData] = useState<SymptomCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCheck, setSelectedCheck] = useState<SymptomCheck | null>(null);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from("symptom_checks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Parse the JSON fields properly
      const parsedData = data.map(item => ({
        ...item,
        symptoms: Array.isArray(item.symptoms) ? item.symptoms : [],
        predictions: Array.isArray(item.predictions) ? item.predictions : [],
      })) as SymptomCheck[];
      setHistoryData(parsedData);
    }
    setIsLoading(false);
  };

  const filteredHistory = historyData.filter((item) => {
    const topPrediction = item.predictions?.[0]?.condition || "";
    const symptoms = item.symptoms || [];
    const searchLower = searchQuery.toLowerCase();
    
    return (
      topPrediction.toLowerCase().includes(searchLower) ||
      symptoms.some((s: string) => s.toLowerCase().includes(searchLower)) ||
      item.ai_summary?.toLowerCase().includes(searchLower)
    );
  });

  const getUrgencyIcon = (urgency: string | null) => {
    switch (urgency) {
      case "emergency":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "consult_soon":
        return <Clock className="h-4 w-4 text-info" />;
      default:
        return <CheckCircle className="h-4 w-4 text-success" />;
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
          <Button variant="outline" className="gap-2" disabled={historyData.length === 0}>
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
            placeholder="Search by symptom, condition, or summary..."
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
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="animate-pulse">Loading your history...</div>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              {historyData.length === 0 ? (
                <>
                  <p className="font-medium">No symptom checks yet</p>
                  <p className="text-sm mt-1">Start a symptom check to see your history here</p>
                </>
              ) : (
                <p>No history found matching your search</p>
              )}
            </div>
          ) : (
            filteredHistory.map((item, index) => {
              const topPrediction = item.predictions?.[0];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => setSelectedCheck(selectedCheck?.id === item.id ? null : item)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(item.created_at), "MMM dd, yyyy 'at' h:mm a")}
                        </span>
                        {item.urgency_level && (
                          <UrgencyBadge level={item.urgency_level as any} />
                        )}
                      </div>
                      
                      {topPrediction && (
                        <h3 className="font-semibold text-lg mb-2">
                          {topPrediction.condition}
                          <span className="text-muted-foreground font-normal text-sm ml-2">
                            {Math.round(topPrediction.confidence * 100)}% confidence
                          </span>
                        </h3>
                      )}
                      
                      {item.ai_summary && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.ai_summary}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {item.symptoms?.slice(0, 4).map((symptom: string, i: number) => (
                          <span
                            key={i}
                            className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                          >
                            {typeof symptom === 'string' ? symptom.slice(0, 30) : 'Symptom'}
                            {typeof symptom === 'string' && symptom.length > 30 ? '...' : ''}
                          </span>
                        ))}
                        {item.symptoms?.length > 4 && (
                          <span className="text-xs text-muted-foreground">
                            +{item.symptoms.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${selectedCheck?.id === item.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedCheck?.id === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 pt-4 border-t border-border space-y-4"
                    >
                      {item.urgency_explanation && (
                        <div className="flex items-start gap-2">
                          {getUrgencyIcon(item.urgency_level)}
                          <div>
                            <p className="text-sm font-medium">Urgency Assessment</p>
                            <p className="text-sm text-muted-foreground">{item.urgency_explanation}</p>
                          </div>
                        </div>
                      )}
                      
                      {item.predictions?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">All Predictions</p>
                          <div className="space-y-2">
                            {item.predictions.map((pred: any, i: number) => (
                              <div key={i} className="bg-muted/50 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-medium text-sm">{pred.condition}</span>
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    {Math.round(pred.confidence * 100)}%
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">{pred.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default History;
