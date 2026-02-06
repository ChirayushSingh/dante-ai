import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Phone, Mail, MapPin, BadgeCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ClinicOnboarding = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        specialization: "",
        license_number: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);

        try {
            // 1. Create Clinic
            const { data: clinic, error: clinicError } = await supabase
                .from("clinics")
                .insert({
                    name: formData.name,
                    address: formData.address,
                    phone: formData.phone,
                    email: formData.email,
                })
                .select()
                .single();

            if (clinicError) throw clinicError;

            // 2. Create/Update Doctor record
            const { error: doctorError } = await supabase
                .from("doctors")
                .insert({
                    user_id: user.id,
                    clinic_id: clinic.id,
                    specialization: formData.specialization,
                    license_number: formData.license_number,
                });

            if (doctorError) throw doctorError;

            // 3. Update profile role to clinic_admin/doctor if not already set correctly
            // (The trigger should have handled the initial role, but we might want to refine it)

            toast.success("Clinic onboarding completed!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to complete onboarding");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-4">
                        <Building2 className="h-8 w-8" />
                    </div>
                    <h1 className="font-display text-4xl font-bold text-slate-900 mb-4">
                        Clinic Onboarding
                    </h1>
                    <p className="text-lg text-slate-600">
                        Let's set up your medical facility profile to start managing patients and appointments.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-10 border border-slate-100"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
                                <Building2 className="h-5 w-5 text-primary" />
                                Clinic Information
                            </h2>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="clinicName">Clinic Name</Label>
                                    <Input
                                        id="clinicName"
                                        placeholder="e.g. City Health Care"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Textarea
                                            id="address"
                                            placeholder="Full clinic address"
                                            className="pl-10 min-h-[100px]"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+1 (555) 000-0000"
                                                className="pl-10"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Clinic Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="contact@clinic.com"
                                                className="pl-10"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
                                <BadgeCheck className="h-5 w-5 text-primary" />
                                Professional Details
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="specialization">Primary Specialization</Label>
                                    <Input
                                        id="specialization"
                                        placeholder="e.g. General Medicine"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="license">Medical License Number</Label>
                                    <Input
                                        id="license"
                                        placeholder="XYZ123456789"
                                        value={formData.license_number}
                                        onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-12 text-lg font-medium rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Saving Details...
                                </>
                            ) : (
                                "Complete Onboarding"
                            )}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ClinicOnboarding;
