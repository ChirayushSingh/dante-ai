import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wind, Sun, CloudRain, AlertCircle, Droplets, Thermometer, ShieldCheck, TreePine, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function EnvironmentalGuardian() {
    const [envData, setEnvData] = useState({
        aqi: 42,
        pollenTree: "Moderate",
        pollenGrass: "Low",
        pollenRagweed: "None",
        uvIndex: 4,
        humidity: 65,
        temp: 24,
        riskLevel: "Low" as "Low" | "Moderate" | "High",
    });

    const getAqiColor = (aqi: number) => {
        if (aqi <= 50) return "text-emerald-500";
        if (aqi <= 100) return "text-amber-500";
        return "text-red-500";
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case "High": return "bg-red-500";
            case "Moderate": return "bg-amber-500";
            default: return "bg-emerald-500";
        }
    };

    return (
        <Card className="border-none shadow-2xl bg-gradient-to-br from-white via-white to-primary/5 h-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Wind className="w-6 h-6 text-primary" />
                            Environmental Guardian
                        </CardTitle>
                        <CardDescription className="text-base">
                            Real-time health risk correlation
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-bold px-3 py-1">
                        LIVE SYNC
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl bg-muted/30 border border-border/50 flex flex-col items-center text-center space-y-2">
                        <div className="p-3 rounded-2xl bg-white shadow-sm text-primary">
                            <Wind className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Air Quality</p>
                            <p className={`text-2xl font-black ${getAqiColor(envData.aqi)}`}>{envData.aqi}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Excellent</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-3xl bg-muted/30 border border-border/50 flex flex-col items-center text-center space-y-2">
                        <div className="p-3 rounded-2xl bg-white shadow-sm text-amber-500">
                            <TreePine className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pollen (Tree)</p>
                            <p className="text-2xl font-black text-amber-600">{envData.pollenTree}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Rising Trends</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
                        <div className="p-2 rounded-xl bg-emerald-500 text-white mt-1">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-emerald-900">Personalized Health Alert</p>
                            <p className="text-sm text-emerald-700/80 leading-relaxed mt-1">
                                "Hi Chirayush, I see the pollen count in your area is <span className="font-bold underline">moderate</span>. Based on your history of seasonal allergies, I suggest keeping windows closed this afternoon."
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-2xl bg-white border border-border/50 text-center">
                            <Sun className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">UV Index</p>
                            <p className="text-sm font-black">{envData.uvIndex}</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white border border-border/50 text-center">
                            <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Humidity</p>
                            <p className="text-sm font-black">{envData.humidity}%</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white border border-border/50 text-center">
                            <Thermometer className="w-4 h-4 mx-auto mb-1 text-red-500" />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Outdoor</p>
                            <p className="text-sm font-black">{envData.temp}°C</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-muted-foreground uppercase tracking-wider">Asthma Trigger Risk</span>
                        <span className="text-emerald-500">LOW (24%)</span>
                    </div>
                    <Progress value={24} className="h-1.5 bg-muted" />
                    <div className="flex items-center gap-2 mt-2">
                        <Info className="w-3 h-3 text-primary" />
                        <p className="text-[10px] text-muted-foreground leading-tight">
                            Risk score calculated using real-time AQI, humidity, and your medical profile.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
