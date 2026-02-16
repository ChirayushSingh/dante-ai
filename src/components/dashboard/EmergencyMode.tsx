import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Phone,
  MapPin,
  X,
  Siren,
  Heart,
  Clock,
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EmergencyModeProps {
  symptoms?: string[];
  onClose?: () => void;
}

export const EmergencyMode = ({ symptoms = [], onClose }: EmergencyModeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [locationShared, setLocationShared] = useState(false);

  const handleEmergencyCall = () => {
    // Zero-Latency Tunnel Blast
    const event = new CustomEvent('patient-emergency', {
      detail: {
        patientName: "Chirayush Singh",
        timestamp: new Date().toISOString(),
        impactScore: 9.8,
        symptoms: symptoms
      }
    });
    window.dispatchEvent(event);
    window.location.href = "tel:911";
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationShared(true);
          toast.success("Location ready to share with emergency services");
        },
        () => {
          toast.error("Unable to get location. Please enable location services.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleFindUrgentCare = () => {
    window.open("https://www.google.com/maps/search/urgent+care+near+me", "_blank");
  };

  return (
    <>
      {/* Emergency Button - Always visible */}
      <motion.button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-destructive text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        whileTap={{ scale: 0.95 }}
        aria-label="Emergency Mode"
      >
        <Siren className="h-7 w-7" />
      </motion.button>

      {/* Emergency Panel */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/80 backdrop-blur-sm z-50"
              onClick={() => setIsExpanded(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl p-6 safe-area-inset-bottom"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-destructive">Emergency Mode</h2>
                    <p className="text-sm text-muted-foreground">Get immediate help</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Emergency Actions */}
              <div className="space-y-4">
                {/* Call Emergency */}
                <Button
                  onClick={handleEmergencyCall}
                  variant="destructive"
                  size="xl"
                  className="w-full gap-3 text-lg font-bold h-16"
                >
                  <Phone className="h-6 w-6" />
                  Call 911 Now
                </Button>

                {/* Share Location */}
                <Button
                  onClick={handleShareLocation}
                  variant="outline"
                  size="lg"
                  className={`w-full gap-3 ${locationShared ? 'border-success text-success' : ''}`}
                >
                  <MapPin className="h-5 w-5" />
                  {locationShared ? "Location Ready ✓" : "Share My Location"}
                </Button>

                {/* Find Urgent Care */}
                <Button
                  onClick={handleFindUrgentCare}
                  variant="outline"
                  size="lg"
                  className="w-full gap-3"
                >
                  <Navigation className="h-5 w-5" />
                  Find Nearest Urgent Care
                </Button>
              </div>

              {/* Current Symptoms Summary */}
              {symptoms.length > 0 && (
                <div className="mt-6 bg-destructive/5 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">Symptoms to report:</p>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.slice(0, 5).map((symptom, i) => (
                      <span key={i} className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-full">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Emergency Info */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <a
                  href="tel:988"
                  className="flex items-center gap-3 bg-muted rounded-xl p-4"
                >
                  <Heart className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Crisis Line</p>
                    <p className="text-xs text-muted-foreground">988</p>
                  </div>
                </a>
                <a
                  href="tel:911"
                  className="flex items-center gap-3 bg-muted rounded-xl p-4"
                >
                  <Clock className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm font-medium">24/7 Help</p>
                    <p className="text-xs text-muted-foreground">911</p>
                  </div>
                </a>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-muted-foreground text-center mt-6">
                If you're experiencing a medical emergency, call 911 immediately.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
