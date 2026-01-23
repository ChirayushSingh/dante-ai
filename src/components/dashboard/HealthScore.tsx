import { motion } from "framer-motion";
import { Heart, TrendingUp, Activity, Brain, Apple, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface HealthScoreProps {
  recentChecks: any[];
  profile: any;
  conditions: any[];
}

interface ScoreBreakdown {
  physical: number;
  mental: number;
  lifestyle: number;
  risk: number;
}

export function HealthScore({ recentChecks, profile, conditions }: HealthScoreProps) {
  // Calculate health score based on various factors
  const calculateScore = (): { total: number; breakdown: ScoreBreakdown } => {
    let physical = 80;
    let mental = 75;
    let lifestyle = 70;
    let risk = 85;

    // Adjust based on recent checks
    if (recentChecks?.length) {
      const recentUrgencies = recentChecks.slice(0, 5).map(c => c.urgency_level);
      const urgencyImpact = recentUrgencies.reduce((sum, u) => {
        switch (u) {
          case "emergency": return sum - 25;
          case "urgent": return sum - 15;
          case "consult_soon": return sum - 8;
          case "self_care": return sum - 2;
          default: return sum;
        }
      }, 0);
      physical = Math.max(30, physical + urgencyImpact / recentChecks.length);
    }

    // Adjust based on chronic conditions
    if (conditions?.length) {
      risk = Math.max(40, risk - conditions.length * 8);
    }

    // Profile completeness affects lifestyle score
    if (profile) {
      let completeness = 0;
      if (profile.date_of_birth) completeness += 20;
      if (profile.gender) completeness += 20;
      if (profile.height_cm) completeness += 20;
      if (profile.weight_kg) completeness += 20;
      if (profile.blood_type) completeness += 20;
      lifestyle = Math.min(100, lifestyle + completeness / 5);
    }

    const total = Math.round((physical + mental + lifestyle + risk) / 4);
    
    return {
      total,
      breakdown: {
        physical: Math.round(physical),
        mental: Math.round(mental),
        lifestyle: Math.round(lifestyle),
        risk: Math.round(risk),
      }
    };
  };

  const { total, breakdown } = calculateScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Attention";
  };

  const scoreCategories = [
    { label: "Physical", value: breakdown.physical, icon: Heart, color: "hsl(var(--destructive))" },
    { label: "Mental", value: breakdown.mental, icon: Brain, color: "hsl(var(--info))" },
    { label: "Lifestyle", value: breakdown.lifestyle, icon: Apple, color: "hsl(var(--success))" },
    { label: "Risk Level", value: breakdown.risk, icon: Shield, color: "hsl(var(--warning))" },
  ];

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Health Score
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4">
          {/* Circular Score */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${total * 2.51327} 251.327`}
                initial={{ strokeDasharray: "0 251.327" }}
                animate={{ strokeDasharray: `${total * 2.51327} 251.327` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                className={cn("text-2xl font-bold", getScoreColor(total))}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {total}
              </motion.span>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 min-w-0">
            <p className={cn("font-medium", getScoreColor(total))}>
              {getScoreLabel(total)}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {scoreCategories.map((cat, i) => (
                <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <cat.icon className="w-3 h-3" style={{ color: cat.color }} />
                  <span className="truncate">{cat.label}</span>
                  <span className="font-medium text-foreground ml-auto">{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
