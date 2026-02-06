import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, RequireAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Testimonials from "./pages/Testimonials";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Billing from "./pages/Billing";
import ApiKeys from "./pages/ApiKeys";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import HealthChat from "./pages/HealthChat";
import Analytics from "./pages/Analytics";
import KnowledgeHub from "./pages/KnowledgeHub";
import ClinicOnboarding from "./pages/ClinicOnboarding";
import PatientRegistration from "./pages/PatientRegistration";
import BookAppointment from "./pages/BookAppointment";
import SecureMessaging from "./pages/SecureMessaging";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/dashboard/book" element={<RequireAuth><BookAppointment /></RequireAuth>} />
            <Route path="/dashboard/onboarding" element={<RequireAuth><ClinicOnboarding /></RequireAuth>} />
            <Route path="/dashboard/registration" element={<RequireAuth><PatientRegistration /></RequireAuth>} />
            <Route path="/dashboard/chat" element={<RequireAuth><HealthChat /></RequireAuth>} />
            <Route path="/dashboard/history" element={<RequireAuth><History /></RequireAuth>} />
            <Route path="/dashboard/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
            <Route path="/dashboard/knowledge" element={<RequireAuth><KnowledgeHub /></RequireAuth>} />
            <Route path="/dashboard/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/dashboard/billing" element={<RequireAuth><Billing /></RequireAuth>} />
            <Route path="/dashboard/api-keys" element={<RequireAuth><ApiKeys /></RequireAuth>} />
            <Route path="/dashboard/messages" element={<RequireAuth><SecureMessaging /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;