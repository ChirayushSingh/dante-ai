import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Check,
  Sparkles,
  CreditCard,
  Calendar,
  AlertCircle,
  Zap,
  Building2,
  Crown,
  Plus,
  FileText,
  Download,
  Loader2,
  DollarSign
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";

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
  const { profile } = useProfile();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDoctor = profile?.role === 'doctor' || profile?.role === 'clinic_admin';

  useEffect(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user, profile]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from("invoices").select("*, profiles!invoices_patient_id_fkey(full_name), clinics(name)");

      if (isDoctor) {
        // If doctor/admin, show invoices for their clinic
        const { data: doc } = await supabase.from("doctors").select("clinic_id").eq("user_id", user?.id).single();
        if (doc) {
          query = query.eq("clinic_id", doc.clinic_id);
        }
      } else {
        // If patient, show only their invoices
        query = query.eq("patient_id", user?.id);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (!error) setInvoices(data || []);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">Billing & Invoices</h1>
            <p className="text-muted-foreground italic">Manage your payments and clinic financial records.</p>
          </div>
          {isDoctor && (
            <Button className="gap-2 bg-primary shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" /> Create New Invoice
            </Button>
          )}
        </div>

        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
            <TabsTrigger value="plans" className="gap-2"><Crown className="h-4 w-4" /> Platform Plans</TabsTrigger>
            <TabsTrigger value="history" className="gap-2"><FileText className="h-4 w-4" /> Invoice History</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Crown className="w-48 h-48 rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none mb-4">ACTIVE PLAN</Badge>
                  <h2 className="text-4xl font-bold mb-2">Aura Free</h2>
                  <p className="text-slate-400 max-w-md italic">Essential features for individuals starting their health journey.</p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Usage Today</p>
                  <p className="text-2xl font-mono">0 / 5 Checks</p>
                  <div className="w-48 h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "0%" }} />
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`border-none rounded-3xl shadow-sm hover:shadow-xl transition-all ${plan.popular ? 'ring-2 ring-primary scale-105' : ''}`}
                >
                  <CardHeader className="text-center pb-2">
                    <div className={`w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center ${plan.popular ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50'}`}>
                      <plan.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1 mt-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-2 text-sm text-slate-600">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" /> {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full h-11 rounded-2xl ${plan.current ? 'bg-slate-100 text-slate-500 hover:bg-slate-100' : plan.popular ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-900'}`}
                      disabled={plan.current}
                    >
                      {plan.current ? "Current Plan" : "Upgrade"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
            ) : invoices.length === 0 ? (
              <Card className="rounded-3xl border-dashed border-2 border-slate-200">
                <CardContent className="py-20 text-center">
                  <div className="p-4 bg-slate-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">No Invoices Found</h3>
                  <p className="text-muted-foreground italic">Records will appear here once medical visits are processed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <Card key={invoice.id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row items-center border-l-4 border-primary">
                        <div className="p-6 flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant={invoice.status === 'paid' ? 'secondary' : 'destructive'} className="rounded-full px-3 bg-opacity-10">
                              {invoice.status.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-slate-400 font-medium">#{invoice.id.slice(0, 8)}</span>
                          </div>
                          <h3 className="font-semibold text-lg">Diagnova Plus</h3>
                          <p className="text-sm text-slate-500">{invoice.description}</p>
                        </div>
                        <div className="p-6 bg-slate-50 flex items-center gap-12 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100">
                          <div className="text-right">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Date</p>
                            <p className="font-medium text-sm">{format(new Date(invoice.created_at), "MMM dd, yyyy")}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Amount</p>
                            <p className="text-xl font-bold text-slate-900">${invoice.amount}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary rounded-xl">
                            <Download className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Card className="bg-slate-50 border-none rounded-3xl p-6">
          <CardContent className="flex items-center gap-4 p-0">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-bold">Need help with billing?</p>
              <p className="text-sm text-muted-foreground italic">Our financial support team is available 24/7 at support@auraaid.ai</p>
            </div>
            <Button variant="link" className="ml-auto text-primary font-bold">Contact Support</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
