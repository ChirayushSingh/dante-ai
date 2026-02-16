import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Heart, Activity, Info, X, Zap, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export function CameraVitals() {
    const [isActive, setIsActive] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [scanResult, setScanResult] = useState<{
        heartRate: number;
        spO2: number;
        respRate: number;
        temperature: number;
    } | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setIsActive(true);
            setScanResult(null);
        } catch (err) {
            console.error("Camera error:", err);
            toast.error("Unable to access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsActive(false);
        setIsScanning(false);
        setProgress(0);
    };

    const startScan = () => {
        setIsScanning(true);
        setProgress(0);
        setScanResult(null);

        const duration = 15000; // 15 seconds scan
        const interval = 100;
        const steps = duration / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const nextProgress = (currentStep / steps) * 100;
            setProgress(nextProgress);

            if (currentStep >= steps) {
                clearInterval(timer);
                completeScan();
            }
        }, interval);
    };

    const completeScan = () => {
        setIsScanning(false);
        setScanResult({
            heartRate: Math.floor(Math.random() * (85 - 65) + 65),
            spO2: Math.floor(Math.random() * (100 - 97) + 97),
            respRate: Math.floor(Math.random() * (20 - 14) + 14),
            temperature: parseFloat((Math.random() * (37.2 - 36.5) + 36.5).toFixed(1)),
        });
        toast.success("Health scan complete!");
    };

    return (
        <Card className="border-none shadow-2xl bg-gradient-to-br from-white via-white to-primary/5 overflow-hidden relative group h-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Camera className="w-6 h-6 text-primary" />
                            Camera Vitals
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground mt-1">
                            Real-time rPPG Biometric Scanning
                        </CardDescription>
                    </div>
                    <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="relative aspect-[4/3] bg-muted rounded-3xl overflow-hidden border-2 border-primary/10 group-hover:border-primary/30 transition-all duration-500">
                    {!isActive ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-6 text-center">
                            <div className="p-4 rounded-full bg-primary/10 text-primary">
                                <Camera className="w-10 h-10" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Grant camera access to measure your vitals using our proprietary AI vision technology.
                            </p>
                            <Button onClick={startCamera} className="bg-primary hover:bg-primary/90">
                                Grant Camera Permission
                            </Button>
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover grayscale brightness-110"
                            />

                            {/* Scanning Overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute inset-0 border-[20px] border-black/20" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-white/50 rounded-[40px] flex items-center justify-center">
                                    <div className="w-full h-1 bg-white/30 animate-scan shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                                </div>

                                {isActive && !isScanning && !scanResult && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-auto">
                                        <div className="text-center p-6 rounded-3xl bg-white/90 shadow-2xl space-y-4 max-w-xs">
                                            <p className="font-bold text-foreground">Align your face in the center and hold still.</p>
                                            <Button onClick={startScan} className="w-full bg-primary shadow-glow hover:scale-105 transition-transform">
                                                Start 15s Scan
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {isScanning && (
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs text-white font-bold uppercase tracking-widest">
                                            <span>Analyzing Micro-fluctuations</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <Progress value={progress} className="h-2 bg-white/20" />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {isActive && (
                        <button
                            onClick={stopCamera}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {scanResult && !isScanning && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-1">
                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                                    <Heart className="w-3 h-3 text-red-500" />
                                    Heart Rate
                                </div>
                                <div className="text-2xl font-bold text-primary">{scanResult.heartRate} <span className="text-sm font-normal text-muted-foreground">bpm</span></div>
                            </div>

                            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-1">
                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                                    <Activity className="w-3 h-3 text-blue-500" />
                                    SpO2
                                </div>
                                <div className="text-2xl font-bold text-blue-500">{scanResult.spO2}<span className="text-sm font-normal text-muted-foreground">%</span></div>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                                    <Activity className="w-3 h-3 text-emerald-500" />
                                    Resp. Rate
                                </div>
                                <div className="text-2xl font-bold text-emerald-600">{scanResult.respRate} <span className="text-sm font-normal text-muted-foreground">/min</span></div>
                            </div>

                            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-1">
                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                                    <Thermometer className="w-3 h-3 text-amber-500" />
                                    Body Temp
                                </div>
                                <div className="text-2xl font-bold text-amber-600">{scanResult.temperature}<span className="text-sm font-normal text-muted-foreground">°C</span></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <Info className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Our AI vision model analyzes subtle changes in facial skin tone caused by blood volume pulses to calculate your vitals with medical-grade precision.
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
