import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Search, Filter, Bell, Map, List, User, Heart, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

export function PredictiveTriage() {
    const [view, setView] = useState<'heatmap' | 'list'>('heatmap');

    const patients = [
        { id: 1, name: "Chirayush Singh", risk: 88, status: "critical", heartRate: 142, spo2: 89, trend: "up" },
        { id: 2, name: "Sarah Miller", risk: 42, status: "stable", heartRate: 72, spo2: 98, trend: "stable" },
        { id: 3, name: "James Wilson", risk: 75, status: "concerning", heartRate: 110, spo2: 91, trend: "up" },
        { id: 4, name: "Robert Fox", risk: 15, status: "healthy", heartRate: 65, spo2: 99, trend: "down" },
        { id: 5, name: "Elena Rossi", risk: 62, status: "concerning", heartRate: 98, spo2: 94, trend: "up" },
        { id: 6, name: "David Brown", risk: 30, status: "stable", heartRate: 75, spo2: 97, trend: "stable" },
        { id: 7, name: "Maria Garcia", risk: 92, status: "critical", heartRate: 135, spo2: 88, trend: "up" },
        { id: 8, name: "Kevin Lee", risk: 22, status: "healthy", heartRate: 68, spo2: 98, trend: "down" },
    ];

    const getRiskColor = (risk: number) => {
        if (risk > 80) return "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
        if (risk > 60) return "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]";
        if (risk > 40) return "bg-amber-400";
        return "bg-emerald-500";
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'critical': return 'Crisis Imminent';
            case 'concerning': return 'Trending Down';
            case 'stable': return 'Stable';
            default: return 'Optimal';
        }
    };

    return (
        <Card className="border-none shadow-2xl bg-gradient-to-br from-white via-white to-primary/5 h-full overflow-hidden flex flex-col">
            <CardHeader className="border-b bg-muted/20">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            Predictive Triage Dashboard
                            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">LIVE HEATMAP</Badge>
                        </CardTitle>
                        <CardDescription>AI-driven preventative health monitoring</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex bg-muted p-1 rounded-xl">
                            <Button
                                variant={view === 'heatmap' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setView('heatmap')}
                                className="rounded-lg h-8 px-3"
                            >
                                <Map className="w-3 h-3 mr-2" /> Heatmap
                            </Button>
                            <Button
                                variant={view === 'list' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setView('list')}
                                className="rounded-lg h-8 px-3"
                            >
                                <List className="w-3 h-3 mr-2" /> List View
                            </Button>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl border-primary/20 relative">
                            <Bell className="w-4 h-4" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search patients or conditions..." className="pl-10 rounded-2xl bg-white border-border/50 focus:ring-primary/20" />
                    </div>
                    <Button variant="outline" className="rounded-2xl gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'heatmap' ? (
                        <motion.div
                            key="heatmap"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 overflow-y-auto pr-2 custom-scrollbar"
                        >
                            {patients.map((patient) => (
                                <motion.div
                                    key={patient.id}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="relative aspect-square rounded-3xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group"
                                >
                                    <div className={`absolute inset-0 rounded-3xl opacity-20 transition-opacity group-hover:opacity-30 ${getRiskColor(patient.risk)}`} />
                                    <div className={`w-3 h-3 rounded-full absolute top-4 right-4 ${getRiskColor(patient.risk)} border-2 border-white`} />

                                    <div className="relative z-10 space-y-2">
                                        <div className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center mx-auto mb-2 text-slate-800 font-black text-xs">
                                            {patient.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-900 line-clamp-1">{patient.name}</p>
                                            <p className="text-[9px] font-black text-primary uppercase mt-0.5">{patient.risk}% RISK</p>
                                        </div>
                                    </div>

                                    {/* Hover Detail Modal (Simulated) */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/95 rounded-3xl transition-opacity flex flex-col items-center justify-center p-3 text-[10px] space-y-2 z-20 border shadow-2xl">
                                        <p className="font-bold border-b w-full pb-1 uppercase tracking-tighter">Live Biometrics</p>
                                        <div className="flex gap-4">
                                            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500" /> {patient.heartRate}</span>
                                            <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-500" /> {patient.spo2}%</span>
                                        </div>
                                        <p className={`font-black uppercase flex items-center gap-1 ${patient.trend === 'up' ? 'text-red-500' : 'text-emerald-500'}`}>
                                            {patient.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {getStatusText(patient.status)}
                                        </p>
                                        <Button size="sm" className="w-full rounded-xl h-6 text-[9px] bg-primary">Open Case</Button>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Virtual Grid Fillers */}
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="aspect-square rounded-3xl border-2 border-dashed border-muted/50 flex items-center justify-center opacity-30">
                                    <div className="w-2 h-2 rounded-full bg-muted" />
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar"
                        >
                            {patients.sort((a, b) => b.risk - a.risk).map((patient) => (
                                <div key={patient.id} className="p-4 rounded-2xl bg-white border border-border/50 flex items-center justify-between hover:shadow-md transition-shadow group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {patient.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">{patient.name}</h4>
                                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <Activity className="w-3 h-3" /> Last sync: 2 mins ago
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12 text-center">
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Risk Score</p>
                                            <Badge className={`${getRiskColor(patient.risk)} border-none text-white`}>{patient.risk}%</Badge>
                                        </div>
                                        <div className="w-32 hidden md:block">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Crisis Trend</p>
                                            <Progress value={patient.risk} className="h-1.5" />
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                                            <User className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="pt-4 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="w-3 h-3 rounded-full bg-red-500" /> High Priority (2)
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="w-3 h-3 rounded-full bg-orange-500" /> Cautionary (2)
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" /> Optimal (4)
                        </div>
                    </div>
                    <p className="text-[10px] italic text-muted-foreground">
                        * Risk updates every 30s based on synchronized wearable telemetry and history.
                    </p>
                </div>
            </div>
        </Card>
    );
}
