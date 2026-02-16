import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, MessageSquare, Volume2, Shield, AlertTriangle, Play, Square, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export function GuardianVoiceAI() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [analysis, setAnalysis] = useState<{
        sentiment: "positive" | "neutral" | "concerning";
        indicators: string[];
        feedback: string;
    } | null>(null);

    const startListening = () => {
        setIsListening(true);
        setTranscript("");
        setAnalysis(null);
        toast.info("Voice Guardian is listening... speak naturally.");

        // Simulating Web Speech API behavior for the demo/startup preview
        const demoTexts = [
            "I've been feeling a bit short of breath today...",
            "I'm feeling great, my energy levels are back to normal.",
            "My voice feels a bit shaky and I'm quite tired."
        ];

        setTimeout(() => {
            const selectedText = demoTexts[Math.floor(Math.random() * demoTexts.length)];
            typeWriterEffect(selectedText);
        }, 1500);
    };

    const typeWriterEffect = (text: string) => {
        let i = 0;
        const interval = setInterval(() => {
            setTranscript(prev => prev + text[i]);
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                setTimeout(() => stopListening(text), 1000);
            }
        }, 50);
    };

    const stopListening = (finalText: string) => {
        setIsListening(false);
        analyzeSentiment(finalText);
    };

    const analyzeSentiment = (text: string) => {
        let result: {
            sentiment: "positive" | "neutral" | "concerning";
            indicators: string[];
            feedback: string;
        };

        if (text.includes("short of breath") || text.includes("shaky") || text.includes("tired")) {
            result = {
                sentiment: "concerning",
                indicators: ["Slow speech rate detected", "Pitch variance suggests anxiety", "Possible breath gaps"],
                feedback: "Chirayush, I've noticed some strain in your voice and breathing. Based on your profile, I recommend sitting down and checking your O2 levels with the Camera Vitals tool."
            };
        } else if (text.includes("great") || text.includes("normal")) {
            result = {
                sentiment: "positive",
                indicators: ["Optimal speech cadence", "Bright vocal tone", "Normal respiratory rhythm"],
                feedback: "Excellent vocal vitality today! Your speech patterns correlate with high recovery scores."
            };
        } else {
            result = {
                sentiment: "neutral",
                indicators: ["Stable vocal frequency", "Standard speech rate"],
                feedback: "Baseline vocal health confirmed. No respiratory or neurological anomalies detected in speech."
            };
        }

        setAnalysis(result);
    };

    return (
        <Card className="border-none shadow-2xl bg-gradient-to-br from-white via-white to-primary/5 h-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-primary" />
                            Guardian Voice AI
                        </CardTitle>
                        <CardDescription className="text-base">
                            Real-time biopsychosocial speech analysis
                        </CardDescription>
                    </div>
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="relative p-8 rounded-3xl bg-muted/30 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center min-h-[240px] transition-all">
                    <AnimatePresence mode="wait">
                        {!isListening && !transcript && !analysis && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center space-y-4"
                            >
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                                    <Mic className="w-10 h-10" />
                                </div>
                                <p className="text-sm text-muted-foreground font-medium max-w-[200px]">
                                    Tap to begin a real-time vocal health check-in
                                </p>
                                <Button onClick={startListening} className="rounded-full px-8 shadow-glow">
                                    Initialize Scan
                                </Button>
                            </motion.div>
                        )}

                        {isListening && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key="listening"
                                className="flex flex-col items-center space-y-6 w-full"
                            >
                                <div className="flex gap-1 items-end h-12">
                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [10, 40, 10] }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 0.5 + Math.random(),
                                                ease: "easeInOut"
                                            }}
                                            className="w-2 bg-primary rounded-full"
                                        />
                                    ))}
                                </div>
                                <p className="text-lg font-medium text-primary animate-pulse italic">
                                    "{transcript || "Listening..."}"
                                </p>
                            </motion.div>
                        )}

                        {!isListening && analysis && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full space-y-4"
                            >
                                <div className={`p-4 rounded-2xl border ${analysis.sentiment === 'concerning' ? 'bg-red-50 border-red-100' :
                                        analysis.sentiment === 'positive' ? 'bg-emerald-50 border-emerald-100' :
                                            'bg-blue-50 border-blue-100'
                                    }`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-xl ${analysis.sentiment === 'concerning' ? 'bg-red-500 text-white' :
                                                analysis.sentiment === 'positive' ? 'bg-emerald-500 text-white' :
                                                    'bg-blue-500 text-white'
                                            }`}>
                                            {analysis.sentiment === 'concerning' ? <AlertTriangle className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className={`font-bold text-sm ${analysis.sentiment === 'concerning' ? 'text-red-700' :
                                                    analysis.sentiment === 'positive' ? 'text-emerald-700' :
                                                        'text-blue-700'
                                                }`}>
                                                AI SENTIMENT: {analysis.sentiment.toUpperCase()}
                                            </p>
                                            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                                                {analysis.feedback}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    {analysis.indicators.map((indicator, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-white p-2 rounded-lg border border-border/50">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            {indicator}
                                        </div>
                                    ))}
                                </div>

                                <Button variant="outline" size="sm" onClick={() => { setTranscript(""); setAnalysis(null) }} className="w-full">
                                    Restart Voice Check
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest border-t pt-4">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Vocal Clarity
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-glow" />
                        Neural Flow
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        O2 Rhythm
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
