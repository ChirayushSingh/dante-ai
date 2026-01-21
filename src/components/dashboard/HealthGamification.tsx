import { motion } from "framer-motion";
import { 
  Trophy, 
  Flame, 
  Star, 
  Target, 
  Heart, 
  Droplets,
  Moon,
  Footprints,
  Award,
  Zap
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalCheckins: number;
  lastCheckin: Date | null;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: typeof Trophy;
  earned: boolean;
  earnedAt?: Date;
  color: string;
}

interface HealthGoal {
  id: string;
  name: string;
  icon: typeof Heart;
  current: number;
  target: number;
  unit: string;
  color: string;
}

const defaultBadges: Badge[] = [
  { id: "first-check", name: "First Step", description: "Complete your first symptom check", icon: Star, earned: true, color: "text-warning" },
  { id: "streak-7", name: "Week Warrior", description: "7-day check-in streak", icon: Flame, earned: false, color: "text-destructive" },
  { id: "profile-complete", name: "Full Profile", description: "Complete your health profile", icon: Heart, earned: true, color: "text-primary" },
  { id: "streak-30", name: "Monthly Master", description: "30-day check-in streak", icon: Trophy, earned: false, color: "text-warning" },
  { id: "knowledge-5", name: "Health Scholar", description: "Read 5 health articles", icon: Award, earned: false, color: "text-info" },
  { id: "chat-10", name: "Curious Mind", description: "Ask 10 health questions", icon: Zap, earned: false, color: "text-accent" },
];

const defaultGoals: HealthGoal[] = [
  { id: "steps", name: "Daily Steps", icon: Footprints, current: 6500, target: 10000, unit: "steps", color: "bg-primary" },
  { id: "water", name: "Hydration", icon: Droplets, current: 5, target: 8, unit: "glasses", color: "bg-info" },
  { id: "sleep", name: "Sleep", icon: Moon, current: 7, target: 8, unit: "hours", color: "bg-accent" },
];

interface HealthGamificationProps {
  streakData?: StreakData;
  badges?: Badge[];
  goals?: HealthGoal[];
}

export const HealthGamification = ({
  streakData = { currentStreak: 3, longestStreak: 12, totalCheckins: 45, lastCheckin: new Date() },
  badges = defaultBadges,
  goals = defaultGoals,
}: HealthGamificationProps) => {
  const earnedBadges = badges.filter(b => b.earned);
  const nextBadge = badges.find(b => !b.earned);

  return (
    <div className="space-y-6">
      {/* Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-warning/10 via-destructive/5 to-primary/10 rounded-2xl p-6 border border-warning/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <Flame className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl">{streakData.currentStreak} Day Streak!</h3>
              <p className="text-sm text-muted-foreground">Keep it going!</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Best Streak</p>
            <p className="font-semibold text-lg">{streakData.longestStreak} days</p>
          </div>
        </div>
        
        {/* Streak visualization */}
        <div className="flex gap-1">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${
                i < streakData.currentStreak % 7 ? "bg-warning" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {7 - (streakData.currentStreak % 7)} more days to next badge!
        </p>
      </motion.div>

      {/* Health Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Today's Goals
          </h3>
        </div>
        
        <div className="space-y-4">
          {goals.map((goal) => {
            const percentage = Math.min((goal.current / goal.target) * 100, 100);
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <goal.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{goal.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${goal.color}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Achievements
          </h3>
          <span className="text-sm text-muted-foreground">
            {earnedBadges.length}/{badges.length} earned
          </span>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: badge.earned ? 1.1 : 1 }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl ${
                badge.earned 
                  ? "bg-muted" 
                  : "bg-muted/30 opacity-50"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                badge.earned ? "bg-gradient-to-br from-warning/20 to-primary/20" : "bg-muted"
              }`}>
                <badge.icon className={`h-5 w-5 ${badge.earned ? badge.color : "text-muted-foreground"}`} />
              </div>
              <span className="text-xs font-medium text-center leading-tight">{badge.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Next badge hint */}
        {nextBadge && (
          <div className="mt-4 bg-muted/50 rounded-lg p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <nextBadge.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Next: {nextBadge.name}</p>
              <p className="text-xs text-muted-foreground">{nextBadge.description}</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export const StreakBadge = ({ streak }: { streak: number }) => {
  if (streak === 0) return null;
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-1.5 bg-warning/10 text-warning px-3 py-1 rounded-full"
    >
      <Flame className="h-4 w-4" />
      <span className="text-sm font-semibold">{streak}</span>
    </motion.div>
  );
};
