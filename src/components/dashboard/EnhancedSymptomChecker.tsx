import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { AssessmentResults } from "./AssessmentResults";
import { CheckModeSelector, CheckMode } from "./CheckModeSelector";
import { QuickCheckForm } from "./QuickCheckForm";
import { ChatProgressIndicator } from "./ChatProgressIndicator";
import { useSymptomChat } from "@/hooks/useSymptomChat";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

export function EnhancedSymptomChecker() {
  const [checkMode, setCheckMode] = useState<CheckMode>(null);
  const [questionCount, setQuestionCount] = useState(1);

  const {
    messages,
    isLoading,
    assessment,
    sendMessage,
    startNewConversation,
    generateAssessment,
  } = useSymptomChat();

  // Count questions based on assistant messages
  useEffect(() => {
    const assistantMessages = messages.filter(m => m.role === "assistant");
    setQuestionCount(assistantMessages.length);
  }, [messages]);

  // Zero-Latency Tunnel Blast when assessment is ready
  useEffect(() => {
    if (assessment) {
      const event = new CustomEvent('patient-symptom-update', {
        detail: {
          patientName: "Chirayush Singh",
          timestamp: new Date().toISOString(),
          impactScore: assessment.severity === 'high' ? 8.5 : assessment.severity === 'medium' ? 5.2 : 2.1,
          assessment: assessment
        }
      });
      window.dispatchEvent(event);
      toast.info("Assessment shared instantly with your doctor via Zero-Latency Tunnel.");
    }
  }, [assessment]);

  const handleModeSelect = (mode: CheckMode) => {
    setCheckMode(mode);
    if (mode === "quick_chat" || mode === "detailed") {
      startNewConversation();
    }
  };

  const handleQuickFormSubmit = async (symptoms: string[], severity: number) => {
    // Reset state first
    await startNewConversation();
    // Directly generate assessment without message passing overhead
    generateAssessment(symptoms);
  };

  const handleStartOver = () => {
    setCheckMode(null);
    setQuestionCount(1);
    startNewConversation();
  };

  // Show assessment results if available
  if (assessment) {
    return (
      <AssessmentResults
        assessment={assessment}
        onNewCheck={handleStartOver}
      />
    );
  }

  // Show mode selector if no mode selected
  if (!checkMode) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
            <Stethoscope className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Symptom Checker</h2>
            <p className="text-sm text-muted-foreground">
              AI-powered health assessment
            </p>
          </div>
        </motion.div>

        <CheckModeSelector
          selectedMode={checkMode}
          onSelectMode={handleModeSelect}
        />

        <MedicalDisclaimer />
      </div>
    );
  }

  // Show quick form
  if (checkMode === "quick_form") {
    return (
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10">
              <Stethoscope className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Quick Check</h2>
              <p className="text-sm text-muted-foreground">
                Fast symptom selection
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleStartOver} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Change Mode
          </Button>
        </motion.div>

        <QuickCheckForm
          onSubmit={handleQuickFormSubmit}
          onBack={handleStartOver}
          isLoading={isLoading}
        />

        <MedicalDisclaimer />
      </div>
    );
  }

  // Show chat interface (quick_chat or detailed)
  const isQuickMode = checkMode === "quick_chat";
  const estimatedQuestions = isQuickMode ? 5 : 12;

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${isQuickMode
            ? "from-amber-500/20 to-amber-500/10"
            : "from-blue-500/20 to-blue-500/10"
            }`}>
            <Stethoscope className={`w-6 h-6 ${isQuickMode ? "text-amber-500" : "text-blue-500"}`} />
          </div>
          <div>
            <h2 className="font-semibold text-lg">
              {isQuickMode ? "Quick Chat" : "Detailed Interview"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isQuickMode ? "Fast assessment with focused questions" : "Comprehensive symptom analysis"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleStartOver} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Start Over
        </Button>
      </motion.div>

      {/* Progress Indicator */}
      {messages.length > 1 && (
        <ChatProgressIndicator
          currentQuestion={questionCount}
          estimatedTotal={estimatedQuestions}
          mode={isQuickMode ? "quick" : "detailed"}
        />
      )}

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="h-[450px]"
      >
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          placeholder="Describe your symptoms or answer the question..."
        />
      </motion.div>

      {/* Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
}
