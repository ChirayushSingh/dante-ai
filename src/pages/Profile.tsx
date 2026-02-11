import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User, Heart, Pill, AlertTriangle, Plus, X, Save, Loader2,
  Building2, Stethoscope, MapPin, Phone, Mail, Award, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export default function Profile() {
  const {
    profile,
    conditions,
    allergies,
    medications,
    isLoading,
    updateProfile,
    addCondition,
    deleteCondition,
    addAllergy,
    deleteAllergy,
    addMedication,
    deleteMedication,
    getAge,
  } = useHealthProfile();

  const [newCondition, setNewCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");

  // Profile form state
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    blood_type: "",
    // Doctor specific
    specialization: "",
    license_number: "",
    // Clinic specific
    clinic_name: "",
    clinic_address: "",
    clinic_phone: "",
    clinic_email: "",
  });

  const [isProfessionalLoading, setIsProfessionalLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        full_name: profile.full_name || "",
        date_of_birth: profile.date_of_birth || "",
        gender: profile.gender || "",
        height_cm: profile.height_cm?.toString() || "",
        weight_kg: profile.weight_kg?.toString() || "",
        blood_type: profile.blood_type || "",
      }));

      if (profile.role === 'doctor' || profile.role === 'clinic_admin') {
        fetchProfessionalData();
      }
    }
  }, [profile]);

  const fetchProfessionalData = async () => {
    if (!profile) return;
    setIsProfessionalLoading(true);
    try {
      if (profile.role === 'doctor') {
        const { data, error } = await supabase
          .from('doctors')
          .select('*, clinics(*)')
          .eq('user_id', profile.user_id)
          .maybeSingle();

        if (data) {
          setFormData(prev => ({
            ...prev,
            specialization: data.specialization || "",
            license_number: data.license_number || "",
            clinic_name: data.clinics?.name || "",
          }));
        }
      } else if (profile.role === 'clinic_admin') {
        // Find the clinic this user manages (assuming first one found for now or through bridge)
        const { data: docData } = await supabase
          .from('doctors')
          .select('clinic_id')
          .eq('user_id', profile.user_id)
          .maybeSingle();

        if (docData?.clinic_id) {
          const { data: clinic } = await supabase
            .from('clinics')
            .select('*')
            .eq('id', docData.clinic_id)
            .maybeSingle();

          if (clinic) {
            setFormData(prev => ({
              ...prev,
              clinic_name: clinic.name || "",
              clinic_address: clinic.address || "",
              clinic_phone: clinic.phone || "",
              clinic_email: clinic.email || "",
            }));
          }
        }
      }
    } catch (err) {
      console.error("Error fetching pro data:", err);
    } finally {
      setIsProfessionalLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // 1. Update basic profile
      await updateProfile.mutateAsync({
        full_name: formData.full_name || null,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        blood_type: formData.blood_type || null,
      });

      // 2. Update professional data if applicable
      if (profile?.role === 'doctor') {
        await supabase
          .from('doctors')
          .update({
            specialization: formData.specialization,
            license_number: formData.license_number,
          })
          .eq('user_id', profile.user_id);
      } else if (profile?.role === 'clinic_admin') {
        // Need clinic ID
        const { data: docData } = await supabase
          .from('doctors')
          .select('clinic_id')
          .eq('user_id', profile?.user_id)
          .maybeSingle();

        if (docData?.clinic_id) {
          await supabase
            .from('clinics')
            .update({
              name: formData.clinic_name,
              address: formData.clinic_address,
              phone: formData.clinic_phone,
              email: formData.clinic_email,
            })
            .eq('id', docData.clinic_id);
        }
      }
      toast.success("All profile details saved successfully");
    } catch (err: any) {
      toast.error("Failed to save some details: " + err.message);
    }
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      addCondition.mutate({ condition_name: newCondition.trim() });
      setNewCondition("");
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      addAllergy.mutate({ allergen: newAllergy.trim() });
      setNewAllergy("");
    }
  };

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      addMedication.mutate({ medication_name: newMedication.trim() });
      setNewMedication("");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const age = getAge();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {profile?.role === 'patient' ? "Health Profile" :
                profile?.role === 'doctor' ? "Medical Practitioner Profile" : "Clinic Management Profile"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {profile?.role === 'patient' ? "Manage your health identity and history" : "Update your professional and facility information"}
            </p>
          </div>
          <Badge className="mb-2 px-4 py-1.5 text-sm font-medium capitalize" variant="secondary">
            {profile?.role?.replace('_', ' ')} Account
          </Badge>
        </div>

        <div className="grid gap-8 md:grid-cols-12">
          {/* Main Form Area */}
          <div className="md:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <User className="w-6 h-6 text-primary" />
                    General Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        className="bg-muted/50 border-none h-11"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Your full legal name"
                      />
                    </div>
                    {profile?.role === 'patient' && (
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          type="date"
                          className="bg-muted/50 border-none h-11"
                          value={formData.date_of_birth}
                          onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                      >
                        <SelectTrigger className="bg-muted/50 border-none h-11">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {profile?.role === 'patient' && (
                      <div className="space-y-2">
                        <Label>Blood Type</Label>
                        <Select
                          value={formData.blood_type}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, blood_type: value }))}
                        >
                          <SelectTrigger className="bg-muted/50 border-none h-11">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"].map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {profile?.role === 'patient' && (
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          className="bg-muted/50 border-none h-11"
                          value={formData.height_cm}
                          onChange={(e) => setFormData(prev => ({ ...prev, height_cm: e.target.value }))}
                          placeholder="e.g. 175"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          className="bg-muted/50 border-none h-11"
                          value={formData.weight_kg}
                          onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: e.target.value }))}
                          placeholder="e.g. 72"
                        />
                      </div>
                    </div>
                  )}

                  <Separator className="my-4 opacity-50" />

                  <Button
                    onClick={handleSaveProfile}
                    disabled={updateProfile.isPending || isProfessionalLoading}
                    className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20"
                  >
                    {updateProfile.isPending || isProfessionalLoading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5 mr-2" />
                    )}
                    Update Profile Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Role Specific Expansion */}
            {profile?.role === 'doctor' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Stethoscope className="w-6 h-6 text-primary" />
                      Professional Practice Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Primary Specialization</Label>
                      <div className="relative">
                        <Award className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="specialization"
                          className="pl-10 bg-muted/50 border-none h-11"
                          value={formData.specialization}
                          onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                          placeholder="e.g. Cardiologist, General Surgeon"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license">Medical License Number</Label>
                      <Input
                        id="license"
                        className="bg-muted/50 border-none h-11"
                        value={formData.license_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                        placeholder="Licensed registration ID"
                      />
                    </div>
                    <div className="p-4 rounded-2xl bg-primary/5 flex items-center gap-4">
                      <Building2 className="w-10 h-10 text-primary opacity-50" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-primary">Affiliated Clinic</p>
                        <p className="text-lg font-semibold">{formData.clinic_name || "Not assigned to a clinic"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {profile?.role === 'clinic_admin' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Building2 className="w-6 h-6 text-primary" />
                      Clinic/Facility Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="clinicName">Facility Name</Label>
                      <Input
                        id="clinicName"
                        className="bg-muted/50 border-none h-11"
                        value={formData.clinic_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, clinic_name: e.target.value }))}
                        placeholder="Hospital or Clinic name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinicAddr">Facility Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="clinicAddr"
                          className="pl-10 bg-muted/50 border-none h-11"
                          value={formData.clinic_address}
                          onChange={(e) => setFormData(prev => ({ ...prev, clinic_address: e.target.value }))}
                          placeholder="Complete physical address"
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="clinicPhone">Facility Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="clinicPhone"
                            className="pl-10 bg-muted/50 border-none h-11"
                            value={formData.clinic_phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, clinic_phone: e.target.value }))}
                            placeholder="Primary contact"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clinicEmail">Facility Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="clinicEmail"
                            className="pl-10 bg-muted/50 border-none h-11"
                            value={formData.clinic_email}
                            onChange={(e) => setFormData(prev => ({ ...prev, clinic_email: e.target.value }))}
                            placeholder="Public inquiries email"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Side Panels */}
          <div className="md:col-span-5 space-y-6">
            {profile?.role === 'patient' ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Chronic Conditions */}
                <Card className="border-none shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="w-5 h-5 text-red-500" />
                      Chronic Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        placeholder="Add condition..."
                        className="h-9 text-sm"
                        onKeyDown={(e) => e.key === "Enter" && handleAddCondition()}
                      />
                      <Button size="icon" className="h-9 w-9" onClick={handleAddCondition} disabled={addCondition.isPending}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {conditions.map((condition) => (
                        <Badge key={condition.id} variant="secondary" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 transition-colors">
                          {condition.condition_name}
                          <button onClick={() => deleteCondition.mutate(condition.id)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity" title="Remove condition" aria-label="Remove condition">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Allergies */}
                <Card className="border-none shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      Allergies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={newAllergy}
                        onChange={(e) => setNewAllergy(e.target.value)}
                        placeholder="Add allergy..."
                        className="h-9 text-sm"
                        onKeyDown={(e) => e.key === "Enter" && handleAddAllergy()}
                      />
                      <Button size="icon" className="h-9 w-9" onClick={handleAddAllergy} disabled={addAllergy.isPending}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allergies.map((allergy) => (
                        <Badge key={allergy.id} className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 border-red-100">
                          {allergy.allergen}
                          <button onClick={() => deleteAllergy.mutate(allergy.id)} className="ml-2" title="Remove allergy" aria-label="Remove allergy">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Medications */}
                <Card className="border-none shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Pill className="w-5 h-5 text-emerald-500" />
                      Active Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={newMedication}
                        onChange={(e) => setNewMedication(e.target.value)}
                        placeholder="Add medication..."
                        className="h-9 text-sm"
                        onKeyDown={(e) => e.key === "Enter" && handleAddMedication()}
                      />
                      <Button size="icon" className="h-9 w-9" onClick={handleAddMedication} disabled={addMedication.isPending}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {medications.map((med) => (
                        <Badge key={med.id} variant="outline" className="px-3 py-1 border-slate-200">
                          {med.medication_name}
                          <button onClick={() => deleteMedication.mutate(med.id)} className="ml-2 opacity-50" title="Remove medication" aria-label="Remove medication">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-3xl bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center text-center space-y-4"
              >
                <div className="p-4 rounded-2xl bg-white shadow-xl">
                  <ShieldCheck className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Verified Professional</h3>
                  <p className="text-muted-foreground mt-2">
                    Your account is currently active as a verified medical provider.
                    Ensure all facility and license information is up to date for billing and appointment accuracy.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}