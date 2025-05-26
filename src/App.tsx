
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Loans from "./pages/Loans";
import Collectors from "./pages/Collectors";
import Schedule from "./pages/Schedule";
import Unions from "./pages/Unions";
import NotFound from "./pages/NotFound";
import { OdooAuthProvider } from "./hooks/useOdooAuth";
import OdooLogin from "./components/OdooLogin";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <OdooAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<OdooLogin />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/unions" element={<Unions />} />
              <Route path="/members" element={<Members />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/collectors" element={<Collectors />} />
              <Route path="/schedule" element={<Schedule />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </OdooAuthProvider>
  </QueryClientProvider>
);

export default App;
