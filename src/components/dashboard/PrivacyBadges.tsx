import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const PrivacyBadges = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 bg-success/10 text-success px-3 py-1.5 rounded-full text-xs font-medium"
      >
        <Shield className="h-3.5 w-3.5" />
        <span>HIPAA Compliant</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium"
      >
        <Lock className="h-3.5 w-3.5" />
        <span>End-to-End Encrypted</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 bg-info/10 text-info px-3 py-1.5 rounded-full text-xs font-medium"
      >
        <FileCheck className="h-3.5 w-3.5" />
        <span>GDPR Ready</span>
      </motion.div>
    </div>
  );
};

export const PrivacyConsentBanner = ({ onAccept }: { onAccept: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40"
    >
      <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Your Privacy Matters</p>
            <p className="text-xs text-muted-foreground">
              We use encryption and follow strict privacy standards. Your health data is never shared.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">Learn More</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Privacy & Data Protection</DialogTitle>
              </DialogHeader>
              <PrivacyDetails />
            </DialogContent>
          </Dialog>
          <Button onClick={onAccept} size="sm" className="gap-2">
            <Shield className="h-4 w-4" />
            I Understand
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export const PrivacyDetails = () => {
  const features = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit and at rest using AES-256 encryption.",
    },
    {
      icon: Shield,
      title: "HIPAA Compliance",
      description: "We follow all Health Insurance Portability and Accountability Act requirements.",
    },
    {
      icon: Eye,
      title: "No Data Selling",
      description: "Your health data is never sold or shared with third parties for advertising.",
    },
    {
      icon: Trash2,
      title: "Right to Delete",
      description: "You can delete all your data at any time from your account settings.",
    },
  ];

  return (
    <div className="space-y-4">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <feature.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">{feature.title}</h4>
            <p className="text-xs text-muted-foreground">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
