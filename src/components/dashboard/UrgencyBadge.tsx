import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Clock, AlertOctagon } from "lucide-react";

type UrgencyLevel = "self_care" | "consult_soon" | "urgent" | "emergency";

interface UrgencyBadgeProps {
  level: UrgencyLevel;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const urgencyConfig: Record<UrgencyLevel, {
  label: string;
  description: string;
  icon: typeof CheckCircle;
  colors: string;
  bgColors: string;
}> = {
  self_care: {
    label: "Self-Care",
    description: "Can be managed at home with rest and OTC remedies",
    icon: CheckCircle,
    colors: "text-emerald-600 dark:text-emerald-400",
    bgColors: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  consult_soon: {
    label: "Consult Soon",
    description: "Schedule an appointment within 24-48 hours",
    icon: Clock,
    colors: "text-amber-600 dark:text-amber-400",
    bgColors: "bg-amber-100 dark:bg-amber-900/30",
  },
  urgent: {
    label: "Urgent Care",
    description: "Seek medical attention today",
    icon: AlertTriangle,
    colors: "text-orange-600 dark:text-orange-400",
    bgColors: "bg-orange-100 dark:bg-orange-900/30",
  },
  emergency: {
    label: "Emergency",
    description: "Seek immediate emergency care",
    icon: AlertOctagon,
    colors: "text-red-600 dark:text-red-400",
    bgColors: "bg-red-100 dark:bg-red-900/30",
  },
};

export function UrgencyBadge({ level, showLabel = true, size = "md", className }: UrgencyBadgeProps) {
  const config = urgencyConfig[level];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.colors,
        config.bgColors,
        sizeClasses[size],
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && config.label}
    </span>
  );
}

export function UrgencyCard({ level, explanation }: { level: UrgencyLevel; explanation: string }) {
  const config = urgencyConfig[level];
  const Icon = config.icon;

  return (
    <div className={cn(
      "rounded-xl p-4 border",
      config.bgColors,
      level === "emergency" ? "border-red-300 dark:border-red-800" :
      level === "urgent" ? "border-orange-300 dark:border-orange-800" :
      level === "consult_soon" ? "border-amber-300 dark:border-amber-800" :
      "border-emerald-300 dark:border-emerald-800"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          level === "emergency" ? "bg-red-200 dark:bg-red-900/50" :
          level === "urgent" ? "bg-orange-200 dark:bg-orange-900/50" :
          level === "consult_soon" ? "bg-amber-200 dark:bg-amber-900/50" :
          "bg-emerald-200 dark:bg-emerald-900/50"
        )}>
          <Icon className={cn("w-5 h-5", config.colors)} />
        </div>
        <div className="flex-1">
          <h4 className={cn("font-semibold text-lg", config.colors)}>
            {config.label}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {explanation || config.description}
          </p>
        </div>
      </div>
    </div>
  );
}