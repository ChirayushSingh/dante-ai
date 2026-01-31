import { motion } from "framer-motion";
import { MessageSquare, Brain, AlertTriangle, Stethoscope } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Start the Conversation",
    description: "Tell us what's bothering you. Our AI will guide you through a natural conversation about your symptoms.",
    color: "bg-primary",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Asks Follow-ups",
    description: "Our intelligent system asks targeted questions about duration, severity, location, and related symptoms.",
    color: "bg-accent",
  },
  {
    icon: AlertTriangle,
    step: "03",
    title: "Get Risk Assessment",
    description: "Receive clear urgency guidance: Self-care at home, consult a doctor soon, or seek emergency care.",
    color: "bg-warning",
  },
  {
    icon: Stethoscope,
    step: "04",
    title: "Take Informed Action",
    description: "Review AI insights, possible conditions with explanations, and share the report with your healthcare provider.",
    color: "bg-success",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-medium text-primary mb-4 block">HOW IT WORKS</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            A Smarter Way to{" "}
            <span className="gradient-text">Understand Symptoms</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Unlike simple symptom checkers, Diagnova AI has a real conversation with you.
            Get accurate insights through dynamic, personalized assessment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="relative text-center">
                {/* Step number */}
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-7xl font-bold text-primary/5 font-display">
                  {item.step}
                </span>

                {/* Icon */}
                <div className={`relative z-10 w-16 h-16 mx-auto rounded-2xl ${item.color} flex items-center justify-center shadow-lg mb-6`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="font-display font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Demo conversation preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <h4 className="font-semibold text-center mb-4 text-sm text-muted-foreground">Example Conversation Flow</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-primary font-medium">AI:</span>
                <span className="text-muted-foreground">"Tell me where it hurts most."</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-medium">AI:</span>
                <span className="text-muted-foreground">"When did this start?"</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-medium">AI:</span>
                <span className="text-muted-foreground">"Any allergies or medications you're taking?"</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-medium">AI:</span>
                <span className="text-muted-foreground">"On a scale of 1-10, how severe is the pain?"</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
