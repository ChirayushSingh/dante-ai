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
  AlertTriangle,
  Pill,
  Stethoscope,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UrgencyBadge } from "@/components/dashboard/UrgencyBadge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCheck, setSelectedCheck] = useState<SymptomCheck | null>(null);

  useEffect(() => {
    if (user) {
      fetchAllHistory();
    }
  }, [user]);

  const fetchAllHistory = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // 1. Fetch Symptom Checks
      const { data: checks, error: checksError } = await supabase
        .from("symptom_checks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (checksError) throw checksError;
      setHistoryData(checks.map(item => ({
        ...item,
        symptoms: Array.isArray(item.symptoms) ? item.symptoms : [],
        predictions: Array.isArray(item.predictions) ? item.predictions : [],
      })));

      // 2. Fetch Appointments
      const { data: apps, error: appsError } = await supabase
        .from("appointments")
        .select("*, doctors(profiles(full_name)), clinics(name)")
        .eq("patient_id", user.id)
        .order("scheduled_at", { ascending: false });

      if (appsError) throw appsError;
      setAppointments(apps);

      // 3. Fetch Prescriptions
      const { data: pres, error: presError } = await supabase
        .from("prescriptions")
        .select("*, doctors(profiles(full_name))")
        .eq("patient_id", user.id)
        .order("issued_at", { ascending: false });

      if (presError) throw presError;
      setPrescriptions(pres);

    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setIsLoading(false);
    }
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
      case "emergency": return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "urgent": return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "consult_soon": return <Clock className="h-4 w-4 text-info" />;
      default: return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">Medical Records</h1>
            <p className="text-muted-foreground italic">Your complete health history in one place.</p>
          </div>
          <Button variant="outline" className="gap-2 shadow-sm">
            <Download className="h-4 w-4" /> Export Health Record
          </Button>
        </div>

        <Tabs defaultValue="checks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
            <TabsTrigger value="checks" className="gap-2"><Stethoscope className="h-4 w-4" /> AI Checks</TabsTrigger>
            <TabsTrigger value="appointments" className="gap-2"><Calendar className="h-4 w-4" /> Visits</TabsTrigger>
            <TabsTrigger value="prescriptions" className="gap-2"><Pill className="h-4 w-4" /> Prescriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="checks" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search past checks..."
                className="pl-10 h-11 rounded-2xl border-primary/5 focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : filteredHistory.length === 0 ? (
                <p className="text-center py-20 text-muted-foreground italic">No symptom checks found.</p>
              ) : (
                filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setSelectedCheck(selectedCheck?.id === item.id ? null : item)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-slate-500">
                            {format(new Date(item.created_at), "MMM dd, yyyy")}
                          </span>
                          {item.urgency_level && <UrgencyBadge level={item.urgency_level as any} />}
                        </div>
                        <h3 className="font-bold text-xl text-slate-800 mb-2">
                          {item.predictions?.[0]?.condition || "Symptom Check"}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2">{item.ai_summary}</p>
                      </div>
                      <ChevronRight className={`h-6 w-6 text-slate-300 transition-transform ${selectedCheck?.id === item.id ? 'rotate-90' : ''}`} />
                    </div>
                    {selectedCheck?.id === item.id && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 pt-6 border-t border-slate-50 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Symptoms Reported</p>
                            <div className="flex flex-wrap gap-2">
                              {item.symptoms.map((s, i) => <Badge key={i} variant="secondary" className="bg-white">{s}</Badge>)}
                            </div>
                          </div>
                          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <p className="text-xs font-bold text-primary/60 uppercase tracking-wider mb-2">AI Assessment</p>
                            <p className="text-sm text-slate-700 leading-relaxed">{item.urgency_explanation}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            {appointments.map((app) => (
              <Card key={app.id} className="rounded-3xl border-slate-100 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="p-3 bg-blue-50 rounded-2xl"><Calendar className="h-6 w-6 text-blue-600" /></div>
                      <div>
                        <h3 className="font-bold text-lg">{app.clinics?.name || "Private Clinic"}</h3>
                        <p className="text-sm text-slate-500">Doctor: {app.doctors?.profiles?.full_name}</p>
                        <div className="flex gap-4 mt-3 text-sm text-slate-400">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(new Date(app.scheduled_at), "MMM dd, yyyy")}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(app.scheduled_at), "HH:mm")}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-full px-4">{app.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {appointments.length === 0 && !isLoading && <p className="text-center py-20 text-muted-foreground italic">No visits found.</p>}
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            {prescriptions.map((pres) => (
              <Card key={pres.id} className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-emerald-50 px-6 py-2 border-b border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Prescription Issued</span>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">Dr. {pres.doctors?.profiles?.full_name}</h3>
                        <p className="text-xs text-slate-400">{format(new Date(pres.issued_at), "MMMM dd, yyyy")}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-emerald-600 gap-1"><Download className="h-4 w-4" /> PDF</Button>
                    </div>
                    <div className="space-y-2">
                      {Array.isArray(pres.medications) && pres.medications.map((m: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <Pill className="h-4 w-4 text-emerald-500" />
                            <div>
                              <p className="font-bold text-slate-700">{m.name}</p>
                              <p className="text-xs text-slate-400">{m.dosage}</p>
                            </div>
                          </div>
                          <p className="text-xs font-medium text-slate-500">{m.frequency}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {prescriptions.length === 0 && !isLoading && <p className="text-center py-20 text-muted-foreground italic">No prescriptions found.</p>}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default History;
