import { useEffect } from "react";
import { motion } from "framer-motion";
import { Stethoscope, MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { AssessmentResults } from "./AssessmentResults";
import { useSymptomChat } from "@/hooks/useSymptomChat";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

export function ConversationalSymptomChecker() {
  const {
    messages,
    isLoading,
    assessment,
    sendMessage,
    startNewConversation,
  } = useSymptomChat();

  // Start a new conversation on mount
  useEffect(() => {
    if (messages.length === 0) {
      startNewConversation();
    }
  }, []);

  // Show assessment results if available
  if (assessment) {
    return (
      <AssessmentResults
        assessment={assessment}
        onNewCheck={startNewConversation}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <Stethoscope className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Symptom Interview</h2>
            <p className="text-sm text-muted-foreground">
              Describe your symptoms and I'll ask follow-up questions
            </p>
          </div>
        </div>
        {messages.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={startNewConversation}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Start Over
          </Button>
        )}
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="h-[500px]"
      >
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          placeholder="Describe your symptoms or answer the question..."
        />
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-muted/50 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Tips for accurate assessment:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Be specific about where symptoms occur</li>
              <li>• Mention when symptoms started</li>
              <li>• Rate pain or discomfort on a 1-10 scale</li>
              <li>• Include any related symptoms you've noticed</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
}