import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  User,
  FileText,
  MessageSquare,
  Plus,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Download,
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  avatar: string;
  lastVisit: string;
  status: 'active' | 'pending' | 'discharged';
  conditions: string[];
  nextAppointment?: string;
}

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface Prescription {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  duration: string;
  createdDate: string;
  status: 'active' | 'expired';
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 45,
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    avatar: '👨‍💼',
    lastVisit: '2026-01-28',
    status: 'active',
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    nextAppointment: '2026-02-10',
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 38,
    email: 'jane@example.com',
    phone: '+1 (555) 234-5678',
    avatar: '👩‍⚕️',
    lastVisit: '2026-01-25',
    status: 'active',
    conditions: ['Migraines'],
    nextAppointment: '2026-02-05',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    age: 62,
    email: 'robert@example.com',
    phone: '+1 (555) 345-6789',
    avatar: '👴',
    lastVisit: '2026-01-20',
    status: 'pending',
    conditions: ['Heart Disease', 'Hypertension'],
  },
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Doe',
    patientId: '1',
    date: '2026-02-10',
    time: '10:00 AM',
    duration: 30,
    type: 'Checkup',
    status: 'scheduled',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    patientId: '2',
    date: '2026-02-05',
    time: '2:00 PM',
    duration: 45,
    type: 'Consultation',
    status: 'scheduled',
  },
  {
    id: '3',
    patientName: 'Sarah Williams',
    patientId: '4',
    date: '2026-02-02',
    time: '11:30 AM',
    duration: 30,
    type: 'Checkup',
    status: 'completed',
  },
];

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientName: 'John Doe',
    medication: 'Lisinopril',
    dosage: '10mg',
    duration: '30 days',
    createdDate: '2026-01-20',
    status: 'active',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    medication: 'Sumatriptan',
    dosage: '50mg',
    duration: 'As needed',
    createdDate: '2026-01-25',
    status: 'active',
  },
];

export function DoctorPortal() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'discharged':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Doctor Portal</h1>
          <p className="text-gray-600 mt-1">Manage patients and appointments efficiently</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">{mockPatients.length}</p>
              <p className="text-gray-600 text-sm">Total Patients</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">
                {mockAppointments.filter((a) => a.status === 'scheduled').length}
              </p>
              <p className="text-gray-600 text-sm">Scheduled Appointments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600">
                {mockAppointments.filter((a) => a.status === 'completed').length}
              </p>
              <p className="text-gray-600 text-sm">Completed Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-600">{mockPrescriptions.length}</p>
              <p className="text-gray-600 text-sm">Active Prescriptions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        {/* Patients Tab */}
        <TabsContent value="patients" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {mockPatients.map((patient) => (
              <Card
                key={patient.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedPatient(patient)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="text-4xl">{patient.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{patient.name}</h3>
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <p>Age: {patient.age}</p>
                          <p>📧 {patient.email}</p>
                          <p>📱 {patient.phone}</p>
                          <p>Last visit: {patient.lastVisit}</p>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Conditions:</p>
                          <div className="flex gap-1 flex-wrap">
                            {patient.conditions.map((condition) => (
                              <Badge key={condition} variant="secondary">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          {mockAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{appointment.patientName}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                        <p className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> {appointment.date}
                        </p>
                        <p className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {appointment.time}
                        </p>
                        <p>Duration: {appointment.duration} min</p>
                        <p>Type: {appointment.type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={getStatusColor(appointment.status)}
                      variant="secondary"
                    >
                      {appointment.status === 'completed' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {appointment.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-4">
          {mockPrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <FileText className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{prescription.patientName}</h3>
                        <Badge className={getStatusColor(prescription.status)}>
                          {prescription.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>Medication: {prescription.medication}</p>
                        <p>Dosage: {prescription.dosage}</p>
                        <p>Duration: {prescription.duration}</p>
                        <p>Created: {prescription.createdDate}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Print
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Patient Details Sidebar */}
      {selectedPatient && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{selectedPatient.name}</h3>
              <p className="text-gray-600">{selectedPatient.age} years old</p>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Email:</span> {selectedPatient.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {selectedPatient.phone}
              </p>
              <p>
                <span className="font-semibold">Last Visit:</span> {selectedPatient.lastVisit}
              </p>
              {selectedPatient.nextAppointment && (
                <p>
                  <span className="font-semibold">Next Appointment:</span>{' '}
                  {selectedPatient.nextAppointment}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Button className="w-full gap-2">
                <MessageSquare className="h-4 w-4" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <FileText className="h-4 w-4" />
                View Records
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
