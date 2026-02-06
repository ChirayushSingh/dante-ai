import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, FileText, Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MedicationEntry {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
}

interface PrescriptionGeneratorProps {
    patientId: string;
    patientName: string;
    appointmentId?: string;
    doctorId: string;
    onSuccess?: () => void;
}

export function PrescriptionGenerator({
    patientId,
    patientName,
    appointmentId,
    doctorId,
    onSuccess,
}: PrescriptionGeneratorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [medications, setMedications] = useState<MedicationEntry[]>([
        { name: "", dosage: "", frequency: "", duration: "" },
    ]);
    const [instructions, setInstructions] = useState("");

    const addMedication = () => {
        setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
    };

    const removeMedication = (index: number) => {
        setMedications(medications.filter((_, i) => i !== index));
    };

    const updateMedication = (index: number, field: keyof MedicationEntry, value: string) => {
        const updated = [...medications];
        updated[index][field] = value;
        setMedications(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.from("prescriptions").insert({
                patient_id: patientId,
                doctor_id: doctorId,
                appointment_id: appointmentId,
                medications: medications,
                instructions: instructions,
            });

            if (error) throw error;

            toast.success("Prescription generated successfully!");
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.message || "Failed to generate prescription");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Generate Prescription for {patientName}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-lg font-semibold">Medications</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addMedication} className="gap-1">
                                <Plus className="h-4 w-4" /> Add
                            </Button>
                        </div>

                        {medications.map((med, index) => (
                            <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 relative group">
                                <div className="space-y-1">
                                    <Label className="text-xs">Medication Name</Label>
                                    <Input
                                        placeholder="e.g. Lisinopril"
                                        value={med.name}
                                        onChange={(e) => updateMedication(index, "name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Dosage</Label>
                                    <Input
                                        placeholder="e.g. 10mg"
                                        value={med.dosage}
                                        onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Frequency</Label>
                                    <Input
                                        placeholder="e.g. Once daily"
                                        value={med.frequency}
                                        onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Duration</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="e.g. 30 days"
                                            value={med.duration}
                                            onChange={(e) => updateMedication(index, "duration", e.target.value)}
                                            required
                                        />
                                        {medications.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeMedication(index)}
                                                className="text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="instructions" className="text-lg font-semibold">Special Instructions</Label>
                        <Textarea
                            id="instructions"
                            placeholder="Advice on diet, exercise, or when to follow up..."
                            className="min-h-[100px]"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <Button
                            type="submit"
                            className="min-w-[150px] shadow-lg shadow-primary/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                "Issue Prescription"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
