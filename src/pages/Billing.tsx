import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, CreditCard, Calendar, AlertCircle, Zap, Building2, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    icon: Zap,
    features: [
      "5 symptom checks per month",
      "Conversational AI interview",
      "Basic urgency triage",
      "Health profile storage",
    ],
    current: true,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    icon: Crown,
    features: [
      "Unlimited symptom checks",
      "Advanced AI analysis",
      "Full prediction history",
      "Downloadable PDF reports",
      "Priority support",
      "Health trend analytics",
      "Family profiles (up to 5)",
    ],
    current: false,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    icon: Building2,
    features: [
      "Everything in Pro",
      "API access",
      "Custom rate limits",
      "Dedicated support",
      "SSO authentication",
      "Custom branding",
    ],
    current: false,
  },
];

const Billing = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-3xl font-bold mb-2">Billing & Plans</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing information
          </p>
        </motion.div>

        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-card to-muted/50 rounded-2xl border border-border p-6 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-1">Current Plan: Free</h2>
                <p className="text-sm text-muted-foreground">
                  You have 5 symptom checks remaining this month
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-warning/10 text-warning text-sm px-3 py-1.5 rounded-full">
              <AlertCircle className="h-4 w-4" />
              <span>Limited features</span>
            </div>
          </div>
          
          {/* Usage Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Symptom checks used</span>
              <span className="font-medium">0 / 5</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: "0%" }} />
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Renews: N/A</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>No payment method</span>
            </div>
          </div>
        </motion.div>

        {/* Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-display text-xl font-semibold mb-6">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-card rounded-2xl p-6 border ${
                  plan.popular ? "border-primary shadow-lg scale-105" : "border-border"
                } ${plan.current ? "ring-2 ring-primary" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Popular
                    </div>
                  </div>
                )}

                {plan.current && (
                  <div className="absolute -top-3 right-4">
                    <div className="bg-success text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Current
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                    plan.popular ? "bg-gradient-to-br from-primary to-accent" : "bg-muted"
                  }`}>
                    <plan.icon className={`h-6 w-6 ${plan.popular ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-display text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                  className={`w-full ${plan.popular ? "bg-gradient-to-r from-primary to-accent hover:opacity-90" : ""}`}
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Upgrade"}
                </Button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card rounded-2xl border border-border p-6 shadow-sm"
        >
          <h2 className="font-display text-xl font-semibold mb-4">Payment History</h2>
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No payment history yet</p>
            <p className="text-sm mt-1">Upgrade to a paid plan to see your invoices here</p>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-muted/50 rounded-xl p-6"
        >
          <h3 className="font-semibold mb-2">Have questions about billing?</h3>
          <p className="text-sm text-muted-foreground">
            Contact our support team at <a href="mailto:billing@auraaid.ai" className="text-primary hover:underline">billing@auraaid.ai</a> or 
            check our <a href="#" className="text-primary hover:underline">billing FAQ</a>.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
