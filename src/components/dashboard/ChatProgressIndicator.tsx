import { motion } from "framer-motion";
import { MessageCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatProgressIndicatorProps {
  currentQuestion: number;
  estimatedTotal: number;
  mode: "quick" | "detailed";
}

export function ChatProgressIndicator({
  currentQuestion,
  estimatedTotal,
  mode,
}: ChatProgressIndicatorProps) {
  const progress = Math.min((currentQuestion / estimatedTotal) * 100, 100);
  const remainingQuestions = Math.max(estimatedTotal - currentQuestion, 0);
  
  // Estimate ~30 seconds per question for quick, ~45 for detailed
  const secondsPerQuestion = mode === "quick" ? 30 : 45;
  const estimatedSecondsRemaining = remainingQuestions * secondsPerQuestion;
  
  const formatTime = (seconds: number) => {
    if (seconds < 60) return "< 1 min";
    const mins = Math.ceil(seconds / 60);
    return `~${mins} min`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-muted/50 rounded-lg px-4 py-2 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <MessageCircle className="h-4 w-4 text-primary" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            Question {currentQuestion}/{estimatedTotal}
          </span>
          <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{formatTime(estimatedSecondsRemaining)} remaining</span>
      </div>
    </motion.div>
  );
}

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 48,
  strokeWidth = 4,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className={cn("transform -rotate-90", className)}
    >
      <circle
        className="stroke-muted"
        fill="none"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <motion.circle
        className="stroke-primary"
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5 }}
        style={{
          strokeDasharray: circumference,
        }}
      />
    </svg>
  );
}
