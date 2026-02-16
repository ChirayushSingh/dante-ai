import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  User,
  FileText,
  MessageSquare,
  Plus,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Download,
  Loader2,
  Brain,
  Pill,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { AiNotesSummary } from '../tools/AiNotesSummary';
import { PrescriptionGenerator } from '../tools/PrescriptionGenerator';
import { DoctorMessaging } from './DoctorMessaging';
import { AiDiagnosisAssistant } from '../tools/AiDiagnosisAssistant';
import { AILiveScribe } from './AILiveScribe';
import { WarRoom } from './WarRoom';
import { PredictiveTriage } from './PredictiveTriage';
import { toast } from 'sonner';

export function DoctorPortal() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientChecks, setPatientChecks] = useState<any[]>([]);
  const [fetchingChecks, setFetchingChecks] = useState(false);
  const [showTool, setShowTool] = useState<'prescription' | 'summary' | 'chat' | 'diagnosis' | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // ... existing doc fetching ...
        // 1. Get Doctor Info
        const { data: doc, error: docError } = await (supabase
          .from('doctors' as any) as any)
          .select('*, clinics(*)')
          .eq('user_id', user.id)
          .maybeSingle();

        if (docError) {
          console.error("Doctor fetch error:", docError);
          setLoading(false);
          return;
        }

        if (!doc) {
          setLoading(false);
          return;
        }
        setDoctorInfo(doc);

        // 2. Get Appointments
        const { data: apps, error: appsError } = await (supabase
          .from('appointments' as any) as any)
          .select('*, profiles:patient_id(*)')
          .eq('doctor_id', doc.id)
          .order('scheduled_at', { ascending: true });

        if (appsError) throw appsError;
        setAppointments(apps);

        // 3. Get Prescriptions
        const { data: pres, error: presError } = await (supabase
          .from('prescriptions' as any) as any)
          .select('*, profiles:patient_id(*)')
          .eq('doctor_id', doc.id)
          .order('issued_at', { ascending: false });

        if (presError) throw presError;
        setPrescriptions(pres);

        // 4. Extract unique patients
        const patientMap = new Map();
        apps.forEach((a: any) => {
          if (a.profiles) {
            patientMap.set(a.profiles.id, a.profiles);
          }
        });
        setPatients(Array.from(patientMap.values()));

      } catch (error: any) {
        console.error("Error fetching doctor portal data:", error);
        toast.error("Failed to load portal data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (selectedPatient) {
      const fetchPatientHistory = async () => {
        setFetchingChecks(true);
        try {
          const { data, error } = await supabase
            .from('symptom_checks')
            .select('*')
            .eq('user_id', selectedPatient.id)
            .order('created_at', { ascending: false })
            .limit(5);

          if (!error) setPatientChecks(data || []);
        } catch (err) {
          console.error("Error fetching patient checks:", err);
        } finally {
          setFetchingChecks(false);
        }
      };
      fetchPatientHistory();
    }
  }, [selectedPatient]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!doctorInfo && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="text-lg font-bold">Doctor Profile Not Found</h3>
        <p className="text-muted-foreground max-w-xs">It seems your doctor profile isn't fully set up yet. Please complete onboarding.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your clinical dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Doctor Portal</h1>
          <p className="text-gray-600 mt-1">
            {doctorInfo?.clinics?.name || "Private Practice"} | {doctorInfo?.specialization}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTool('diagnosis')} className="gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" /> AI Assistant
          </Button>
          <Button variant="outline" onClick={() => setShowTool('summary')} className="gap-2">
            <Brain className="h-4 w-4" /> AI Summary
          </Button>
          <Button onClick={() => setShowTool('prescription')} className="gap-2">
            <Plus className="h-4 w-4" /> New Prescription
          </Button>
        </div>
      </div>

      {showTool === 'summary' && (
        <AiNotesSummary />
      )}

      {showTool === 'prescription' && selectedPatient && (
        <PrescriptionGenerator
          patientId={selectedPatient.user_id}
          patientName={selectedPatient.full_name}
          doctorId={doctorInfo.id}
          onSuccess={() => setShowTool(null)}
        />
      )}

      {showTool === 'chat' && selectedPatient && (
        <DoctorMessaging
          patientId={selectedPatient.user_id}
          patientName={selectedPatient.full_name}
          onClose={() => setShowTool(null)}
        />
      )}

      {showTool === 'diagnosis' && (
        <div className="max-w-2xl mx-auto">
          <AiDiagnosisAssistant />
          <Button variant="ghost" className="w-full mt-4" onClick={() => setShowTool(null)}>Close Assistant</Button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">{patients.length}</p>
              <p className="text-gray-600 text-sm">Total Patients</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">
                {appointments.filter((a) => a.status === 'scheduled').length}
              </p>
              <p className="text-gray-600 text-sm">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600">
                {appointments.filter((a) => a.status === 'completed').length}
              </p>
              <p className="text-gray-600 text-sm">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-600">{prescriptions.length}</p>
              <p className="text-gray-600 text-sm">Issued Prescriptions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="intelligence" className="font-bold text-primary">
          <Sparkles className="w-4 h-4 mr-2" />
          Clinical Intelligence
        </TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="patients">Patient List</TabsTrigger>
        <TabsTrigger value="prescriptions">History</TabsTrigger>
      </TabsList>

      <TabsContent value="intelligence" className="space-y-8 focus-visible:outline-none">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <AILiveScribe />
          </div>
          <div className="space-y-6">
            <PredictiveTriage />
          </div>
        </div>
        <div className="w-full">
          <WarRoom />
        </div>
      </TabsContent>

      <TabsContent value="appointments" className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-center p-10 text-muted-foreground bg-slate-50 rounded-2xl">No appointments scheduled.</p>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id} onClick={() => setSelectedPatient(appointment.profiles)} className="cursor-pointer hover:border-primary transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{appointment.profiles?.full_name || "Unknown Patient"}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                        <p className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> {new Date(appointment.scheduled_at).toLocaleDateString()}
                        </p>
                        <p className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {new Date(appointment.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value="patients" className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {patients.map((patient) => (
            <Card
              key={patient.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedPatient(patient)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                      {patient.avatar_url ? <img src={patient.avatar_url} alt="" className="w-full h-full rounded-full" /> : <User />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{patient.full_name}</h3>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600 mt-1">
                        <p>📧 {patient.email}</p>
                        <p>📱 {patient.phone || "N/A"}</p>
                        <p>🩸 Blood: {patient.blood_type || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="prescriptions" className="space-y-4">
        {prescriptions.map((prescription) => (
          <Card key={prescription.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <FileText className="h-5 w-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{prescription.profiles?.full_name}</h3>
                    <div className="mt-2 space-y-2">
                      {Array.isArray(prescription.medications) && prescription.medications.map((m: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm bg-primary/5 p-2 rounded-lg">
                          <Pill className="h-3 w-3 text-primary" />
                          <span className="font-medium">{m.name}</span>
                          <span className="text-muted-foreground">{m.dosage} - {m.frequency} ({m.duration})</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Issued on: {new Date(prescription.issued_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>

      {/* Patient Details Sidebar/Card */ }
  {
    selectedPatient && (
      <Card className="border-l-4 border-l-primary shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Focus: {selectedPatient.full_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button className="flex-1 gap-2" onClick={() => setShowTool('prescription')}>
              <Pill className="h-4 w-4" /> Prescribe
            </Button>
            <Button variant="outline" className="flex-1 gap-2" onClick={() => setShowTool('chat')}>
              <MessageSquare className="h-4 w-4" /> Chat
            </Button>
            <Button variant="outline" className="flex-1 gap-2" onClick={() => setShowTool('summary')}>
              <Brain className="h-4 w-4" /> AI Note
            </Button>
          </div>
          <div className="space-y-2 text-sm border-t pt-4">
            <p><span className="font-semibold">Email:</span> {selectedPatient.email}</p>
            <p><span className="font-semibold">Gender:</span> {selectedPatient.gender || "Unspecified"}</p>
            <p><span className="font-semibold">Blood Type:</span> {selectedPatient.blood_type || "Unknown"}</p>
          </div>

          {patientChecks.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Symptom Checks</h4>
              <div className="space-y-2">
                {patientChecks.map((check: any) => (
                  <div key={check.id} className="p-2 rounded-lg bg-orange-50 border border-orange-100 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-orange-900">{check.symptoms?.[0] || "Checkup"}</span>
                      <span className="text-[10px] opacity-70">{new Date(check.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-orange-800 line-clamp-2">{check.recommendation || "Observation required."}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
    </div >
  );
}
