import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  X, 
  ArrowRight, 
  Loader2,
  ThermometerSun,
  Brain,
  Heart,
  Bone,
  Eye,
  Ear
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuickCheckFormProps {
  onSubmit: (symptoms: string[], severity: number) => void;
  onBack: () => void;
  isLoading: boolean;
}

const symptomCategories = [
  {
    id: "general",
    label: "General",
    icon: ThermometerSun,
    symptoms: ["Fever", "Fatigue", "Chills", "Weakness", "Weight loss", "Night sweats"],
  },
  {
    id: "head",
    label: "Head & Mind",
    icon: Brain,
    symptoms: ["Headache", "Dizziness", "Confusion", "Memory issues", "Anxiety", "Insomnia"],
  },
  {
    id: "chest",
    label: "Chest & Heart",
    icon: Heart,
    symptoms: ["Chest pain", "Shortness of breath", "Cough", "Palpitations", "Wheezing"],
  },
  {
    id: "body",
    label: "Body & Joints",
    icon: Bone,
    symptoms: ["Back pain", "Joint pain", "Muscle aches", "Stiffness", "Swelling", "Numbness"],
  },
  {
    id: "sensory",
    label: "Eyes & Ears",
    icon: Eye,
    symptoms: ["Vision changes", "Eye pain", "Ear pain", "Hearing loss", "Tinnitus"],
  },
];

const severityLevels = [
  { value: 1, label: "Mild", description: "Noticeable but not interfering with daily activities" },
  { value: 2, label: "Moderate", description: "Somewhat affecting daily activities" },
  { value: 3, label: "Severe", description: "Significantly impacting daily life" },
];

export function QuickCheckForm({ onSubmit, onBack, isLoading }: QuickCheckFormProps) {
  const [step, setStep] = useState<"symptoms" | "severity">("symptoms");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<number>(2);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(symptomCategories[0].id);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const filteredSymptoms = symptomCategories.find(c => c.id === activeCategory)?.symptoms.filter(
    s => s.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const allSymptoms = symptomCategories.flatMap(c => c.symptoms);
  const searchResults = searchQuery
    ? allSymptoms.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSubmit = () => {
    if (step === "symptoms" && selectedSymptoms.length > 0) {
      setStep("severity");
    } else if (step === "severity") {
      onSubmit(selectedSymptoms, severity);
    }
  };

  const progress = step === "symptoms" ? 50 : 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Step {step === "symptoms" ? 1 : 2} of 2
          </span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {step === "symptoms" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div>
            <h3 className="font-semibold text-lg mb-1">Select your symptoms</h3>
            <p className="text-sm text-muted-foreground">
              Choose all that apply ({selectedSymptoms.length} selected)
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Symptoms */}
          {selectedSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map(symptom => (
                <motion.span
                  key={symptom}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full"
                >
                  {symptom}
                  <button
                    onClick={() => toggleSymptom(symptom)}
                    className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          )}

          {/* Category Tabs */}
          {!searchQuery && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {symptomCategories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all",
                      activeCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Symptoms Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(searchQuery ? searchResults : filteredSymptoms).map(symptom => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={cn(
                  "p-3 rounded-lg border text-sm text-left transition-all",
                  selectedSymptoms.includes(symptom)
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border hover:border-primary/50"
                )}
              >
                {symptom}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {step === "severity" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div>
            <h3 className="font-semibold text-lg mb-1">How severe are your symptoms?</h3>
            <p className="text-sm text-muted-foreground">
              This helps us prioritize our recommendations
            </p>
          </div>

          {/* Severity Options */}
          <div className="space-y-3">
            {severityLevels.map(level => (
              <button
                key={level.value}
                onClick={() => setSeverity(level.value)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left transition-all",
                  severity === level.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{level.label}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={cn(
                          "w-3 h-3 rounded-full",
                          i <= level.value
                            ? level.value === 1
                              ? "bg-emerald-500"
                              : level.value === 2
                              ? "bg-amber-500"
                              : "bg-red-500"
                            : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{level.description}</p>
              </button>
            ))}
          </div>

          {/* Selected Symptoms Summary */}
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm font-medium mb-2">Selected symptoms:</p>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map(symptom => (
                <span
                  key={symptom}
                  className="bg-background text-sm px-2 py-1 rounded-full border"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="ghost"
          onClick={step === "symptoms" ? onBack : () => setStep("symptoms")}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={selectedSymptoms.length === 0 || isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : step === "symptoms" ? (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Get Assessment
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
