import { motion } from "framer-motion";
import { Activity, AlertCircle, CheckCircle2, ListChecks, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UrgencyCard } from "./UrgencyBadge";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { cn } from "@/lib/utils";

interface Prediction {
  condition: string;
  confidence: number;
  explanation: string;
  severity: "mild" | "moderate" | "severe";
}

interface Assessment {
  predictions: Prediction[];
  urgencyLevel: "self_care" | "consult_soon" | "urgent" | "emergency";
  urgencyExplanation: string;
  summary: string;
  recommendations: string[];
}

interface AssessmentResultsProps {
  assessment: Assessment;
  onNewCheck: () => void;
}

const severityColors = {
  mild: "text-emerald-600 dark:text-emerald-400",
  moderate: "text-amber-600 dark:text-amber-400",
  severe: "text-red-600 dark:text-red-400",
};

const severityBg = {
  mild: "bg-emerald-100 dark:bg-emerald-900/30",
  moderate: "bg-amber-100 dark:bg-amber-900/30",
  severe: "bg-red-100 dark:bg-red-900/30",
};

export function AssessmentResults({ assessment, onNewCheck }: AssessmentResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Urgency Section */}
      <UrgencyCard
        level={assessment.urgencyLevel}
        explanation={assessment.urgencyExplanation}
      />

      {/* Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-primary" />
            Assessment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {assessment.summary}
          </p>
        </CardContent>
      </Card>

      {/* Predictions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="w-5 h-5 text-primary" />
            Possible Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assessment.predictions.map((prediction, index) => (
            <motion.div
              key={prediction.condition}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h4 className="font-medium">{prediction.condition}</h4>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full inline-block mt-1",
                    severityColors[prediction.severity],
                    severityBg[prediction.severity]
                  )}>
                    {prediction.severity.charAt(0).toUpperCase() + prediction.severity.slice(1)} Severity
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(prediction.confidence * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">confidence</div>
                </div>
              </div>
              <Progress
                value={prediction.confidence * 100}
                className="h-2 mb-3"
              />
              <p className="text-sm text-muted-foreground">
                {prediction.explanation}
              </p>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ListChecks className="w-5 h-5 text-primary" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {assessment.recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{rec}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />

      {/* New Check Button */}
      <div className="flex justify-center">
        <Button onClick={onNewCheck} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Start New Symptom Check
        </Button>
      </div>
    </motion.div>
  );
}