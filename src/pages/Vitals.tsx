import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Heart, Moon, Footprints, Info, RefreshCw } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const heartRateData = [
    { time: "00:00", bpm: 62 },
    { time: "04:00", bpm: 58 },
    { time: "08:00", bpm: 75 },
    { time: "12:00", bpm: 82 },
    { time: "16:00", bpm: 78 },
    { time: "20:00", bpm: 72 },
    { time: "23:59", bpm: 65 },
];

const activityData = [
    { day: "Mon", steps: 8400 },
    { day: "Tue", steps: 10200 },
    { day: "Wed", steps: 7600 },
    { day: "Thu", steps: 9800 },
    { day: "Fri", steps: 12400 },
    { day: "Sat", steps: 11000 },
    { day: "Sun", steps: 6500 },
];

export default function Vitals() {
    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Vitals & Wearables</h1>
                        <p className="text-muted-foreground text-lg">Real-time health monitoring and trend analysis.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary">
                            <RefreshCw className="w-3 h-3 mr-2 animate-spin-slow" />
                            Syncing with Wearables
                        </Badge>
                        <Button variant="outline" size="sm">
                            Connect Device
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                Current Heart Rate
                                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">72 BPM</div>
                            <p className="text-xs text-muted-foreground mt-1">Normal Resting Range</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                Daily Steps
                                <Footprints className="w-4 h-4 text-primary" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">9,842</div>
                            <p className="text-xs text-green-500 mt-1">98% of Daily Goal</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                Sleep Duration
                                <Moon className="w-4 h-4 text-indigo-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">7h 42m</div>
                            <p className="text-xs text-muted-foreground mt-1">Quality: Excellent</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                O2 Saturation
                                <Activity className="w-4 h-4 text-blue-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">98%</div>
                            <p className="text-xs text-muted-foreground mt-1">Optimal Range</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-7">
                    <Card className="lg:col-span-4 border-none shadow-lg bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Heart Rate Trends</CardTitle>
                            <CardDescription>Continuous monitoring over the last 24 hours</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={heartRateData}>
                                    <defs>
                                        <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="bpm" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorBpm)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3 border-none shadow-lg bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Weekly Activity</CardTitle>
                            <CardDescription>Step count comparison across the week</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line type="monotone" dataKey="steps" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold text-primary">AI Insight</p>
                        <p className="text-muted-foreground">Your resting heart rate has been slightly higher than usual this morning. This can sometimes occur with caffeine intake or high stress. We will continue to monitor your baseline.</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
