import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User, Heart, Pill, AlertTriangle, Plus, X, Save, Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const {
    profile,
    conditions,
    allergies,
    medications,
    isLoading,
    updateProfile,
    addCondition,
    deleteCondition,
    addAllergy,
    deleteAllergy,
    addMedication,
    deleteMedication,
    getAge,
  } = useHealthProfile();

  const [newCondition, setNewCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");

  // Profile form state
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    date_of_birth: profile?.date_of_birth || "",
    gender: profile?.gender || "",
    height_cm: profile?.height_cm?.toString() || "",
    weight_kg: profile?.weight_kg?.toString() || "",
    blood_type: profile?.blood_type || "",
  });

  const handleSaveProfile = () => {
    updateProfile.mutate({
      full_name: formData.full_name || null,
      date_of_birth: formData.date_of_birth || null,
      gender: formData.gender || null,
      height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      blood_type: formData.blood_type || null,
    });
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      addCondition.mutate({ condition_name: newCondition.trim() });
      setNewCondition("");
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      addAllergy.mutate({ allergen: newAllergy.trim() });
      setNewAllergy("");
    }
  };

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      addMedication.mutate({ medication_name: newMedication.trim() });
      setNewMedication("");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const age = getAge();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Health Profile</h1>
          <p className="text-muted-foreground">
            Your personal health information helps our AI provide more accurate assessments
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Basic details about you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                    />
                    {age && (
                      <p className="text-xs text-muted-foreground">Age: {age} years</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height_cm}
                      onChange={(e) => setFormData(prev => ({ ...prev, height_cm: e.target.value }))}
                      placeholder="170"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight_kg}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: e.target.value }))}
                      placeholder="70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Blood Type</Label>
                    <Select
                      value={formData.blood_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, blood_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"].map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <Button
                  onClick={handleSaveProfile}
                  disabled={updateProfile.isPending}
                  className="w-full"
                >
                  {updateProfile.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Medical History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Chronic Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Chronic Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="e.g., Diabetes, Hypertension"
                    onKeyDown={(e) => e.key === "Enter" && handleAddCondition()}
                  />
                  <Button size="icon" onClick={handleAddCondition} disabled={addCondition.isPending}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {conditions.map((condition) => (
                    <Badge key={condition.id} variant="secondary" className="gap-1">
                      {condition.condition_name}
                      <button
                        onClick={() => deleteCondition.mutate(condition.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  {conditions.length === 0 && (
                    <p className="text-sm text-muted-foreground">No conditions added</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Allergies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="e.g., Penicillin, Peanuts"
                    onKeyDown={(e) => e.key === "Enter" && handleAddAllergy()}
                  />
                  <Button size="icon" onClick={handleAddAllergy} disabled={addAllergy.isPending}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy) => (
                    <Badge key={allergy.id} variant="destructive" className="gap-1">
                      {allergy.allergen}
                      <button
                        onClick={() => deleteAllergy.mutate(allergy.id)}
                        className="ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  {allergies.length === 0 && (
                    <p className="text-sm text-muted-foreground">No allergies added</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    placeholder="e.g., Metformin, Lisinopril"
                    onKeyDown={(e) => e.key === "Enter" && handleAddMedication()}
                  />
                  <Button size="icon" onClick={handleAddMedication} disabled={addMedication.isPending}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medications.map((med) => (
                    <Badge key={med.id} variant="outline" className="gap-1">
                      {med.medication_name}
                      <button
                        onClick={() => deleteMedication.mutate(med.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  {medications.length === 0 && (
                    <p className="text-sm text-muted-foreground">No medications added</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}