import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Save, FileText, ClipboardCheck, Sparkles, Brain, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export function AILiveScribe() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState("");
    const [soapNotes, setSoapNotes] = useState({
        subjective: "",
        objective: "",
        assessment: "",
        plan: ""
    });
    const [codes, setCodes] = useState<{ code: string; desc: string }[]>([]);
    const [analyzing, setAnalyzing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const startScribe = () => {
        setIsRecording(true);
        setTranscription("");
        toast.success("AI Scribe initialized. Capturing consultation...");

        // Simulate consultation flow
        const script = [
            "Patient: I've had a persistent dry cough for three days.",
            "Doctor: Any fever or shortness of breath?",
            "Patient: No fever, but I feel tight in the chest when climbing stairs.",
            "Doctor: Let me check your lungs... breath sounds are slightly diminished at the bases.",
            "Doctor: Oxygen saturation is 96 percent on room air.",
            "Doctor: This looks like a mild bronchial irritation, possibly reactive airway.",
            "Doctor: I'll start you on an albuterol inhaler. We should also get a chest X-ray to be safe."
        ];

        let currentLine = 0;
        const interval = setInterval(() => {
            if (currentLine < script.length) {
                setTranscription(prev => prev + (prev ? "\n" : "") + script[currentLine]);
                autoUpdateSOAP(script[currentLine]);
                currentLine++;
            } else {
                clearInterval(interval);
            }
        }, 3000);
    };

    const autoUpdateSOAP = (newLine: string) => {
        setAnalyzing(true);
        // Simulated NLP parsing
        setTimeout(() => {
            if (newLine.includes("Patient:")) {
                setSoapNotes(prev => ({ ...prev, subjective: prev.subjective + (prev.subjective ? " " : "") + newLine.replace("Patient: ", "") }));
            } else if (newLine.includes("Oxygen") || newLine.includes("breath sounds")) {
                setSoapNotes(prev => ({ ...prev, objective: prev.objective + (prev.objective ? " " : "") + newLine.replace("Doctor: ", "") }));
            } else if (newLine.includes("looks like")) {
                setSoapNotes(prev => ({ ...prev, assessment: prev.assessment + (prev.assessment ? " " : "") + newLine.replace("Doctor: ", "") }));
                setCodes(prev => [...prev, { code: "J45.909", desc: "Unspecified asthma, uncomplicated" }]);
            } else if (newLine.includes("start you on") || newLine.includes("X-ray")) {
                setSoapNotes(prev => ({ ...prev, plan: prev.plan + (prev.plan ? " " : "") + newLine.replace("Doctor: ", "") }));
            }
            setAnalyzing(false);
        }, 800);
    };

    const stopScribe = () => {
        setIsRecording(false);
        toast.info("Consultation recorded. Reviewing final SOAP draft.");
    };

    return (
        <Card className="border-none shadow-2xl bg-gradient-to-br from-white via-white to-primary/5 h-full flex flex-col min-h-[600px]">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-primary'} text-white`}>
                            <Brain className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                AI Live Scribe
                                {isRecording && <Badge variant="destructive" className="animate-pulse">LIVE</Badge>}
                            </CardTitle>
                            <CardDescription>Real-time SOAP extraction & ICD-10 coding</CardDescription>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!isRecording ? (
                            <Button onClick={startScribe} className="rounded-full px-6 shadow-glow">
                                <Mic className="w-4 h-4 mr-2" />
                                Initialize Scribe
                            </Button>
                        ) : (
                            <Button variant="destructive" onClick={stopScribe} className="rounded-full px-6 shadow-glow">
                                <MicOff className="w-4 h-4 mr-2" />
                                Stop Capture
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
                {/* Live Transcription Area */}
                <div className="p-6 border-r flex flex-col gap-4 bg-muted/5">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <RefreshCw className={`w-4 h-4 ${isRecording ? 'animate-spin' : ''}`} />
                            Live Transcript
                        </h3>
                        {analyzing && (
                            <span className="text-[10px] font-bold text-primary animate-pulse italic">
                                AI Parsing Context...
                            </span>
                        )}
                    </div>
                    <div
                        ref={scrollRef}
                        className="flex-1 bg-white rounded-2xl border p-4 font-mono text-sm overflow-y-auto space-y-3 shadow-inner"
                    >
                        {transcription.split('\n').map((line, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-2 rounded-lg ${line.startsWith('Patient:') ? 'bg-blue-50/50 border-l-4 border-blue-400' : 'bg-emerald-50/50 border-l-4 border-emerald-400'}`}
                            >
                                {line}
                            </motion.div>
                        ))}
                        {!transcription && (
                            <div className="h-full flex items-center justify-center text-muted-foreground italic">
                                Ready to transcribe...
                            </div>
                        )}
                    </div>
                </div>

                {/* Real-time SOAP View */}
                <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[500px]">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4 text-primary" />
                        SOAP Draft (Real-time)
                    </h3>

                    <div className="space-y-4">
                        {Object.entries(soapNotes).map(([key, value]) => (
                            <motion.div
                                key={key}
                                layout
                                className="p-3 rounded-xl bg-white border border-border/50 shadow-sm"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-black text-primary uppercase">{key}</span>
                                    {value && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                                </div>
                                <div className="text-sm min-h-[2.5rem] text-foreground/80 leading-relaxed">
                                    {value || <span className="text-muted-foreground italic">Waiting for data...</span>}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <h4 className="text-[10px] font-black text-primary uppercase mb-2 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Suggested Codes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {codes.length > 0 ? codes.map((c, i) => (
                                <Badge key={i} variant="outline" className="bg-white border-primary/20 text-primary px-3 py-1 font-mono text-xs">
                                    {c.code}: {c.desc}
                                </Badge>
                            )) : (
                                <span className="text-xs text-muted-foreground italic">No codes detected yet.</span>
                            )}
                        </div>
                    </div>

                    <Button className="mt-auto w-full rounded-xl bg-primary hover:bg-primary/90 shadow-glow" disabled={!soapNotes.subjective}>
                        <Save className="w-4 h-4 mr-2" />
                        Review & Sign-off Note
                    </Button>
                </div>
            </div>
        </Card>
    );
}
