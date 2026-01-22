import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";
import { 
  Calendar, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UrgencyBadge } from "./UrgencyBadge";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  date: string;
  type: "symptom_check" | "prediction" | "milestone";
  title: string;
  description?: string;
  urgencyLevel?: string;
  confidence?: number;
  symptoms?: string[];
}

interface HealthTimelineProps {
  limit?: number;
  showTrends?: boolean;
}

export function HealthTimeline({ limit = 10, showTrends = true }: HealthTimelineProps) {
  const { user } = useAuth();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTimelineEvents();
    }
  }, [user]);

  const fetchTimelineEvents = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from("symptom_checks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (!error && data) {
      const timelineEvents: TimelineEvent[] = data.map(check => {
        const predictions = Array.isArray(check.predictions) ? check.predictions : [];
        const topPrediction = predictions[0] as any;
        const symptoms = Array.isArray(check.symptoms) 
          ? check.symptoms.map(s => typeof s === 'string' ? s : String(s))
          : [];
        
        return {
          id: check.id,
          date: check.created_at,
          type: "symptom_check" as const,
          title: topPrediction?.condition || "Symptom Check",
          description: check.ai_summary || undefined,
          urgencyLevel: check.urgency_level || undefined,
          confidence: topPrediction?.confidence,
          symptoms,
        };
      });
      
      setEvents(timelineEvents);
    }
    setIsLoading(false);
  };

  const groupEventsByDate = (events: TimelineEvent[]) => {
    const groups: { [key: string]: TimelineEvent[] } = {};
    
    events.forEach(event => {
      const date = parseISO(event.date);
      let groupKey: string;
      
      if (isToday(date)) {
        groupKey = "Today";
      } else if (isYesterday(date)) {
        groupKey = "Yesterday";
      } else if (isThisWeek(date)) {
        groupKey = "This Week";
      } else if (isThisMonth(date)) {
        groupKey = "This Month";
      } else {
        groupKey = format(date, "MMMM yyyy");
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(event);
    });
    
    return groups;
  };

  const getUrgencyTrend = () => {
    if (events.length < 2) return null;
    
    const recentUrgencies = events.slice(0, 5).map(e => {
      switch (e.urgencyLevel) {
        case "emergency": return 4;
        case "urgent": return 3;
        case "consult_soon": return 2;
        default: return 1;
      }
    });
    
    const avgRecent = recentUrgencies.reduce((a, b) => a + b, 0) / recentUrgencies.length;
    const olderUrgencies = events.slice(5).map(e => {
      switch (e.urgencyLevel) {
        case "emergency": return 4;
        case "urgent": return 3;
        case "consult_soon": return 2;
        default: return 1;
      }
    });
    
    if (olderUrgencies.length === 0) return null;
    
    const avgOlder = olderUrgencies.reduce((a, b) => a + b, 0) / olderUrgencies.length;
    
    if (avgRecent < avgOlder - 0.3) return "improving";
    if (avgRecent > avgOlder + 0.3) return "worsening";
    return "stable";
  };

  const groupedEvents = groupEventsByDate(events);
  const trend = showTrends ? getUrgencyTrend() : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse text-muted-foreground">Loading timeline...</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground">No health events yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Start a symptom check to build your health timeline
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trend Summary */}
      {trend && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-xl p-4 flex items-center gap-3",
            trend === "improving" && "bg-emerald-50 dark:bg-emerald-900/20",
            trend === "worsening" && "bg-amber-50 dark:bg-amber-900/20",
            trend === "stable" && "bg-muted/50"
          )}
        >
          {trend === "improving" && (
            <>
              <TrendingDown className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-700 dark:text-emerald-400">
                  Health Improving
                </p>
                <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
                  Your recent checks show lower urgency levels
                </p>
              </div>
            </>
          )}
          {trend === "worsening" && (
            <>
              <TrendingUp className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-700 dark:text-amber-400">
                  Monitor Closely
                </p>
                <p className="text-sm text-amber-600/80 dark:text-amber-400/80">
                  Recent checks show increased urgency — consider consulting a doctor
                </p>
              </div>
            </>
          )}
          {trend === "stable" && (
            <>
              <Minus className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Stable Pattern</p>
                <p className="text-sm text-muted-foreground">
                  Your health indicators remain consistent
                </p>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Timeline */}
      {Object.entries(groupedEvents).map(([groupLabel, groupEvents]) => (
        <div key={groupLabel}>
          <h4 className="text-sm font-medium text-muted-foreground mb-3 sticky top-0 bg-background py-1">
            {groupLabel}
          </h4>
          
          <div className="space-y-3">
            {groupEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-6 pb-4 border-l-2 border-border last:border-l-transparent"
              >
                {/* Timeline Dot */}
                <div className={cn(
                  "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-background",
                  event.urgencyLevel === "emergency" && "bg-red-500",
                  event.urgencyLevel === "urgent" && "bg-amber-500",
                  event.urgencyLevel === "consult_soon" && "bg-blue-500",
                  (!event.urgencyLevel || event.urgencyLevel === "self_care") && "bg-emerald-500"
                )} />

                {/* Event Card */}
                <div className="bg-card rounded-lg border p-4 ml-2 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(event.date), "h:mm a")}
                        </span>
                        {event.urgencyLevel && (
                          <UrgencyBadge level={event.urgencyLevel as any} />
                        )}
                      </div>
                      
                      <h5 className="font-medium">{event.title}</h5>
                      
                      {event.confidence && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {Math.round(event.confidence * 100)}% confidence
                        </p>
                      )}
                      
                      {event.symptoms && event.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {event.symptoms.slice(0, 3).map((symptom, i) => (
                            <span
                              key={i}
                              className="bg-muted text-xs px-2 py-0.5 rounded-full"
                            >
                              {typeof symptom === 'string' ? symptom.slice(0, 20) : 'Symptom'}
                            </span>
                          ))}
                          {event.symptoms.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{event.symptoms.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
