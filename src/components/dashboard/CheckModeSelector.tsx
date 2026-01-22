import { motion } from "framer-motion";
import { Zap, ClipboardList, MessageCircle, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CheckMode = "quick_form" | "quick_chat" | "detailed" | null;

interface CheckModeSelectorProps {
  onSelectMode: (mode: CheckMode) => void;
  selectedMode: CheckMode;
}

const modes = [
  {
    id: "quick_form" as const,
    title: "Quick Check",
    subtitle: "Form-based",
    description: "Select symptoms from a list for fast assessment",
    icon: ClipboardList,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500",
    time: "~1 min",
    questions: "3-5 selections",
  },
  {
    id: "quick_chat" as const,
    title: "Quick Check",
    subtitle: "Chat-based",
    description: "Answer a few focused questions via chat",
    icon: Zap,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500",
    time: "~2 min",
    questions: "3-5 questions",
  },
  {
    id: "detailed" as const,
    title: "Detailed Check",
    subtitle: "Full interview",
    description: "Comprehensive symptom analysis with follow-ups",
    icon: FileQuestion,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500",
    time: "5-10 min",
    questions: "10-15 questions",
  },
];

export function CheckModeSelector({ onSelectMode, selectedMode }: CheckModeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold mb-2">
          How would you like to check your symptoms?
        </h2>
        <p className="text-muted-foreground">
          Choose the experience that fits your needs
        </p>
      </div>

      <div className="grid gap-4">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectMode(mode.id)}
              className={cn(
                "w-full p-5 rounded-xl border-2 text-left transition-all",
                isSelected
                  ? `${mode.borderColor} ${mode.bgColor}`
                  : "border-border hover:border-primary/30 bg-card"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn("p-3 rounded-xl", mode.bgColor)}>
                  <Icon className={cn("h-6 w-6", mode.color)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-semibold">{mode.title}</span>
                      <span className="text-muted-foreground ml-2 text-sm">
                        {mode.subtitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-muted px-2 py-1 rounded">{mode.time}</span>
                      <span className="bg-muted px-2 py-1 rounded">{mode.questions}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{mode.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          disabled={!selectedMode}
          onClick={() => selectedMode && onSelectMode(selectedMode)}
          className="gap-2 min-w-[200px]"
        >
          <MessageCircle className="h-4 w-4" />
          Start {selectedMode === "quick_form" ? "Quick Form" : selectedMode === "quick_chat" ? "Quick Chat" : "Detailed"} Check
        </Button>
      </div>
    </div>
  );
}
