import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Shield, 
  History, 
  Key, 
  FileText, 
  BarChart3,
  AlertTriangle,
  User,
  Brain,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Conversational Interview",
    description: "Natural chat-style symptom assessment. Our AI asks intelligent follow-up questions to understand your condition better.",
    gradient: "from-primary to-accent",
  },
  {
    icon: AlertTriangle,
    title: "Risk Triage System",
    description: "Get actionable urgency levels: Self-care, Consult Soon, or Emergency. Know when to seek immediate help.",
    gradient: "from-warning to-orange-500",
  },
  {
    icon: User,
    title: "Personal Health Profile",
    description: "Store your medical history, allergies, and medications. Get personalized insights based on your unique health profile.",
    gradient: "from-info to-blue-500",
  },
  {
    icon: Brain,
    title: "Explainable AI Results",
    description: "Understand why conditions are suggested with plain-language explanations. No medical jargon or alarmist tone.",
    gradient: "from-primary to-accent",
  },
  {
    icon: Sparkles,
    title: "AI Health Chatbot",
    description: "Ask general health questions anytime. Get educational content and guidance from your personal health assistant.",
    gradient: "from-accent to-teal-500",
  },
  {
    icon: History,
    title: "Health History Tracking",
    description: "Track all your symptom checks over time. Identify patterns and share comprehensive reports with your doctor.",
    gradient: "from-success to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Visualize your health trends with interactive charts. Monitor symptoms, predictions, and urgency levels over time.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "HIPAA compliant with end-to-end encryption. Your health data is never shared and you control your data.",
    gradient: "from-primary to-accent",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding bg-muted/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-medium text-primary mb-4 block">FEATURES</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need for{" "}
            <span className="gradient-text">Smarter Health</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive AI health platform that goes beyond simple symptom checking. 
            Get personalized insights, track your health journey, and make informed decisions.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-card rounded-2xl p-6 border border-border card-hover relative overflow-hidden">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-md`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
