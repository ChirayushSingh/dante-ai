import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PERSONA_TEMPLATES, EMPATHY_LEVELS, RED_FLAG_KEYWORDS } from "@/lib/healthPrompts";
import { Bot, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useHealthChat } from "@/hooks/useHealthChat";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

export function HealthChatbot() {
  const { messages, isLoading, sendMessage, startNewConversation } = useHealthChat();

  const [persona, setPersona] = useState<"empathic_primary_care" | "concise_clinical" | "pediatric_nurturing">("empathic_primary_care");
  const [empathy, setEmpathy] = useState<"low" | "medium" | "high">("medium");
  const [useOpenAIPoC, setUseOpenAIPoC] = useState(false);
  const [saveHipaa, setSaveHipaa] = useState(false);

  // Start conversation on mount
  useEffect(() => {
    if (messages.length === 0) {
      startNewConversation();
    }
  }, []);

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
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">AI Health Assistant</h2>
            <p className="text-sm text-muted-foreground">
              Ask me anything about health and wellness
            </p>

            {/* Persona & empathy controls */}
            <div className="mt-2 flex items-center gap-2 text-xs">
              <label className="text-muted-foreground">Persona:</label>
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value as any)}
                className="text-xs rounded border px-2 py-1"
              >
                <option value="empathic_primary_care">Empathic Primary Care</option>
                <option value="concise_clinical">Concise Clinical</option>
                <option value="pediatric_nurturing">Pediatric (Nurturing)</option>
              </select>

              <label className="text-muted-foreground">Empathy:</label>
              <select
                value={empathy}
                onChange={(e) => setEmpathy(e.target.value as any)}
                className="text-xs rounded border px-2 py-1"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <label className="ml-2 text-muted-foreground flex items-center gap-1">
                <input type="checkbox" checked={useOpenAIPoC} onChange={(e) => setUseOpenAIPoC(e.target.checked)} />
                Use OpenAI PoC
              </label>

              <label className="text-muted-foreground flex items-center gap-1">
                <input type="checkbox" checked={saveHipaa} onChange={(e) => setSaveHipaa(e.target.checked)} />
                Mock HIPAA Save
              </label>
            </div>

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
            New Chat
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
          onSendMessage={(content: string) => sendMessage(content, { persona, empathy, useOpenAIPoC, saveHipaa })}
          placeholder="Ask about health topics, medications, conditions..."
        />
      </motion.div>

      {/* Quick Topics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          Quick topics
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "What are the symptoms of diabetes?",
            "How can I improve my sleep?",
            "What is cholesterol?",
            "Tips for reducing stress",
            "How much water should I drink?",
          ].map((topic) => (
            <Button
              key={topic}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => sendMessage(topic, { persona, empathy, useOpenAIPoC, saveHipaa })}
              disabled={isLoading}
            >
              {topic}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
}