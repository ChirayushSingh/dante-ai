import { motion } from "framer-motion";
import { Activity, AlertCircle, CheckCircle2, ListChecks, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrgencyCard } from "./UrgencyBadge";
import { ExplainableResults } from "./ExplainableResults";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { PrivacyBadges } from "./PrivacyBadges";
import { usePdfReport } from "@/hooks/usePdfReport";
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
  const { generateReport, isGenerating } = usePdfReport();

  const handleDownloadReport = () => {
    generateReport({
      date: new Date(),
      symptoms: [],
      predictions: assessment.predictions,
      urgencyLevel: assessment.urgencyLevel,
      urgencyExplanation: assessment.urgencyExplanation,
      summary: assessment.summary,
      recommendations: assessment.recommendations,
    });
  };

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

      {/* Explainable Predictions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="w-5 h-5 text-primary" />
            Possible Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExplainableResults predictions={assessment.predictions} />
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button onClick={handleDownloadReport} variant="outline" className="gap-2" disabled={isGenerating}>
          <Download className="w-4 h-4" />
          {isGenerating ? "Generating..." : "Download Report"}
        </Button>
        <Button onClick={onNewCheck} variant="default" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Start New Check
        </Button>
      </div>

      {/* Privacy */}
      <div className="flex justify-center">
        <PrivacyBadges />
      </div>
    </motion.div>
  );
}