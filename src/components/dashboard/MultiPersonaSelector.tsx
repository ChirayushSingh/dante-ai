import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Stethoscope, 
  Eye, 
  Check,
  ChevronDown,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PersonaMode = "simple" | "advanced" | "senior";

interface PersonaModeConfig {
  id: PersonaMode;
  label: string;
  description: string;
  icon: typeof User;
  features: string[];
}

const personaModes: PersonaModeConfig[] = [
  {
    id: "simple",
    label: "Simple Mode",
    description: "Easy to understand results",
    icon: User,
    features: ["Plain language", "Clear visuals", "Basic recommendations"],
  },
  {
    id: "advanced",
    label: "Advanced Mode",
    description: "Medical-grade details",
    icon: Stethoscope,
    features: ["Differential diagnosis", "Probability scores", "Clinical terms"],
  },
  {
    id: "senior",
    label: "Senior Mode",
    description: "Large text & voice support",
    icon: Eye,
    features: ["Large fonts", "Voice output", "High contrast"],
  },
];

interface MultiPersonaSelectorProps {
  currentMode: PersonaMode;
  onModeChange: (mode: PersonaMode) => void;
  compact?: boolean;
}

export function MultiPersonaSelector({ 
  currentMode, 
  onModeChange,
  compact = false 
}: MultiPersonaSelectorProps) {
  const currentConfig = personaModes.find(m => m.id === currentMode) || personaModes[0];

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <currentConfig.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{currentConfig.label}</span>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Interface Mode</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {personaModes.map((mode) => (
            <DropdownMenuItem
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className="flex items-start gap-3 p-3 cursor-pointer"
            >
              <mode.icon className={cn(
                "w-5 h-5 mt-0.5",
                currentMode === mode.id ? "text-primary" : "text-muted-foreground"
              )} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{mode.label}</span>
                  {currentMode === mode.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{mode.description}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Interface Mode</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {personaModes.map((mode) => (
          <motion.button
            key={mode.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onModeChange(mode.id)}
            className={cn(
              "relative p-4 rounded-xl border-2 text-left transition-all",
              currentMode === mode.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            {currentMode === mode.id && (
              <motion.div
                layoutId="persona-check"
                className="absolute top-2 right-2"
              >
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              </motion.div>
            )}
            
            <mode.icon className={cn(
              "w-6 h-6 mb-2",
              currentMode === mode.id ? "text-primary" : "text-muted-foreground"
            )} />
            
            <h3 className="font-semibold text-sm">{mode.label}</h3>
            <p className="text-xs text-muted-foreground mt-1">{mode.description}</p>
            
            <div className="flex flex-wrap gap-1 mt-3">
              {mode.features.map((feature, i) => (
                <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {feature}
                </Badge>
              ))}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Hook to apply persona-specific styles
export function usePersonaStyles(mode: PersonaMode) {
  return {
    fontSize: mode === "senior" ? "text-lg" : "text-base",
    spacing: mode === "senior" ? "space-y-6" : "space-y-4",
    showVoice: mode === "senior",
    showAdvancedDetails: mode === "advanced",
    simplifyLanguage: mode === "simple",
  };
}
