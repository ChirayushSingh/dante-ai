import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { Activity, Mail, Lock, User, ArrowLeft, Loader2, Stethoscope, Building2, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const isSignup = searchParams.get("mode") === "signup";
  const initialRoleParam = searchParams.get("role") === "doctor" ? "doctor" : "patient";

  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor">(initialRoleParam as "patient" | "doctor");

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: initialRoleParam
  });

  const handleSelectRole = (role: "patient" | "doctor") => {
    setSelectedRole(role);
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignup && formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      setIsLoading(false);
      return;
    }

    const { error } = isSignup
      ? await signUp(formData.email, formData.password, formData.name, formData.role)
      : await signIn(formData.email, formData.password);

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success(isSignup ? "Account created successfully!" : "Welcome back!");

    // For sign-up, redirect based on role
    if (isSignup && (formData.role === 'doctor' || formData.role === 'clinic_admin')) {
      setIsLoading(false);
      navigate("/dashboard/onboarding");
      return;
    }

    // For sign-in, fetch profile to determine correct redirect
    if (!isSignup) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await (supabase
            .from("profiles")
            .select("role")
            .eq("user_id", user.id)
            .single() as unknown as { data: { role: string } | null; error: unknown });

          setIsLoading(false);

          // Redirect based on actual role from database
          if (profile?.role === 'doctor' || profile?.role === 'clinic_admin') {
            navigate("/dashboard");
          } else {
            navigate("/dashboard");
          }
          return;
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    setIsLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">
              Diagnova<span className="text-primary">AI</span>
            </span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 space-y-6">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">
                {isSignup
                  ? selectedRole === "patient"
                    ? "Create your patient account"
                    : "Create your doctor/clinic account"
                  : selectedRole === "patient"
                    ? "Sign in as patient"
                    : "Sign in as doctor/clinic"}
              </h1>
              <p className="text-muted-foreground">
                {selectedRole === "patient"
                  ? "For individuals and families who want instant AI health insights."
                  : "For doctors, clinics and hospitals who want AI-assisted triage, documentation and clinic intelligence."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSelectRole("patient")}
                className={`flex flex-col items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all ${selectedRole === "patient"
                  ? "border-primary bg-primary/5"
                  : "border-muted bg-transparent hover:border-muted-foreground"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold">Patient</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-primary" />
                    24/7 AI symptom checks
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-primary" />
                    3D body map & health timeline
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-primary" />
                    Family profiles & reminders
                  </li>
                </ul>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole("doctor")}
                className={`flex flex-col items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all ${selectedRole === "doctor"
                  ? "border-primary bg-primary/5"
                  : "border-muted bg-transparent hover:border-muted-foreground"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold">Doctor / Clinic</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-primary" />
                    AI‑triaged incoming cases and priority queues
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-primary" />
                    AI scribe for SOAP notes, visit summaries and prescriptions
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-primary" />
                    Lightweight EMR, clinic analytics and employer/insurer workflows
                  </li>
                </ul>
              </button>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={selectedRole === "patient" ? "John Doe" : "Dr. Meera Sharma / Sunrise Clinic"}
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
            </div>

            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-10" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                </div>
              </div>
            )}

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" />{isSignup ? "Creating account..." : "Signing in..."}</>) : (<>{isSignup ? "Create Account" : "Sign In"}</>)}
            </Button>
          </motion.form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link to={isSignup ? "/auth" : "/auth?mode=signup"} className="text-primary hover:underline font-medium">
              {isSignup ? "Sign in" : "Sign up"}
            </Link>
          </p>

          <div className="mt-8">
            <MedicalDisclaimer variant="compact" />
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-black relative overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-accent to-background opacity-50" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[100px] animate-pulse-slowmix" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent rounded-full blur-[100px] animate-pulse-slowmix delay-1000" />
        </div>

        {/* Glass Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center h-full bg-white/5 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center mb-8 shadow-2xl shadow-primary/30"
          >
            <Activity className="h-12 w-12 text-white" />
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl font-bold text-white mb-6"
          >
            AI-Powered <br /> Health Insights
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 max-w-md text-xl leading-relaxed"
          >
            Join 50,000+ users trusting Diagnova for instant symptom analysis and personalized care.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Auth;