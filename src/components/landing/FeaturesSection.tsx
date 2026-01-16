import { motion } from "framer-motion";
import { 
  Brain, 
  Shield, 
  History, 
  Key, 
  FileText, 
  BarChart3,
  Zap,
  Lock
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms analyze your symptoms to provide accurate disease predictions with confidence scores.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get preliminary assessments in seconds, not hours. Our AI processes your symptoms and delivers insights immediately.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your health data is encrypted and never shared. We follow strict HIPAA compliance guidelines to protect your information.",
  },
  {
    icon: History,
    title: "Health History",
    description: "Track all your symptom checks over time. Identify patterns and share comprehensive reports with your healthcare provider.",
  },
  {
    icon: Key,
    title: "API Access",
    description: "Enterprise users get secure API access for integration with existing healthcare systems and applications.",
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description: "Download comprehensive PDF reports with explanations, recommendations, and data visualizations for each check.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Visualize your health trends with interactive charts. Monitor symptoms and predictions over time.",
  },
  {
    icon: Lock,
    title: "Secure Platform",
    description: "End-to-end encryption, secure authentication, and regular security audits keep your data safe.",
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
            <span className="gradient-text">Health Insights</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive platform designed to help you understand your symptoms 
            and make informed decisions about your health.
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
              <div className="h-full bg-card rounded-2xl p-6 border border-border card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
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
