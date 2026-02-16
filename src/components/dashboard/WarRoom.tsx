import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MousePointer2, Share2, Play, Activity, Thermometer, ShieldCheck, Layers, Boxes, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { InteractiveBodyMap } from "@/components/tools/InteractiveBodyMap";

export function WarRoom() {
    const [activeSpecialists, setActiveSpecialists] = useState([
        { id: 1, name: "Dr. Sarah Chen", role: "Cardiology", color: "bg-blue-500" },
        { id: 2, name: "Dr. James Wilson", role: "Neurology", color: "bg-purple-500" },
        { id: 3, name: "Dr. Elena Rossi", role: "Radiology", color: "bg-emerald-500" }
    ]);

    const [simulationMode, setSimulationMode] = useState(false);
    const [dosage, setDosage] = useState(50);
    const [annotations, setAnnotations] = useState<{ x: number, y: number, text: string }[]>([]);

    const handleSimulate = () => {
        setSimulationMode(true);
        setTimeout(() => setSimulationMode(false), 5000);
    };

    return (
        <Card className="border-none shadow-2xl bg-slate-950 text-white overflow-hidden flex flex-col min-h-[700px]">
            <CardHeader className="border-b border-white/10 bg-white/5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary text-white">
                            <Boxes className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                Clinical War Room
                                <Badge className="bg-emerald-500 text-white border-none animate-pulse">ACTIVE SESSION</Badge>
                            </CardTitle>
                            <CardDescription className="text-slate-400">Collaborative 3D Digital Twin Simulation</CardDescription>
                        </div>
                    </div>
                    <div className="flex -space-x-2">
                        {activeSpecialists.map(specialist => (
                            <div
                                key={specialist.id}
                                className={`w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold ${specialist.color} cursor-help`}
                                title={`${specialist.name} (${specialist.role})`}
                            >
                                {specialist.name.charAt(0)}
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] cursor-pointer hover:bg-slate-700">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </CardHeader>

            <div className="flex-1 flex overflow-hidden">
                {/* Main 3D Canvas Mockup */}
                <div className="flex-1 relative bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center p-8">
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        <Button size="icon" variant="outline" className="rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white">
                            <Layers className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white">
                            <Activity className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white">
                            <Tablet className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* This represents our 3D Model with multiplayer cursor indications */}
                    <div className="w-full max-w-lg aspect-square relative">
                        <InteractiveBodyMap onPartSelect={(part) => console.log(part)} />

                        {/* Multiplayer Indicators Overlay */}
                        <motion.div
                            animate={{ x: [20, 100, 20], y: [50, 200, 50] }}
                            transition={{ repeat: Infinity, duration: 8 }}
                            className="absolute z-20 pointer-events-none"
                        >
                            <MousePointer2 className="w-4 h-4 text-blue-400 fill-blue-400" />
                            <Badge className="bg-blue-500 scale-75 -translate-y-2">Dr. Chen</Badge>
                        </motion.div>

                        <motion.div
                            animate={{ x: [300, 150, 300], y: [150, 50, 150] }}
                            transition={{ repeat: Infinity, duration: 12 }}
                            className="absolute z-20 pointer-events-none"
                        >
                            <MousePointer2 className="w-4 h-4 text-purple-400 fill-purple-400" />
                            <Badge className="bg-purple-500 scale-75 -translate-y-2">Dr. Wilson</Badge>
                        </motion.div>

                        {simulationMode && (
                            <div className="absolute inset-0 z-30 flex items-center justify-center">
                                <div className="relative">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="w-32 h-32 bg-red-500 rounded-full blur-3xl"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <Activity className="w-12 h-12 text-white animate-pulse" />
                                        <p className="text-xs font-black uppercase tracking-tighter mt-2">SIMULATING TACO-STIMULATION</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-6 right-6 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md max-w-xs space-y-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Real-time Metrics</span>
                            <Badge variant="outline" className="border-white/20 text-white text-[9px]">SYNCED</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-slate-400 text-[10px] uppercase font-bold">Heart Rate</p>
                                <p className={`text-xl font-bold ${simulationMode ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {simulationMode ? '142' : '72'} <span className="text-[10px] font-normal">BPM</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-[10px] uppercase font-bold">Inflammation</p>
                                <p className="text-xl font-bold text-amber-400">
                                    Level 4 <span className="text-[10px] font-normal">/10</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Control Sidebar */}
                <div className="w-80 border-l border-white/10 p-6 flex flex-col gap-6 bg-slate-900/50">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-primary" />
                            Medication Simulation
                        </h3>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <div className="flex justify-between text-xs">
                                <span>Dosage: Prednisone</span>
                                <span className="font-bold text-primary">{dosage}mg</span>
                            </div>
                            <Slider
                                value={[dosage]}
                                onValueChange={(val) => setDosage(val[0])}
                                max={100}
                                className="py-4"
                            />
                            <p className="text-[10px] text-slate-400 italic">
                                Simulating impact on renal and pulmonary systems over 48 hours.
                            </p>
                            <Button onClick={handleSimulate} disabled={simulationMode} className="w-full bg-primary hover:bg-primary/90 text-white">
                                <Play className="w-4 h-4 mr-2" />
                                Run Simulation
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Collaborative Notes
                        </h3>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="p-3 rounded-xl bg-white/5 border-l-2 border-emerald-500">
                                <p className="text-[10px] font-bold text-emerald-400 uppercase">Dr. Rossi • 10:14 AM</p>
                                <p className="text-xs mt-1 text-slate-300 italic">"Notice the focal point in the left ventricle."</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border-l-2 border-blue-500">
                                <p className="text-[10px] font-bold text-blue-400 uppercase">Dr. Chen • 10:16 AM</p>
                                <p className="text-xs mt-1 text-slate-300 italic">"Looks like high sensitivity to current dosage."</p>
                            </div>
                        </div>
                    </div>

                    <Button variant="outline" className="mt-auto border-white/10 hover:bg-white/10 text-white">
                        <Activity className="w-4 h-4 mr-2" />
                        Export Specialist Report
                    </Button>
                </div>
            </div>
        </Card>
    );
}
