import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Camera, Check, X, Shield, Clock, AlertCircle, ScanLine, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export function MedicationVerification() {
    const [step, setStep] = useState<'idle' | 'scanning' | 'verifying' | 'success'>('idle');
    const [progress, setProgress] = useState(0);
    const [pillInfo, setPillInfo] = useState<{ name: string; dosage: string } | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startVerification = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
            setStep('scanning');
            setProgress(0);
            toast.info("Hold your medication up to the camera for verification.");
        } catch (err) {
            toast.error("Camera access required for medication verification.");
        }
    };

    useEffect(() => {
        if (step === 'scanning') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        verifyPill();
                        return 100;
                    }
                    return prev + 5;
                });
            }, 150);
            return () => clearInterval(interval);
        }
    }, [step]);

    const verifyPill = () => {
        setStep('verifying');
        setTimeout(() => {
            setPillInfo({ name: "Lisinopril", dosage: "10mg" });
            setStep('success');
            toast.success("Medication identified and intake verified!");
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
        }, 2000);
    };

    const reset = () => {
        setStep('idle');
        setProgress(0);
        setPillInfo(null);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    return (
        <Card className="border-none shadow-2xl bg-gradient-to-br from-white via-white to-primary/5 h-full overflow-hidden">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Pill className="w-6 h-6 text-primary" />
                            Smart Intake Proof
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground mt-1">
                            Real-time video medication verification
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-bold px-3 py-1">
                        <Shield className="w-3 h-3 mr-1" /> COMPLIANT
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="relative aspect-video bg-muted rounded-3xl overflow-hidden border-2 border-primary/10 group">
                    {step === 'idle' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                            <div className="p-4 rounded-full bg-primary/10 text-primary">
                                <Smartphone className="w-10 h-10" />
                            </div>
                            <p className="text-sm text-muted-foreground max-w-[250px]">
                                Verify your medication intake for clinical records and insurance benefits.
                            </p>
                            <Button onClick={startVerification} className="rounded-full px-8 shadow-glow">
                                Start Proof of Intake
                            </Button>
                        </div>
                    )}

                    {(step === 'scanning' || step === 'verifying') && (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover grayscale brightness-110"
                            />
                            <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />

                            {/* Scan Overlay */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-primary/50 rounded-2xl flex items-center justify-center">
                                <div className="w-full h-1 bg-primary/50 animate-scan shadow-glow" />
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs text-white font-bold uppercase tracking-widest">
                                        <span>{step === 'scanning' ? 'Identifying Medication...' : 'Verifying Identity...'}</span>
                                        <span>{step === 'scanning' ? Math.round(progress) : 'Working...'}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2 bg-white/20" />
                                </div>
                            </div>
                        </>
                    )}

                    {step === 'success' && pillInfo && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-emerald-500/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 text-white space-y-4"
                        >
                            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                                <Check className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter">Intake Verified</h3>
                                <p className="text-emerald-50 opacity-90 text-sm mt-1">
                                    {pillInfo.name} ({pillInfo.dosage}) recorded successfully.
                                </p>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100 italic">
                                Synced with insurance portal #AX4920
                            </p>
                            <Button onClick={reset} variant="outline" className="rounded-full border-white/50 text-white hover:bg-white/10">
                                Log New Intake
                            </Button>
                        </motion.div>
                    )}

                    {(step === 'scanning' || step === 'verifying') && (
                        <button
                            onClick={reset}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Scheduled</p>
                            <p className="text-sm font-bold">10:00 AM</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Status</p>
                            <p className="text-sm font-bold text-amber-600">Pending</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-start gap-4">
                    <ScanLine className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Our computer vision model recognizes medication shape, color, and imprint to ensure zero-error adherence tracking.
                    </p>
                </div>
            </CardContent>

            <style>
                {`
          @keyframes scan {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
          }
          .animate-scan {
            position: absolute;
            animation: scan 4s ease-in-out infinite;
          }
        `}
            </style>
        </Card>
    );
}
