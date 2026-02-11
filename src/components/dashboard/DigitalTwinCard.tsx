import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, ArrowUpRight, Brain, Zap, ShieldCheck } from "lucide-react";

interface DigitalTwinCardProps {
    score?: number;
}

export function DigitalTwinCard({ score = 84 }: DigitalTwinCardProps) {
    // Simple color logic based on score
    const getScoreColor = (s: number) => {
        if (s >= 80) return "text-green-500 stroke-green-500";
        if (s >= 60) return "text-yellow-500 stroke-yellow-500";
        return "text-red-500 stroke-red-500";
    };

    return (
        <Card className="border-none shadow-2xl bg-gradient-to-br from-white via-white to-primary/5 backdrop-blur-md overflow-hidden relative group">
            {/* Decorative background element */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

            <CardHeader className="relative z-10 pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Brain className="w-6 h-6 text-primary" />
                            Your Digital Twin
                        </CardTitle>
                        <CardDescription className="text-base">Real-time AI Health Projection</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none px-3">
                        v1.0 Beta
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                    {/* Radial Score Gauge */}
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="10"
                                className="text-muted/20"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="10"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * score) / 100}
                                strokeLinecap="round"
                                className={getScoreColor(score)}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black">{score}</span>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Health Score</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-2xl bg-muted/50 border border-border/50">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Vitality</p>
                                <p className="text-lg font-bold flex items-center gap-1">
                                    88% <ArrowUpRight className="w-4 h-4 text-green-500" />
                                </p>
                            </div>
                            <div className="p-3 rounded-2xl bg-muted/50 border border-border/50">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Recovery</p>
                                <p className="text-lg font-bold flex items-center gap-1">
                                    72% <Zap className="w-4 h-4 text-primary" />
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-primary mt-1" />
                            <div className="space-y-1">
                                <p className="font-bold text-sm">Optimal Performance</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    You are tracking better than **78%** of users with similar profiles. Your sleep consistency is improving your core vitality.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-muted-foreground">PREDICTED RISK</p>
                        <p className="text-sm font-semibold">Low (12%)</p>
                        <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full w-[12%]" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-muted-foreground">STAMINA TREND</p>
                        <p className="text-sm font-semibold text-green-600">+4.2% week</p>
                        <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[65%]" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-muted-foreground">IMMUNE STATUS</p>
                        <p className="text-sm font-semibold">Strong</p>
                        <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[90%]" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
