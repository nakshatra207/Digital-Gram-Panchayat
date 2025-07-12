
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
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ErrorBoundary } from "react-error-boundary";

// Error fallback component
function ErrorFallback({error}: {error: Error}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

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
  <ErrorBoundary FallbackComponent={ErrorFallback}>
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
  </ErrorBoundary>
);

export default App;
