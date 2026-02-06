import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Clock,
    User,
    MapPin,
    ChevronRight,
    Loader2,
    CheckCircle2,
    Stethoscope
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, addDays, setHours, setMinutes, isBefore, startOfToday } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function BookAppointment() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [clinics, setClinics] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [selectedClinic, setSelectedClinic] = useState<any>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        fetchClinics();
    }, []);

    const fetchClinics = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("clinics").select("*");
        if (!error) setClinics(data);
        setLoading(false);
    };

    const fetchDoctors = async (clinicId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from("doctors")
            .select("*, profiles(*)")
            .eq("clinic_id", clinicId);
        if (!error) setDoctors(data);
        setLoading(false);
    };

    const handleClinicSelect = (clinic: any) => {
        setSelectedClinic(clinic);
        setSelectedDoctor(null);
        setSelectedDate(undefined);
        setSelectedTime(null);
        fetchDoctors(clinic.id);
    };

    const handleDoctorSelect = (doctor: any) => {
        setSelectedDoctor(doctor);
        setSelectedDate(undefined);
        setSelectedTime(null);
    };

    const generateTimeSlots = () => {
        const slots = [];
        let start = setHours(setMinutes(new Date(), 0), 9); // 9 AM
        for (let i = 0; i < 16; i++) { // Until 5 PM
            const slotTime = format(start, "HH:mm");
            slots.push(slotTime);
            start = addMinutes(start, 30);
        }
        return slots;
    };

    const addMinutes = (date: Date, minutes: number) => {
        return new Date(date.getTime() + minutes * 60000);
    };

    const handleBook = async () => {
        if (!user || !selectedDoctor || !selectedDate || !selectedTime) {
            toast.error("Please select all details");
            return;
        }

        setBooking(true);
        try {
            const [hours, minutes] = selectedTime.split(":").map(Number);
            const scheduledAt = setMinutes(setHours(selectedDate, hours), minutes);

            const { error } = await supabase.from("appointments").insert({
                patient_id: user.id,
                doctor_id: selectedDoctor.id,
                clinic_id: selectedClinic.id,
                scheduled_at: scheduledAt.toISOString(),
                status: "scheduled",
            });

            if (error) throw error;

            toast.success("Appointment booked successfully!");
            navigate("/dashboard/history");
        } catch (error: any) {
            toast.error(error.message || "Failed to book appointment");
        } finally {
            setBooking(false);
        }
    };

    if (loading && clinics.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold">Book an Appointment</h1>
                    <p className="text-muted-foreground mt-2">Find the right care at your preferred time.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Step 1: Select Clinic */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm">1</span>
                            Select Clinic
                        </h2>
                        <div className="space-y-3">
                            {clinics.map((clinic) => (
                                <Card
                                    key={clinic.id}
                                    className={`cursor-pointer transition-all hover:border-primary ${selectedClinic?.id === clinic.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-100'}`}
                                    onClick={() => handleClinicSelect(clinic)}
                                >
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="p-2 bg-slate-100 rounded-xl"><MapPin className="h-5 w-5 text-slate-500" /></div>
                                        <div>
                                            <p className="font-bold">{clinic.name}</p>
                                            <p className="text-xs text-muted-foreground">{clinic.address}</p>
                                        </div>
                                        {selectedClinic?.id === clinic.id && <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Select Doctor & Date */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm">2</span>
                            Doctor & Date
                        </h2>

                        {selectedClinic ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <div className="space-y-3">
                                    <Label>Available Doctors</Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {doctors.map((doc) => (
                                            <button
                                                key={doc.id}
                                                onClick={() => handleDoctorSelect(doc)}
                                                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${selectedDoctor?.id === doc.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold">
                                                    {doc.profiles?.full_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">Dr. {doc.profiles?.full_name}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold text-primary/70">{doc.specialization}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedDoctor && (
                                    <div className="space-y-3 animate-in fade-in">
                                        <Label>Select Date</Label>
                                        <CalendarComponent
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            disabled={(date) => isBefore(date, startOfToday())}
                                            className="rounded-2xl border border-slate-100"
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <p className="text-sm text-muted-foreground">Select a clinic first</p>
                            </div>
                        )}
                    </div>

                    {/* Step 3: Select Time & Confirm */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm">3</span>
                            Time slot
                        </h2>

                        {selectedDate ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <div className="grid grid-cols-3 gap-2">
                                    {generateTimeSlots().map((time) => (
                                        <Button
                                            key={time}
                                            variant={selectedTime === time ? "default" : "outline"}
                                            className={`h-11 rounded-xl text-xs font-bold ${selectedTime === time ? 'shadow-lg shadow-primary/20' : 'border-slate-100 hover:border-primary'}`}
                                            onClick={() => setSelectedTime(time)}
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                </div>

                                <Card className="bg-slate-900 text-white rounded-3xl border-none shadow-2xl p-6 mt-8">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold border-b border-white/10 pb-4">Booking Summary</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-white/70">
                                                <MapPin className="h-4 w-4" /> {selectedClinic.name}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-white/70">
                                                <User className="h-4 w-4" /> Dr. {selectedDoctor.profiles?.full_name}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-white/70">
                                                <Calendar className="h-4 w-4" /> {format(selectedDate, "MMMM dd, yyyy")}
                                            </div>
                                            {selectedTime && (
                                                <div className="flex items-center gap-3 text-sm text-white/70">
                                                    <Clock className="h-4 w-4" /> {selectedTime}
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            className="w-full h-12 mt-4 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-bold"
                                            disabled={!selectedTime || booking}
                                            onClick={handleBook}
                                        >
                                            {booking ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm & Pay"}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <p className="text-sm text-muted-foreground">Select a doctor and date first</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
