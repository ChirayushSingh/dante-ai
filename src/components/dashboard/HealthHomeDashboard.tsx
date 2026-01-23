import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  Heart,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { HealthScore } from "./HealthScore";
import { format, subDays, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";

interface HealthHomeProps {
  onStartCheck: () => void;
  onViewHistory: () => void;
  userName?: string;
}

export function HealthHomeDashboard({ onStartCheck, onViewHistory, userName }: HealthHomeProps) {
  const { user } = useAuth();
  const { profile, conditions, allergies, medications, getAge } = useHealthProfile();

  // Fetch recent symptom checks for trend analysis
  const { data: recentChecks } = useQuery({
    queryKey: ["recentChecks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("symptom_checks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch recent conversations for AI context
  const { data: recentConversations } = useQuery({
    queryKey: ["recentConversations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Calculate risk level based on recent checks
  const getRiskLevel = () => {
    if (!recentChecks?.length) return { level: "unknown", label: "No Data", color: "muted" };
    
    const latestCheck = recentChecks[0];
    const urgencyLevel = latestCheck.urgency_level;
    
    if (urgencyLevel === "emergency" || urgencyLevel === "urgent") {
      return { level: "high", label: "Elevated Risk", color: "destructive" };
    }
    if (urgencyLevel === "consult_soon") {
      return { level: "medium", label: "Monitor", color: "warning" };
    }
    return { level: "low", label: "Healthy", color: "success" };
  };

  // Calculate trend based on urgency levels
  const getTrend = () => {
    if (!recentChecks || recentChecks.length < 2) return null;
    
    const urgencyScore = (level: string) => {
      switch (level) {
        case "emergency": return 4;
        case "urgent": return 3;
        case "consult_soon": return 2;
        case "self_care": return 1;
        default: return 0;
      }
    };
    
    const recentAvg = recentChecks.slice(0, 3).reduce((sum, c) => sum + urgencyScore(c.urgency_level || ""), 0) / Math.min(3, recentChecks.length);
    const olderAvg = recentChecks.slice(3, 6).reduce((sum, c) => sum + urgencyScore(c.urgency_level || ""), 0) / Math.max(1, Math.min(3, recentChecks.length - 3));
    
    if (recentAvg < olderAvg) return { direction: "improving", label: "Improving", icon: TrendingDown };
    if (recentAvg > olderAvg) return { direction: "declining", label: "Needs Attention", icon: TrendingUp };
    return { direction: "stable", label: "Stable", icon: Activity };
  };

  // Get last symptoms
  const getLastSymptoms = () => {
    if (!recentChecks?.length) return [];
    const symptoms = recentChecks[0].symptoms;
    if (Array.isArray(symptoms)) {
      return symptoms.slice(0, 3).map((s: any) => typeof s === "string" ? s : JSON.stringify(s));
    }
    return [];
  };

  // Get alerts
  const getAlerts = () => {
    const alerts: { type: string; message: string; priority: "high" | "medium" | "low" }[] = [];
    
    if (recentChecks?.length) {
      const latest = recentChecks[0];
      if (latest.urgency_level === "urgent" || latest.urgency_level === "emergency") {
        alerts.push({
          type: "urgency",
          message: "Your last check indicated you should seek medical attention",
          priority: "high"
        });
      }
    }
    
    if (medications?.length && medications.length > 0) {
      alerts.push({
        type: "reminder",
        message: `You have ${medications.length} active medication(s) to track`,
        priority: "low"
      });
    }
    
    if (conditions?.length && conditions.length > 0) {
      alerts.push({
        type: "chronic",
        message: "Remember to monitor your chronic conditions",
        priority: "medium"
      });
    }
    
    return alerts;
  };

  // Get next recommended action
  const getNextAction = () => {
    if (!recentChecks?.length) {
      return { action: "Complete your first symptom check", type: "check" };
    }
    
    const lastCheck = new Date(recentChecks[0].created_at);
    const daysSinceCheck = Math.floor((Date.now() - lastCheck.getTime()) / (1000 * 60 * 60 * 24));
    
    if (recentChecks[0].urgency_level === "consult_soon" || recentChecks[0].urgency_level === "urgent") {
      return { action: "Schedule a doctor consultation", type: "consult" };
    }
    
    if (daysSinceCheck > 7) {
      return { action: "Check in on your health", type: "check" };
    }
    
    return { action: "Keep monitoring your symptoms", type: "monitor" };
  };

  const risk = getRiskLevel();
  const trend = getTrend();
  const alerts = getAlerts();
  const nextAction = getNextAction();
  const displayName = profile?.full_name?.split(" ")[0] || userName || "there";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Personalized Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Welcome back, {displayName}
          </h1>
          <p className="text-muted-foreground">
            Here's your health overview at a glance
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5">
          <Clock className="w-3 h-3" />
          {format(new Date(), "MMM d, yyyy")}
        </Badge>
      </motion.div>

      {/* Health Score + Risk Level Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <HealthScore recentChecks={recentChecks || []} profile={profile} conditions={conditions || []} />
        </motion.div>

        {/* Current Risk Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  risk.color === "destructive" && "bg-destructive/20",
                  risk.color === "warning" && "bg-warning/20",
                  risk.color === "success" && "bg-success/20",
                  risk.color === "muted" && "bg-muted"
                )}>
                  {risk.level === "high" && <AlertTriangle className="w-6 h-6 text-destructive" />}
                  {risk.level === "medium" && <Activity className="w-6 h-6 text-warning" />}
                  {risk.level === "low" && <Heart className="w-6 h-6 text-success" />}
                  {risk.level === "unknown" && <User className="w-6 h-6 text-muted-foreground" />}
                </div>
                <div>
                  <p className="font-semibold">{risk.label}</p>
                  {trend && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <trend.icon className="w-3 h-3" />
                      {trend.label}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Recommended Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium mb-3">{nextAction.action}</p>
              <Button onClick={onStartCheck} size="sm" className="w-full gap-2">
                Start Health Check
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Last Symptoms + Alerts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Last Symptoms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Last Reported Symptoms</CardTitle>
                {recentChecks?.length ? (
                  <Badge variant="secondary" className="text-xs">
                    {format(new Date(recentChecks[0].created_at), "MMM d")}
                  </Badge>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              {getLastSymptoms().length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {getLastSymptoms().map((symptom, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {symptom.slice(0, 50)}...
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No symptoms recorded yet</p>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3 w-full text-muted-foreground hover:text-foreground"
                onClick={onViewHistory}
              >
                View Full History
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Alerts & Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-2">
                  {alerts.slice(0, 3).map((alert, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "p-2 rounded-lg text-sm flex items-start gap-2",
                        alert.priority === "high" && "bg-destructive/10 text-destructive",
                        alert.priority === "medium" && "bg-warning/10 text-warning-foreground",
                        alert.priority === "low" && "bg-muted text-muted-foreground"
                      )}
                    >
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                        alert.priority === "high" && "bg-destructive",
                        alert.priority === "medium" && "bg-warning",
                        alert.priority === "low" && "bg-muted-foreground"
                      )} />
                      <span>{alert.message}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-success" />
                  All clear! No alerts at this time.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Profile Summary */}
      {(conditions?.length || allergies?.length || medications?.length) ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-4 text-sm">
                {getAge() && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{getAge()} years old</span>
                  </div>
                )}
                {conditions?.length ? (
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <span>{conditions.length} chronic condition(s)</span>
                  </div>
                ) : null}
                {allergies?.length ? (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                    <span>{allergies.length} known allergy(s)</span>
                  </div>
                ) : null}
                {medications?.length ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{medications.length} medication(s)</span>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
