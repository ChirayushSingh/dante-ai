import { AlertTriangle } from "lucide-react";

interface MedicalDisclaimerProps {
  variant?: "default" | "compact" | "banner";
}

export const MedicalDisclaimer = ({ variant = "default" }: MedicalDisclaimerProps) => {
  if (variant === "compact") {
    return (
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <AlertTriangle className="h-3 w-3 text-warning" />
        <span>For educational purposes only. Not medical advice.</span>
      </p>
    );
  }

  if (variant === "banner") {
    return (
      <div className="bg-warning/10 border-y border-warning/20 py-2 px-4">
        <p className="text-sm text-center text-muted-foreground flex items-center justify-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span>This tool is for educational purposes only and does not replace professional medical advice.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="medical-disclaimer flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
      <p>
        <strong className="text-foreground">Medical Disclaimer:</strong> This tool is for educational purposes only and does not replace professional medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.
      </p>
    </div>
  );
};
