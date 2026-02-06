import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Activity, Users, TrendingUp, Calendar, BarChart3, PieChart,
  AlertTriangle, CheckCircle, Clock, AlertOctagon, Loader2,
  DollarSign, MapPin, Stethoscope
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RechartsPie, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { useProfile } from "@/hooks/useProfile";
import { HealthTimeline } from "@/components/dashboard/HealthTimeline";

const URGENCY_COLORS = {
  self_care: "#10b981",
  consult_soon: "#f59e0b",
  urgent: "#f97316",
  emergency: "#ef4444",
};

const CHART_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function Analytics() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const isDoctor = profile?.role === 'doctor' || profile?.role === 'clinic_admin';

  // 1. Fetch Personal Symptom Checks
  const { data: symptomChecks, isLoading: checksLoading } = useQuery({
    queryKey: ["userSymptomChecks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("symptom_checks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // 2. Fetch Clinic Data if Doctor
  const { data: clinicStats, isLoading: clinicLoading } = useQuery({
    queryKey: ["clinicStats", user?.id],
    queryFn: async () => {
      if (!user || !isDoctor) return null;

      const { data: doc } = await supabase.from("doctors").select("clinic_id").eq("user_id", user.id).single();
      if (!doc) return null;

      const [appointments, invoices] = await Promise.all([
        supabase.from("appointments").select("*").eq("clinic_id", doc.clinic_id),
        supabase.from("invoices").select("*").eq("clinic_id", doc.clinic_id)
      ]);

      return {
        appointments: appointments.data || [],
        invoices: invoices.data || [],
        totalRevenue: invoices.data?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0,
        patientCount: new Set(appointments.data?.map(a => a.patient_id)).size
      };
    },
    enabled: !!user && isDoctor,
  });

  if (checksLoading || (isDoctor && clinicLoading)) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Personal Data Processing
  const personalStats = {
    totalChecks: symptomChecks?.length || 0,
    urgencyDistribution: symptomChecks?.reduce((acc, check) => {
      if (check.urgency_level) acc[check.urgency_level] = (acc[check.urgency_level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
  };

  const checksOverTime = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    const count = symptomChecks?.filter(check =>
      format(new Date(check.created_at), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    ).length || 0;
    return { date: format(date, "MMM d"), checks: count };
  });

  // Clinic Data Processing
  const revenueOverTime = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const amount = clinicStats?.invoices?.filter(inv =>
      format(new Date(inv.created_at), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    ).reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
    return { date: format(date, "MMM d"), amount };
  });

  const appointmentsByStatus = clinicStats?.appointments?.reduce((acc: any, app: any) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(appointmentsByStatus || {}).map(([name, value]) => ({ name, value }));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 py-4">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">Health Insights</h1>
          <p className="text-muted-foreground italic">Advanced analytics and trends for {isDoctor ? "your clinic" : "your health"}.</p>
        </div>

        <Tabs defaultValue={isDoctor ? "clinic" : "personal"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
            <TabsTrigger value="personal" className="gap-2"><Activity className="h-4 w-4" /> Personal Health</TabsTrigger>
            {isDoctor && <TabsTrigger value="clinic" className="gap-2"><Building2 className="h-4 w-4" /> Clinic Performance</TabsTrigger>}
          </TabsList>

          <TabsContent value="personal" className="space-y-8">
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="rounded-3xl border-none shadow-sm bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Activity className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Total Checks</p>
                      <p className="text-2xl font-bold">{personalStats.totalChecks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Add more tiny stats cards if needed */}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Symptom Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={checksOverTime}>
                        <defs>
                          <linearGradient id="colorChecks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="checks" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorChecks)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">Urgency Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <HealthTimeline limit={5} showTrends={false} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {isDoctor && (
            <TabsContent value="clinic" className="space-y-8">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-3xl border-none shadow-sm bg-emerald-50 text-emerald-900">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <DollarSign className="h-8 w-8" />
                      <div>
                        <p className="text-xs font-bold uppercase opacity-60">Total Revenue</p>
                        <p className="text-2xl font-bold">${clinicStats?.totalRevenue}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-none shadow-sm bg-blue-50 text-blue-900">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Users className="h-8 w-8" />
                      <div>
                        <p className="text-xs font-bold uppercase opacity-60">Total Patients</p>
                        <p className="text-2xl font-bold">{clinicStats?.patientCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-none shadow-sm bg-purple-50 text-purple-900">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-8 w-8" />
                      <div>
                        <p className="text-xs font-bold uppercase opacity-60">Total Visits</p>
                        <p className="text-2xl font-bold">{clinicStats?.appointments?.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="rounded-3xl border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Stream (7 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueOverTime}>
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Visit Status Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie
                            data={statusData}
                            cx="50%" cy="50%"
                            innerRadius={60} outerRadius={80}
                            paddingAngle={5} dataKey="value"
                          >
                            {statusData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
