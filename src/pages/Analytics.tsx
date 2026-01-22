import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Activity, Users, TrendingUp, Calendar, BarChart3, PieChart,
  AlertTriangle, CheckCircle, Clock, AlertOctagon, Loader2
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RechartsPie, Pie, Cell, Legend
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { UrgencyBadge } from "@/components/dashboard/UrgencyBadge";
import { HealthTimeline } from "@/components/dashboard/HealthTimeline";

const URGENCY_COLORS = {
  self_care: "#10b981",
  consult_soon: "#f59e0b",
  urgent: "#f97316",
  emergency: "#ef4444",
};

export default function Analytics() {
  const { user } = useAuth();

  // Fetch user's symptom checks for personal analytics
  const { data: symptomChecks, isLoading: checksLoading } = useQuery({
    queryKey: ["userSymptomChecks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("symptom_checks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Calculate personal stats
  const personalStats = {
    totalChecks: symptomChecks?.length || 0,
    urgencyDistribution: symptomChecks?.reduce((acc, check) => {
      if (check.urgency_level) {
        acc[check.urgency_level] = (acc[check.urgency_level] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) || {},
    checksThisMonth: symptomChecks?.filter(check => {
      const checkDate = new Date(check.created_at);
      const monthAgo = subDays(new Date(), 30);
      return checkDate >= monthAgo;
    }).length || 0,
  };

  // Generate chart data for checks over time
  const checksOverTime = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    const dayStart = startOfDay(date);
    const count = symptomChecks?.filter(check => {
      const checkDate = new Date(check.created_at);
      return format(checkDate, "yyyy-MM-dd") === format(dayStart, "yyyy-MM-dd");
    }).length || 0;
    return {
      date: format(date, "MMM d"),
      checks: count,
    };
  });

  // Urgency distribution for pie chart
  const urgencyData = Object.entries(personalStats.urgencyDistribution).map(([level, count]) => ({
    name: level.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()),
    value: count,
    level: level as keyof typeof URGENCY_COLORS,
  }));

  // Extract common symptoms from predictions
  const commonSymptoms = symptomChecks?.reduce((acc, check) => {
    const predictions = check.predictions as Array<{ condition: string }> || [];
    predictions.forEach(p => {
      acc[p.condition] = (acc[p.condition] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>) || {};

  const topConditions = Object.entries(commonSymptoms)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  if (checksLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Health Analytics</h1>
          <p className="text-muted-foreground">
            Track your symptom history and health trends
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Checks</p>
                    <p className="text-2xl font-bold">{personalStats.totalChecks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Self-Care</p>
                    <p className="text-2xl font-bold">
                      {personalStats.urgencyDistribution.self_care || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Consult Soon</p>
                    <p className="text-2xl font-bold">
                      {personalStats.urgencyDistribution.consult_soon || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-orange-500/10">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Urgent/Emergency</p>
                    <p className="text-2xl font-bold">
                      {(personalStats.urgencyDistribution.urgent || 0) + 
                       (personalStats.urgencyDistribution.emergency || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Checks Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Symptom Checks Over Time
                </CardTitle>
                <CardDescription>Your activity in the last 14 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={checksOverTime}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis allowDecimals={false} className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="checks"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Urgency Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Urgency Distribution
                </CardTitle>
                <CardDescription>Breakdown of assessment urgency levels</CardDescription>
              </CardHeader>
              <CardContent>
                {urgencyData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={urgencyData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {urgencyData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={URGENCY_COLORS[entry.level]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No data yet. Complete some symptom checks to see analytics.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Most Common Conditions Identified
              </CardTitle>
              <CardDescription>Based on your symptom check history</CardDescription>
            </CardHeader>
            <CardContent>
              {topConditions.length > 0 ? (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topConditions} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis dataKey="name" type="category" width={150} className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  No conditions identified yet. Start a symptom check to begin tracking.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Health Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Health Timeline
              </CardTitle>
              <CardDescription>
                Visual history of your health events and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HealthTimeline limit={15} showTrends={true} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}