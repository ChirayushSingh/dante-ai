import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Prediction {
  condition: string;
  confidence: number;
  explanation: string;
  severity: "mild" | "moderate" | "severe";
  influencingSymptoms?: string[];
  ruledOutReasons?: string[];
  whatCouldChange?: string[];
}

interface ExplainableResultsProps {
  predictions: Prediction[];
  userSymptoms?: string[];
}

export function ExplainableResults({ predictions, userSymptoms = [] }: ExplainableResultsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [showComparison, setShowComparison] = useState(false);

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return "text-emerald-600 dark:text-emerald-400";
    if (confidence >= 0.4) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.7) return "High confidence";
    if (confidence >= 0.4) return "Moderate confidence";
    return "Low confidence — more info needed";
  };

  return (
    <div className="space-y-4">
      {/* Comparison Toggle */}
      {predictions.length > 1 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {showComparison ? "Detailed View" : "Compare Side-by-Side"}
          </Button>
        </div>
      )}

      {/* Comparison View */}
      {showComparison && predictions.length > 1 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-muted/30 rounded-xl p-4 mb-4"
        >
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Condition Comparison
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Condition</th>
                  <th className="text-center py-2 px-4">Confidence</th>
                  <th className="text-center py-2 px-4">Severity</th>
                  <th className="text-center py-2 pl-4">Symptom Match</th>
                </tr>
              </thead>
              <tbody>
                {predictions.slice(0, 3).map((pred, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-3 pr-4 font-medium">{pred.condition}</td>
                    <td className="text-center py-3 px-4">
                      <span className={cn("font-bold", getConfidenceColor(pred.confidence))}>
                        {Math.round(pred.confidence * 100)}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs capitalize",
                        pred.severity === "mild" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                        pred.severity === "moderate" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                        pred.severity === "severe" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        {pred.severity}
                      </span>
                    </td>
                    <td className="text-center py-3 pl-4">
                      {pred.influencingSymptoms?.length || Math.round(pred.confidence * userSymptoms.length)} / {userSymptoms.length || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Detailed Cards */}
      {predictions.map((prediction, index) => (
        <motion.div
          key={prediction.condition}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border rounded-xl overflow-hidden"
        >
          {/* Header */}
          <button
            onClick={() => toggleExpanded(index)}
            className="w-full p-4 flex items-start justify-between bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 text-left">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-lg">{prediction.condition}</h4>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  prediction.severity === "mild" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                  prediction.severity === "moderate" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                  prediction.severity === "severe" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                  {prediction.severity}
                </span>
              </div>

              {/* Confidence Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 max-w-[200px]">
                  <Progress value={prediction.confidence * 100} className="h-2" />
                </div>
                <span className={cn("text-sm font-medium", getConfidenceColor(prediction.confidence))}>
                  {Math.round(prediction.confidence * 100)}%
                </span>
                <span className={cn("text-xs", getConfidenceColor(prediction.confidence))}>
                  {getConfidenceLabel(prediction.confidence)}
                </span>
              </div>
            </div>
            
            {expandedIndex === index ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {/* Expanded Content */}
          <AnimatePresence>
            {expandedIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t"
              >
                <div className="p-4 space-y-4 bg-muted/20">
                  {/* Plain Language Explanation */}
                  <div className="bg-background rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Why this condition?</p>
                        <p className="text-sm text-muted-foreground">
                          {prediction.explanation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Key Influencing Symptoms */}
                  {prediction.influencingSymptoms && prediction.influencingSymptoms.length > 0 && (
                    <div className="bg-background rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-emerald-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium mb-2">Key symptoms influencing this result</p>
                          <div className="flex flex-wrap gap-2">
                            {prediction.influencingSymptoms.map((symptom, i) => (
                              <span
                                key={i}
                                className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-2 py-1 rounded-full"
                              >
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* What Could Change This */}
                  {prediction.whatCouldChange && prediction.whatCouldChange.length > 0 && (
                    <div className="bg-background rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium mb-2">What could change this prediction?</p>
                          <ul className="space-y-1">
                            {prediction.whatCouldChange.map((item, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <ArrowRight className="h-3 w-3 mt-1.5 text-amber-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ruled Out Reasons */}
                  {index === 0 && predictions.length > 1 && (
                    <div className="bg-background rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <TrendingDown className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium mb-2">Why other conditions are less likely</p>
                          <ul className="space-y-2">
                            {predictions.slice(1, 3).map((otherPred, i) => (
                              <li key={i} className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">
                                  {otherPred.condition}
                                </span>
                                : Lower match ({Math.round(otherPred.confidence * 100)}%) — 
                                {otherPred.ruledOutReasons?.[0] || "fewer matching symptoms"}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
