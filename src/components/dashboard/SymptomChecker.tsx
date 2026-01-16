import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { 
  Brain, 
  Send, 
  X, 
  Loader2, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react";

interface Prediction {
  disease: string;
  confidence: number;
  explanation: string;
  severity: "low" | "medium" | "high";
}

interface SymptomCheckerProps {
  onResult?: (result: { symptoms: string[]; predictions: Prediction[] }) => void;
}

export const SymptomChecker = ({ onResult }: SymptomCheckerProps) => {
  const [symptoms, setSymptoms] = useState("");
  const [symptomTags, setSymptomTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);

  const addSymptom = () => {
    if (symptoms.trim() && !symptomTags.includes(symptoms.trim().toLowerCase())) {
      setSymptomTags([...symptomTags, symptoms.trim().toLowerCase()]);
      setSymptoms("");
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptomTags(symptomTags.filter((s) => s !== symptom));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addSymptom();
    }
  };

  const analyzeSymptoms = async () => {
    if (symptomTags.length === 0) return;
    
    setIsAnalyzing(true);
    setPredictions(null);

    // Simulated AI analysis - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockPredictions: Prediction[] = [
      {
        disease: "Common Cold",
        confidence: 78,
        explanation: "Based on your symptoms of headache, fatigue, and sore throat, this is a common viral infection affecting the upper respiratory system.",
        severity: "low",
      },
      {
        disease: "Influenza",
        confidence: 52,
        explanation: "Flu symptoms often include fever, body aches, and fatigue. Consider getting tested for confirmation.",
        severity: "medium",
      },
      {
        disease: "Allergic Rhinitis",
        confidence: 35,
        explanation: "Seasonal allergies can cause similar symptoms including nasal congestion and fatigue.",
        severity: "low",
      },
    ];

    setPredictions(mockPredictions);
    setIsAnalyzing(false);
    onResult?.({ symptoms: symptomTags, predictions: mockPredictions });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-success/10 text-success";
      case "medium":
        return "bg-warning/10 text-warning";
      case "high":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return "bg-success";
    if (confidence >= 40) return "bg-warning";
    return "bg-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Symptom Input */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-medium">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg">Symptom Checker</h2>
            <p className="text-sm text-muted-foreground">Describe your symptoms for AI analysis</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Enter a symptom (e.g., headache, fever, fatigue)..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[100px] resize-none pr-12"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute bottom-3 right-3"
              onClick={addSymptom}
              disabled={!symptoms.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Symptom Tags */}
          <AnimatePresence>
            {symptomTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2"
              >
                {symptomTags.map((symptom) => (
                  <motion.span
                    key={symptom}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm px-3 py-1.5 rounded-full"
                  >
                    {symptom}
                    <button
                      onClick={() => removeSymptom(symptom)}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="hero"
            className="w-full"
            onClick={analyzeSymptoms}
            disabled={symptomTags.length === 0 || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Analyze Symptoms
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {predictions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="bg-card rounded-2xl border border-border p-6 shadow-medium">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-lg">Analysis Results</h2>
                  <p className="text-sm text-muted-foreground">Potential conditions based on your symptoms</p>
                </div>
              </div>

              <div className="space-y-4">
                {predictions.map((prediction, index) => (
                  <motion.div
                    key={prediction.disease}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-muted/30 rounded-xl p-5 border border-border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{prediction.disease}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(prediction.severity)}`}>
                          {prediction.severity} risk
                        </span>
                      </div>
                      <span className="text-lg font-bold text-foreground">
                        {prediction.confidence}%
                      </span>
                    </div>
                    
                    {/* Confidence bar */}
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-full rounded-full ${getConfidenceColor(prediction.confidence)}`}
                      />
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{prediction.explanation}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Warning card */}
            <div className="bg-warning/5 border border-warning/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Important Reminder</h4>
                  <p className="text-sm text-muted-foreground">
                    These predictions are based on AI analysis and should not be used for self-diagnosis. 
                    Please consult a healthcare professional for proper evaluation and treatment.
                  </p>
                </div>
              </div>
            </div>

            <MedicalDisclaimer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
