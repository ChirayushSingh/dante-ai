import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, Heart, Activity, Droplets } from 'lucide-react';

interface VitalReading {
  time: string;
  heartRate: number;
  bloodPressure: number;
  oxygenSaturation: number;
  temperature: number;
  respiratoryRate: number;
}

interface SmartVitalsDashboardProps {
  readings?: VitalReading[];
}

const generateMockReadings = (): VitalReading[] => {
  const data: VitalReading[] = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i}:00`,
      heartRate: Math.random() * 40 + 60,
      bloodPressure: Math.random() * 20 + 120,
      oxygenSaturation: Math.random() * 5 + 96,
      temperature: Math.random() * 1 + 37,
      respiratoryRate: Math.random() * 5 + 16,
    });
  }
  return data;
};

export function SmartVitalsDashboard({ readings = generateMockReadings() }: SmartVitalsDashboardProps) {
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const newAlerts: string[] = [];
    readings.forEach((reading) => {
      if (reading.heartRate > 100) newAlerts.push('High heart rate detected');
      if (reading.heartRate < 60) newAlerts.push('Low heart rate detected');
      if (reading.oxygenSaturation < 95) newAlerts.push('Low oxygen saturation');
      if (reading.temperature > 38) newAlerts.push('Elevated temperature');
    });
    setAlerts([...new Set(newAlerts)]);
  }, [readings]);

  const latestReading = readings[readings.length - 1];

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Heart Rate Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Heart Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(latestReading.heartRate)} bpm</div>
            <p className="text-xs text-gray-500">Normal: 60-100 bpm</p>
            <TrendingUp className="h-4 w-4 text-green-500 mt-2" />
          </CardContent>
        </Card>

        {/* Blood Pressure Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Blood Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(latestReading.bloodPressure)}/{Math.round(latestReading.bloodPressure - 40)}</div>
            <p className="text-xs text-gray-500">Normal: 120/80 mmHg</p>
          </CardContent>
        </Card>

        {/* Oxygen Saturation Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplets className="h-4 w-4 text-cyan-500" />
              SpO2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(latestReading.oxygenSaturation)}%</div>
            <p className="text-xs text-gray-500">Normal: 95-100%</p>
          </CardContent>
        </Card>

        {/* Temperature Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestReading.temperature.toFixed(1)}°C</div>
            <p className="text-xs text-gray-500">Normal: 36.5-37.5°C</p>
          </CardContent>
        </Card>

        {/* Respiratory Rate Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resp. Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(latestReading.respiratoryRate)} bpm</div>
            <p className="text-xs text-gray-500">Normal: 12-20 bpm</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {alerts.slice(0, 3).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Heart Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Heart Rate Trend</CardTitle>
          <CardDescription>Last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={readings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[50, 110]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="heartRate"
                stroke="#ef4444"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Oxygen & Temperature */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Blood Oxygen Level</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={readings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[94, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="oxygenSaturation"
                  fill="#06b6d4"
                  stroke="#0891b2"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Body Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={readings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[35, 40]} />
                <Tooltip />
                <Bar
                  dataKey="temperature"
                  fill="#f59e0b"
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>24-Hour Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Avg Heart Rate</p>
              <p className="text-lg font-semibold">
                {Math.round(readings.reduce((sum, r) => sum + r.heartRate, 0) / readings.length)} bpm
              </p>
            </div>
            <div>
              <p className="text-gray-600">Avg SpO2</p>
              <p className="text-lg font-semibold">
                {Math.round(readings.reduce((sum, r) => sum + r.oxygenSaturation, 0) / readings.length)}%
              </p>
            </div>
            <div>
              <p className="text-gray-600">Avg Temp</p>
              <p className="text-lg font-semibold">
                {(readings.reduce((sum, r) => sum + r.temperature, 0) / readings.length).toFixed(1)}°C
              </p>
            </div>
            <div>
              <p className="text-gray-600">Avg Resp. Rate</p>
              <p className="text-lg font-semibold">
                {Math.round(readings.reduce((sum, r) => sum + r.respiratoryRate, 0) / readings.length)} bpm
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
