import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Heart, 
  Target, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { cn } from "@/lib/utils";

interface OnboardingWizardProps {
  onComplete: () => void;
}

const healthGoals = [
  { id: "symptom_tracking", label: "Track Symptoms", icon: "📋" },
  { id: "wellness", label: "General Wellness", icon: "🌿" },
  { id: "chronic_management", label: "Manage Chronic Condition", icon: "💊" },
  { id: "prevention", label: "Preventive Care", icon: "🛡️" },
  { id: "mental_health", label: "Mental Health", icon: "🧠" },
  { id: "fitness", label: "Fitness & Nutrition", icon: "💪" },
];

const genderOptions = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "non_binary", label: "Non-binary" },
  { id: "prefer_not_to_say", label: "Prefer not to say" },
];

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const navigate = useNavigate();
  const { updateProfile } = useHealthProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    healthGoals: [] as string[],
  });

  const steps = [
    {
      id: "personal",
      title: "Tell us about yourself",
      description: "This helps us personalize your health insights",
      icon: User,
    },
    {
      id: "health_info",
      title: "Basic health information",
      description: "Used to provide more accurate assessments",
      icon: Heart,
    },
    {
      id: "goals",
      title: "What's your health goal?",
      description: "We'll tailor your experience accordingly",
      icon: Target,
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const toggleHealthGoal = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goalId)
        ? prev.healthGoals.filter(g => g !== goalId)
        : [...prev.healthGoals, goalId],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.dateOfBirth !== "";
      case 1:
        return formData.gender !== "";
      case 2:
        return formData.healthGoals.length > 0;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        await updateProfile.mutateAsync({
          date_of_birth: formData.dateOfBirth || null,
          gender: formData.gender || null,
        });
        onComplete();
        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to save profile:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-2xl">
            Aura<span className="text-primary">Aid</span> AI
          </span>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-3 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  index < currentStep
                    ? "bg-primary text-primary-foreground"
                    : index === currentStep
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-xl p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step Header */}
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-bold mb-2">
                  {steps[currentStep].title}
                </h2>
                <p className="text-muted-foreground">
                  {steps[currentStep].description}
                </p>
              </div>

              {/* Step Content */}
              <div className="space-y-6">
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData({ ...formData, dateOfBirth: e.target.value })
                        }
                        className="h-12"
                      />
                      <p className="text-xs text-muted-foreground">
                        Your age helps us provide age-appropriate health insights
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <Label>Gender</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {genderOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, gender: option.id })
                          }
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all",
                            formData.gender === option.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <span className="font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This information helps personalize health recommendations
                    </p>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <Label>Select your health goals (pick all that apply)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {healthGoals.map((goal) => (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => toggleHealthGoal(goal.id)}
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3",
                            formData.healthGoals.includes(goal.id)
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <span className="text-2xl">{goal.icon}</span>
                          <span className="font-medium text-sm">{goal.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            <Button variant="link" onClick={handleSkip} className="text-muted-foreground">
              Skip for now
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="gap-2"
            >
              {currentStep === steps.length - 1 ? (
                isSubmitting ? "Saving..." : "Get Started"
              ) : (
                "Continue"
              )}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Privacy Note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          🔒 Your information is encrypted and never shared with third parties
        </p>
      </motion.div>
    </div>
  );
}
