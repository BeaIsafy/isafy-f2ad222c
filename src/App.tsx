import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import PaymentPage from "./pages/PaymentPage";
import Dashboard from "./pages/Dashboard";
import Pipeline from "./pages/Pipeline";
import LeadDetail from "./pages/LeadDetail";
import CaptacaoDetail from "./pages/CaptacaoDetail";
import PosVendaDetail from "./pages/PosVendaDetail";
import Contacts from "./pages/Contacts";
import ContactDetail from "./pages/ContactDetail";
import Properties from "./pages/Properties";
import PropertyNew from "./pages/PropertyNew";
import PropertyDetail from "./pages/PropertyDetail";
import CalendarPage from "./pages/CalendarPage";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import SupportPage from "./pages/SupportPage";
import ProposalView from "./pages/ProposalView";
import MatchPage from "./pages/MatchPage";
import ProposalsPage from "./pages/ProposalsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/onboarding" element={
              <ProtectedRoute><OnboardingPage /></ProtectedRoute>
            } />
            <Route path="/payment" element={
              <ProtectedRoute><PaymentPage /></ProtectedRoute>
            } />
            <Route path="/proposal-view/:token" element={<ProposalView />} />
            <Route path="/match/:leadId" element={
              <ProtectedRoute><MatchPage /></ProtectedRoute>
            } />
            <Route element={
              <ProtectedRoute><AppLayout /></ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/leads/:id" element={<LeadDetail />} />
              <Route path="/captacao/:id" element={<CaptacaoDetail />} />
              <Route path="/pos-venda/:id" element={<PosVendaDetail />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/contacts/:id" element={<ContactDetail />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/new" element={<PropertyNew />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/proposals" element={<ProposalsPage />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/support" element={<SupportPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
