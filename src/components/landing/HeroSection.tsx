import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { ArrowRight, Shield, Zap, Brain } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container-wide relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8"
          >
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Health Analysis</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6"
          >
            Understand Your Symptoms{" "}
            <span className="gradient-text">In Seconds</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Get instant AI-powered disease predictions based on your symptoms. 
            Receive confidence scores, detailed explanations, and personalized health insights.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link to="/dashboard">
              <Button variant="hero" size="xl" className="group">
                Start Free Analysis
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="heroOutline" size="xl">
                See How It Works
              </Button>
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-12"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-success" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-warning" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4 text-primary" />
              <span>Advanced AI</span>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <MedicalDisclaimer variant="compact" />
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="glass-card rounded-2xl p-2 shadow-xl">
              <div className="bg-card rounded-xl overflow-hidden border border-border">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-warning/50" />
                  <div className="w-3 h-3 rounded-full bg-success/50" />
                  <span className="ml-2 text-xs text-muted-foreground">Disease Detector Dashboard</span>
                </div>
                <div className="p-6 sm:p-8 lg:p-12 bg-[var(--gradient-card)]">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Symptom Input Preview */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Enter Symptoms</h3>
                      <div className="space-y-2">
                        <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                          Headache, fever, fatigue...
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">Headache</span>
                          <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">Fever</span>
                          <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">Fatigue</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Results Preview */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">AI Analysis</h3>
                      <div className="space-y-3">
                        <div className="bg-background rounded-lg p-4 border border-border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">Common Cold</span>
                            <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">78%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-success rounded-full" style={{ width: "78%" }} />
                          </div>
                        </div>
                        <div className="bg-background rounded-lg p-4 border border-border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">Influenza</span>
                            <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">45%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-warning rounded-full" style={{ width: "45%" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
