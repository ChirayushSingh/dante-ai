import { motion } from "framer-motion";
import { ClipboardList, Brain, FileCheck, Stethoscope } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Enter Your Symptoms",
    description: "Describe your symptoms in detail using our intuitive symptom input form. Add as many symptoms as needed for accurate analysis.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Analysis",
    description: "Our advanced AI processes your symptoms using machine learning algorithms trained on vast medical datasets.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Get Results",
    description: "Receive detailed predictions with confidence scores, explanations, and helpful information about potential conditions.",
  },
  {
    icon: Stethoscope,
    step: "04",
    title: "Consult a Doctor",
    description: "Use our insights as a starting point for discussions with healthcare professionals. Always seek professional medical advice.",
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
            Simple Steps to{" "}
            <span className="gradient-text">Better Understanding</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get health insights in minutes with our streamlined process. 
            No complicated forms or lengthy questionnaires.
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
                <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="relative text-center">
                {/* Step number */}
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-7xl font-bold text-primary/5 font-display">
                  {item.step}
                </span>
                
                {/* Icon */}
                <div className="relative z-10 w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center shadow-glow mb-6">
                  <item.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                
                <h3 className="font-display font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
