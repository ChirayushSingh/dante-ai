import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Heart, Activity, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function PatientRegistration() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        gender: "",
        blood_type: "",
        height_cm: "",
        weight_kg: "",
        date_of_birth: "",
    });

    const [allergies, setAllergies] = useState<string[]>([]);
    const [conditions, setConditions] = useState<string[]>([]);
    const [medications, setMedications] = useState<string[]>([]);

    // Load existing profile and medical details so users can edit instead of starting from scratch
    useEffect(() => {
        const loadExisting = async () => {
            if (!user) return;
            try {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("gender, blood_type, height_cm, weight_kg, date_of_birth")
                    .eq("user_id", user.id)
                    .single();

                if (profile) {
                    setFormData({
                        gender: profile.gender || "",
                        blood_type: profile.blood_type || "",
                        height_cm: profile.height_cm ? String(profile.height_cm) : "",
                        weight_kg: profile.weight_kg ? String(profile.weight_kg) : "",
                        date_of_birth: profile.date_of_birth || "",
                    });
                }

                const { data: allergiesData } = await supabase
                    .from("allergies")
                    .select("allergen")
                    .eq("user_id", user.id);
                if (allergiesData) {
                    setAllergies(allergiesData.map((a: any) => a.allergen || "").filter(Boolean));
                }

                const { data: conditionsData } = await supabase
                    .from("chronic_conditions")
                    .select("condition_name")
                    .eq("user_id", user.id);
                if (conditionsData) {
                    setConditions(conditionsData.map((c: any) => c.condition_name || "").filter(Boolean));
                }

                const { data: medicationsData } = await supabase
                    .from("medications")
                    .select("medication_name")
                    .eq("user_id", user.id)
                    .eq("is_current", true);
                if (medicationsData) {
                    setMedications(medicationsData.map((m: any) => m.medication_name || "").filter(Boolean));
                }
            } catch (error) {
                console.error("Failed to load existing medical profile", error);
            }
        };

        loadExisting();
    }, [user]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);

        try {
            // 1. Update Profile
            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    gender: formData.gender,
                    blood_type: formData.blood_type,
                    height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
                    weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
                    date_of_birth: formData.date_of_birth,
                })
                .eq("user_id", user.id);

            if (profileError) throw profileError;

            // 2. Replace allergies list
            await supabase.from("allergies").delete().eq("user_id", user.id);
            if (allergies.length > 0) {
                const { error: alError } = await supabase.from("allergies").insert(
                    allergies.map(a => ({ user_id: user.id, allergen: a }))
                );
                if (alError) throw alError;
            }

            // 3. Replace chronic conditions list
            await supabase.from("chronic_conditions").delete().eq("user_id", user.id);
            if (conditions.length > 0) {
                const { error: condError } = await supabase.from("chronic_conditions").insert(
                    conditions.map(c => ({ user_id: user.id, condition_name: c }))
                );
                if (condError) throw condError;
            }

            // 4. Replace medications list
            await supabase.from("medications").delete().eq("user_id", user.id);
            if (medications.length > 0) {
                const { error: medError } = await supabase.from("medications").insert(
                    medications.map(m => ({ user_id: user.id, medication_name: m, is_current: true }))
                );
                if (medError) throw medError;
            }

            toast.success("Medical profile updated successfully!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const addItem = (list: string[], setList: (val: string[]) => void) => {
        setList([...list, ""]);
    };

    const updateItem = (index: number, val: string, list: string[], setList: (val: string[]) => void) => {
        const newList = [...list];
        newList[index] = val;
        setList(newList);
    };

    const removeItem = (index: number, list: string[], setList: (val: string[]) => void) => {
        setList(list.filter((_, i) => i !== index));
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto py-8 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="text-center">
                        <h1 className="text-4xl font-display font-bold text-foreground">Complete Your Health Profile</h1>
                        <p className="text-muted-foreground mt-2">
                            Add, edit or delete your medical details below, then submit to keep your profile up to date.
                        </p>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-8">
                        <Card className="shadow-lg border-primary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-primary" /> Basic Information
                                </CardTitle>
                                <CardDescription>Essential physical metrics and demographics</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Biological Gender</Label>
                                    <Select onValueChange={(val) => setFormData({ ...formData, gender: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other/Prefer not to say</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date of Birth</Label>
                                    <Input type="date" onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Blood Type</Label>
                                    <Select onValueChange={(val) => setFormData({ ...formData, blood_type: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select blood type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-4">
                                    <div className="space-y-2 flex-1">
                                        <Label>Height (cm)</Label>
                                        <Input type="number" placeholder="175" onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })} />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <Label>Weight (kg)</Label>
                                        <Input type="number" placeholder="70" onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* List Sections */}
                        {[
                            { title: "Allergies", data: allergies, setter: setAllergies, icon: <AlertCircle className="h-5 w-5 text-destructive" />, placeholder: "e.g. Penicillin, Peanuts" },
                            { title: "Chronic Conditions", data: conditions, setter: setConditions, icon: <Heart className="h-5 w-5 text-primary" />, placeholder: "e.g. Diabetes, Hypertension" },
                            { title: "Current Medications", data: medications, setter: setMedications, icon: <Activity className="h-5 w-5 text-accent" />, placeholder: "e.g. Metformin, Aspirin" }
                        ].map((section, idx) => (
                            <Card key={idx} className="shadow-lg border-primary/5">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="flex items-center gap-2">
                                        {section.icon}
                                        <CardTitle>{section.title}</CardTitle>
                                    </div>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => addItem(section.data, section.setter)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {section.data.map((item, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input
                                                placeholder={section.placeholder}
                                                value={item}
                                                onChange={(e) => updateItem(i, e.target.value, section.data, section.setter)}
                                            />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(i, section.data, section.setter)}>
                                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    ))}
                                    {section.data.length === 0 && <p className="text-sm text-muted-foreground italic text-center py-2">No items added yet.</p>}
                                </CardContent>
                            </Card>
                        ))}

                        <Button type="submit" className="w-full h-12 text-lg shadow-xl shadow-primary/20" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Submit Medical Profile"}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
