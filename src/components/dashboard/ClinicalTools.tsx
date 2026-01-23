import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Stethoscope,
  TestTube,
  FileText,
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  Activity,
  CheckCircle2,
  XCircle,
  Copy,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Red Flag Detection Engine
interface RedFlag {
  condition: string;
  symptoms: string[];
  detected: boolean;
  urgency: "critical" | "high" | "moderate";
  action: string;
}

const redFlagPatterns: RedFlag[] = [
  {
    condition: "Potential Stroke (FAST)",
    symptoms: ["facial drooping", "arm weakness", "speech difficulty", "sudden confusion", "severe headache"],
    detected: false,
    urgency: "critical",
    action: "Call 911 immediately",
  },
  {
    condition: "Heart Attack Signs",
    symptoms: ["chest pain", "chest pressure", "shortness of breath", "arm pain", "jaw pain", "cold sweat"],
    detected: false,
    urgency: "critical",
    action: "Call 911 immediately",
  },
  {
    condition: "Sepsis Warning",
    symptoms: ["high fever", "rapid heart rate", "confusion", "extreme pain", "clammy skin"],
    detected: false,
    urgency: "critical",
    action: "Seek emergency care immediately",
  },
  {
    condition: "Neurological Emergency",
    symptoms: ["sudden vision loss", "severe dizziness", "loss of consciousness", "seizure", "numbness on one side"],
    detected: false,
    urgency: "critical",
    action: "Call 911 immediately",
  },
  {
    condition: "Severe Allergic Reaction",
    symptoms: ["throat swelling", "difficulty breathing", "hives spreading", "dizziness", "rapid pulse"],
    detected: false,
    urgency: "critical",
    action: "Use epinephrine if available, call 911",
  },
];

interface RedFlagDetectorProps {
  userSymptoms: string[];
  onEmergencyAction?: () => void;
}

export function RedFlagDetector({ userSymptoms, onEmergencyAction }: RedFlagDetectorProps) {
  const normalizedSymptoms = userSymptoms.map(s => s.toLowerCase());
  
  const detectedFlags = redFlagPatterns.map(pattern => {
    const matchedSymptoms = pattern.symptoms.filter(s => 
      normalizedSymptoms.some(us => us.includes(s) || s.includes(us))
    );
    return {
      ...pattern,
      detected: matchedSymptoms.length >= 2,
      matchedSymptoms,
      matchScore: matchedSymptoms.length / pattern.symptoms.length,
    };
  }).filter(f => f.detected);

  if (detectedFlags.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6"
    >
      <Card className="border-destructive bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            Critical Warning Detected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {detectedFlags.map((flag, i) => (
            <div key={i} className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-destructive">{flag.condition}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Matching symptoms: {flag.matchedSymptoms.join(", ")}
                  </p>
                  <p className="text-sm font-medium mt-2">{flag.action}</p>
                </div>
                <Badge variant="destructive" className="flex-shrink-0">
                  {flag.urgency.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button 
              variant="destructive" 
              className="flex-1 gap-2"
              onClick={() => window.location.href = "tel:911"}
            >
              <Phone className="w-4 h-4" />
              Call 911
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 gap-2 border-destructive text-destructive hover:bg-destructive/10"
              onClick={onEmergencyAction}
            >
              <MapPin className="w-4 h-4" />
              Find Nearest ER
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Test Recommendation Engine
interface TestRecommendation {
  testName: string;
  type: "blood" | "imaging" | "vital" | "other";
  reason: string;
  priority: "high" | "medium" | "low";
  timeframe: string;
}

interface TestRecommendationsProps {
  symptoms: string[];
  predictions: any[];
}

export function TestRecommendations({ symptoms, predictions }: TestRecommendationsProps) {
  const [expanded, setExpanded] = useState(false);

  // Generate test recommendations based on symptoms and predictions
  const getRecommendations = (): TestRecommendation[] => {
    const recommendations: TestRecommendation[] = [];
    const symptomLower = symptoms.map(s => s.toLowerCase()).join(" ");
    
    // Fever-related tests
    if (symptomLower.includes("fever") || symptomLower.includes("temperature")) {
      recommendations.push({
        testName: "Complete Blood Count (CBC)",
        type: "blood",
        reason: "Fever with other symptoms suggests possible infection - CBC helps identify if bacterial or viral",
        priority: "high",
        timeframe: "Within 24-48 hours",
      });
    }
    
    // Fatigue-related tests
    if (symptomLower.includes("fatigue") || symptomLower.includes("tired") || symptomLower.includes("weakness")) {
      recommendations.push({
        testName: "Thyroid Function Panel",
        type: "blood",
        reason: "Persistent fatigue can indicate thyroid dysfunction",
        priority: "medium",
        timeframe: "Within 1 week",
      });
      recommendations.push({
        testName: "Iron Studies & Ferritin",
        type: "blood",
        reason: "Fatigue often related to iron deficiency anemia",
        priority: "medium",
        timeframe: "Within 1 week",
      });
    }
    
    // Chest symptoms
    if (symptomLower.includes("chest") || symptomLower.includes("heart") || symptomLower.includes("breath")) {
      recommendations.push({
        testName: "ECG / EKG",
        type: "other",
        reason: "Chest symptoms warrant heart rhythm evaluation",
        priority: "high",
        timeframe: "Same day if pain is present",
      });
      recommendations.push({
        testName: "Chest X-ray",
        type: "imaging",
        reason: "Evaluate lungs and heart size",
        priority: "high",
        timeframe: "Within 24-48 hours",
      });
    }
    
    // Digestive symptoms
    if (symptomLower.includes("stomach") || symptomLower.includes("nausea") || symptomLower.includes("abdominal")) {
      recommendations.push({
        testName: "Comprehensive Metabolic Panel",
        type: "blood",
        reason: "Assess liver, kidney function and electrolytes",
        priority: "medium",
        timeframe: "Within 3-5 days",
      });
    }
    
    // Blood pressure check for headaches, dizziness
    if (symptomLower.includes("headache") || symptomLower.includes("dizzy") || symptomLower.includes("vision")) {
      recommendations.push({
        testName: "Blood Pressure Monitoring",
        type: "vital",
        reason: "Headaches and dizziness can indicate blood pressure issues",
        priority: "high",
        timeframe: "Immediately",
      });
    }
    
    // Default if no specific recommendations
    if (recommendations.length === 0) {
      recommendations.push({
        testName: "Basic Health Panel",
        type: "blood",
        reason: "General health screening based on symptoms",
        priority: "low",
        timeframe: "At next routine visit",
      });
    }
    
    return recommendations;
  };

  const recommendations = getRecommendations();
  const typeIcons = {
    blood: TestTube,
    imaging: Activity,
    vital: Stethoscope,
    other: FileText,
  };

  return (
    <Card>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TestTube className="w-5 h-5 text-primary" />
            Recommended Tests
            <Badge variant="secondary">{recommendations.length}</Badge>
          </CardTitle>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0">
              <div className="space-y-3">
                {recommendations.map((rec, i) => {
                  const Icon = typeIcons[rec.type];
                  return (
                    <div 
                      key={i}
                      className="p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          rec.priority === "high" && "bg-destructive/10",
                          rec.priority === "medium" && "bg-warning/10",
                          rec.priority === "low" && "bg-muted"
                        )}>
                          <Icon className={cn(
                            "w-4 h-4",
                            rec.priority === "high" && "text-destructive",
                            rec.priority === "medium" && "text-warning",
                            rec.priority === "low" && "text-muted-foreground"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{rec.testName}</h4>
                            <Badge variant="outline" className="text-xs">
                              {rec.timeframe}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {rec.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <p className="text-xs text-muted-foreground mt-4 italic">
                * These are AI-suggested tests for discussion with your healthcare provider. 
                Your doctor will determine which tests are actually needed.
              </p>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// SOAP Notes Generator
interface SOAPNotesProps {
  symptoms: string[];
  predictions: any[];
  recommendations: string[];
  urgencyLevel: string;
  patientContext?: {
    age?: number;
    gender?: string;
    conditions?: string[];
    medications?: string[];
  };
}

export function SOAPNotesGenerator({ 
  symptoms, 
  predictions, 
  recommendations,
  urgencyLevel,
  patientContext 
}: SOAPNotesProps) {
  const [expanded, setExpanded] = useState(false);

  const generateSOAPNotes = () => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    // Subjective
    const subjective = `
Patient reports: ${symptoms.slice(0, 3).join("; ")}.
${patientContext?.age ? `Age: ${patientContext.age} years.` : ""}
${patientContext?.gender ? `Gender: ${patientContext.gender}.` : ""}
${patientContext?.conditions?.length ? `Known conditions: ${patientContext.conditions.join(", ")}.` : ""}
${patientContext?.medications?.length ? `Current medications: ${patientContext.medications.join(", ")}.` : ""}
    `.trim();

    // Objective (AI analysis)
    const objective = `
AI Symptom Analysis performed at ${time} on ${date}.
Analysis confidence: ${predictions[0]?.confidence ? Math.round(predictions[0].confidence * 100) + "%" : "N/A"}.
Urgency classification: ${urgencyLevel?.replace("_", " ").toUpperCase() || "Not assessed"}.
    `.trim();

    // Assessment
    const assessment = predictions.slice(0, 3).map((p, i) => 
      `${i + 1}. ${p.condition} (${Math.round(p.confidence * 100)}% confidence) - ${p.severity} severity`
    ).join("\n");

    // Plan
    const plan = recommendations.slice(0, 5).map((r, i) => 
      `${i + 1}. ${r}`
    ).join("\n");

    return { subjective, objective, assessment, plan, date, time };
  };

  const notes = generateSOAPNotes();

  const copyToClipboard = () => {
    const fullNotes = `
SOAP NOTES
Date: ${notes.date} | Time: ${notes.time}

SUBJECTIVE:
${notes.subjective}

OBJECTIVE:
${notes.objective}

ASSESSMENT:
${notes.assessment}

PLAN:
${notes.plan}

---
Generated by Aura Aid AI - For clinical review only
    `.trim();
    
    navigator.clipboard.writeText(fullNotes);
    toast.success("SOAP notes copied to clipboard");
  };

  return (
    <Card>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            Clinical SOAP Notes
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Doctor-Ready</Badge>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0 space-y-4">
              {/* Subjective */}
              <div>
                <h4 className="font-semibold text-sm text-primary mb-2">S - Subjective</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line bg-muted/50 p-3 rounded-lg">
                  {notes.subjective}
                </p>
              </div>
              
              <Separator />
              
              {/* Objective */}
              <div>
                <h4 className="font-semibold text-sm text-primary mb-2">O - Objective</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line bg-muted/50 p-3 rounded-lg">
                  {notes.objective}
                </p>
              </div>
              
              <Separator />
              
              {/* Assessment */}
              <div>
                <h4 className="font-semibold text-sm text-primary mb-2">A - Assessment</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line bg-muted/50 p-3 rounded-lg">
                  {notes.assessment || "No predictions available"}
                </p>
              </div>
              
              <Separator />
              
              {/* Plan */}
              <div>
                <h4 className="font-semibold text-sm text-primary mb-2">P - Plan</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line bg-muted/50 p-3 rounded-lg">
                  {notes.plan || "No recommendations available"}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={copyToClipboard}
                >
                  <Copy className="w-4 h-4" />
                  Copy Notes
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground italic">
                * These notes are AI-generated and should be reviewed by a healthcare professional 
                before being added to official medical records.
              </p>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// Differential Diagnosis Matrix
interface DifferentialDiagnosisProps {
  predictions: any[];
  symptoms: string[];
}

export function DifferentialDiagnosisMatrix({ predictions, symptoms }: DifferentialDiagnosisProps) {
  const [expanded, setExpanded] = useState(false);

  if (!predictions?.length) return null;

  // Extract unique symptoms from predictions
  const allSymptoms = new Set<string>();
  predictions.forEach(p => {
    if (p.influencingSymptoms) {
      p.influencingSymptoms.forEach((s: string) => allSymptoms.add(s));
    }
  });
  const symptomList = Array.from(allSymptoms).slice(0, 6);

  return (
    <Card>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Stethoscope className="w-5 h-5 text-primary" />
            Differential Diagnosis Matrix
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Advanced</Badge>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Condition</TableHead>
                      <TableHead className="text-center">Probability</TableHead>
                      {symptomList.map((s, i) => (
                        <TableHead key={i} className="text-center text-xs min-w-[80px]">
                          {s.slice(0, 15)}...
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {predictions.slice(0, 5).map((pred, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{pred.condition}</TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant={pred.confidence >= 0.7 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {Math.round(pred.confidence * 100)}%
                          </Badge>
                        </TableCell>
                        {symptomList.map((symptom, j) => {
                          const hasMatch = pred.influencingSymptoms?.some((s: string) => 
                            s.toLowerCase().includes(symptom.toLowerCase()) ||
                            symptom.toLowerCase().includes(s.toLowerCase())
                          );
                          return (
                            <TableCell key={j} className="text-center">
                              {hasMatch ? (
                                <CheckCircle2 className="w-4 h-4 text-success mx-auto" />
                              ) : (
                                <XCircle className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4 italic">
                * This matrix shows symptom-condition correlations. Green checks indicate matching symptoms.
              </p>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
