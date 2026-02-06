import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, MessageSquare, Sparkles } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-primary to-accent relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <Heart className="h-8 w-8 text-white" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Your Intelligent Healthcare Support System
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            Join thousands who trust Diagnova AI for personalized health insights.
            Safer, smarter, and designed around you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button
                size="xl"
                className="bg-white text-primary hover:bg-white/90 shadow-xl font-semibold group gap-2"
              >
                <MessageSquare className="h-5 w-5" />
                Start Free Consultation
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="xl"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto"
          >
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-white">50K+</div>
              <div className="text-sm text-white/70">Health Checks</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-white">98%</div>
              <div className="text-sm text-white/70">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-white/70">Available</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
