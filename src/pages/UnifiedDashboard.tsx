import React, { useMemo } from "react";
import { useAuth } from "@/components/OptimizedAuthContext";
import { useOptimizedApplications, useOptimizedApplicationStats } from "@/hooks/useOptimizedApplications";
import { useOptimizedServices, useServiceStats } from "@/hooks/useOptimizedServices";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LogOut, User, BarChart3, FileText, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useNavigate } from "react-router-dom";

export default function UnifiedDashboard() {
  const { profile, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const { data: apps, isLoading: appsLoading } = useOptimizedApplications();
  const appStats = useOptimizedApplicationStats();
  const { data: services, isLoading: servicesLoading } = useOptimizedServices();
  const serviceStats = useServiceStats(services || []);

  // Fast logout
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Memo: personalized greeting
  const greeting = useMemo(() => {
    if (!profile) return "Dashboard";
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${profile.full_name}!`;
    if (hour < 18) return `Good afternoon, ${profile.full_name}!`;
    return `Good evening, ${profile.full_name}!`;
  }, [profile]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-green-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <SidebarTrigger className="m-2" />
          {/* Header */}
          <header className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur border-b">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <LayoutDashboard className="h-6 w-6 text-blue-600" />
                Gram Panchayat Dashboard
              </h1>
              <p className="text-sm text-gray-600">{greeting}</p>
            </div>
            <div className="flex items-center gap-3">
              {profile && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{profile.full_name}</span>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>

          {/* Main dashboard content */}
          <div className="flex-1 px-4 md:px-10 py-6 max-w-7xl w-full mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                  <BarChart3 className="w-4 h-4 text-green-500"/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{servicesLoading ? "…" : serviceStats.total}</div>
                  <div className="text-xs text-muted-foreground">
                    {serviceStats.total} available
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">My Applications</CardTitle>
                  <FileText className="w-4 h-4 text-blue-500"/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appsLoading ? "…" : appStats.total}</div>
                  <div className="text-xs text-muted-foreground">
                    All-time submitted
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <BarChart3 className="w-4 h-4 text-purple-500"/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appsLoading ? "…" : appStats.completed}</div>
                  <div className="text-xs text-muted-foreground">
                    Successfully processed
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Quick Actions */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:ring-2 ring-blue-400 transition" onClick={() => navigate("/services")}>
                <CardHeader>
                  <CardTitle>Browse Services</CardTitle>
                  <CardDescription>View all available government services</CardDescription>
                </CardHeader>
              </Card>
              <Card className="cursor-pointer hover:ring-2 ring-blue-400 transition" onClick={() => navigate("/citizen-dashboard")}>
                <CardHeader>
                  <CardTitle>My Applications</CardTitle>
                  <CardDescription>Track and manage your applications</CardDescription>
                </CardHeader>
              </Card>
              {profile?.role === "staff" && (
                <Card className="cursor-pointer hover:ring-2 ring-blue-400 transition" onClick={() => navigate("/staff-dashboard")}>
                  <CardHeader>
                    <CardTitle>Staff Tools</CardTitle>
                    <CardDescription>Manage citizen applications</CardDescription>
                  </CardHeader>
                </Card>
              )}
            </div>
            <div className="text-center text-xs text-gray-400 pt-8">
              Powered by Gram Panchayat E-Services Team &middot; Built for community digital empowerment.
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
