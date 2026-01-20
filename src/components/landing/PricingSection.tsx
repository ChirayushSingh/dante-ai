import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Perfect for trying out",
    price: "$0",
    period: "forever",
    icon: Zap,
    features: [
      "5 symptom checks per month",
      "Conversational AI interview",
      "Basic urgency triage",
      "Health profile storage",
      "Email support",
    ],
    cta: "Get Started Free",
    variant: "heroOutline" as const,
    popular: false,
  },
  {
    name: "Pro",
    description: "For health-conscious individuals",
    price: "$19",
    period: "/month",
    icon: Sparkles,
    features: [
      "Unlimited symptom checks",
      "Advanced AI analysis",
      "Full conversation history",
      "Downloadable PDF reports",
      "Health trend analytics",
      "Priority support",
      "Family profiles (up to 5)",
    ],
    cta: "Start Pro Trial",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For organizations & developers",
    price: "$99",
    period: "/month",
    icon: Building2,
    features: [
      "Everything in Pro",
      "API access & documentation",
      "Custom rate limits",
      "Webhook integrations",
      "SSO authentication",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom branding",
    ],
    cta: "Contact Sales",
    variant: "heroOutline" as const,
    popular: false,
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="section-padding bg-muted/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-medium text-primary mb-4 block">PRICING</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Choose Your{" "}
            <span className="gradient-text">Health Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free and upgrade as your needs grow. All plans include our core AI features 
            and medical safety protections.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-card rounded-2xl p-8 border ${
                plan.popular ? "border-primary shadow-lg scale-105" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                  plan.popular ? "bg-gradient-to-br from-primary to-accent" : "bg-muted"
                }`}>
                  <plan.icon className={`h-6 w-6 ${plan.popular ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={`h-5 w-5 flex-shrink-0 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/auth?mode=signup" className="block">
                <Button variant={plan.variant} size="lg" className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
