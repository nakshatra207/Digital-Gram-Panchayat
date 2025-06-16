
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OptimizedAuthProvider } from "@/components/OptimizedAuthContext";
import Index from "./pages/Index";
import OptimizedLogin from "./pages/OptimizedLogin";
import Register from "./pages/Register";
import UnifiedDashboard from "./pages/UnifiedDashboard";
import Profile from "./pages/Profile";
import StaffDashboard from "./pages/StaffDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import OptimizedServices from "./pages/OptimizedServices";
import NotFound from "./pages/NotFound";
import { FastAuthGuard } from "@/components/FastAuthGuard";
import { LanguageProvider } from "@/contexts/LanguageContext"; // <-- ADD THIS

// Enhanced QueryClient configuration for faster authentication
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes for auth data
      gcTime: 15 * 60 * 1000, // 15 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1, // Reduced retries for faster failure
      retryDelay: 500, // Faster retry delay
    },
    mutations: {
      retry: 0, // No retries for mutations to fail fast
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <OptimizedAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/login" 
                element={
                  <FastAuthGuard requireAuth={false}>
                    <OptimizedLogin />
                  </FastAuthGuard>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <FastAuthGuard requireAuth={false}>
                    <Register />
                  </FastAuthGuard>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <FastAuthGuard>
                    <UnifiedDashboard />
                  </FastAuthGuard>
                } 
              />
              <Route 
                path="/staff-dashboard" 
                element={
                  <FastAuthGuard>
                    <StaffDashboard />
                  </FastAuthGuard>
                } 
              />
              <Route 
                path="/citizen-dashboard" 
                element={
                  <FastAuthGuard>
                    <CitizenDashboard />
                  </FastAuthGuard>
                } 
              />
              <Route
                path="/profile"
                element={
                  <FastAuthGuard>
                    <Profile />
                  </FastAuthGuard>
                }
              />
              <Route path="/services" element={<OptimizedServices />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </OptimizedAuthProvider>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
