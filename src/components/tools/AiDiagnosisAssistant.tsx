import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Sparkles, Loader2, ListChecks, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

export function AiDiagnosisAssistant() {
    const [symptoms, setSymptoms] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!symptoms.trim()) return;

        setIsAnalyzing(true);
        // Simulation: In a real app, this would call a Supabase Edge Function or OpenAI directly
        setTimeout(() => {
            setResult({
                differentialDiagnosis: [
                    { condition: "Common Cold (Viral Upper Respiratory Infection)", probability: "High", reasoning: "Presented with runny nose, mild cough, and absence of high fever." },
                    { condition: "Allergic Rhinitis", probability: "Medium", reasoning: "Clear nasal discharge and lack of systemic symptoms point toward allergies." },
                    { condition: "Acute Sinusitis", probability: "Low", reasoning: "No facial pain or prolonged symptom duration reported." }
                ],
                recommendedTests: ["Physical examination of throat and ears", "Nasal swab if symptoms persist >10 days"],
                clinicalNotes: "Patient presents with mild respiratory symptoms. Monitor for fever progression."
            });
            setIsAnalyzing(false);
            toast.success("AI Analysis Complete");
        }, 2000);
    };

    return (
        <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5">
                <div className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-primary" />
                    <div>
                        <CardTitle>AI Diagnosis Assistant</CardTitle>
                        <CardDescription>Enter patient symptoms for differential diagnosis support</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <Textarea
                    placeholder="Describe symptoms, duration, and any observed signs..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-[120px] rounded-2xl"
                />
                <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !symptoms}
                    className="w-full gap-2 rounded-xl"
                >
                    {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {isAnalyzing ? "Analyzing Symptoms..." : "Generate Differential Diagnosis"}
                </Button>

                {result && (
                    <div className="mt-6 space-y-4 animate-in fade-in duration-500">
                        <div className="space-y-3">
                            <h4 className="font-semibold flex items-center gap-2 text-primary">
                                <ListChecks className="h-4 w-4" /> Differential Diagnosis
                            </h4>
                            <div className="space-y-2">
                                {result.differentialDiagnosis.map((item: any, idx: number) => (
                                    <div key={idx} className="p-3 rounded-xl border bg-white shadow-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-sm">{item.condition}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.probability === 'High' ? 'bg-red-100 text-red-700' :
                                                    item.probability === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {item.probability} Prob.
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{item.reasoning}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border space-y-2">
                            <h4 className="font-semibold text-xs flex items-center gap-2">
                                <Stethoscope className="h-3 w-3" /> Recommended Next Steps
                            </h4>
                            <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                                {result.recommendedTests.map((test: string, idx: number) => (
                                    <li key={idx}>{test}</li>
                                ))}
                            </ul>
                        </div>

                        <p className="text-[10px] text-center text-muted-foreground italic">
                            Note: AI assistant is for clinical decision support only. Final diagnosis rests with the medical professional.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
