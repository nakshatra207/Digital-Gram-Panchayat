import React from 'react';
import { useAuth } from '@/components/OptimizedAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApplicationsList } from '@/components/ApplicationsList';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, FileText, BarChart3, Clock } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';

const StaffDashboard = () => {
  const { profile, logout } = useAuth();
  const { data: applications } = useApplications();
  const navigate = useNavigate();

  if (!profile || profile.role !== 'staff') {
    navigate('/login');
    return null;
  }

  const pendingApplications = applications?.filter(app => app.status === 'pending').length || 0;
  const reviewingApplications = applications?.filter(app => app.status === 'under_review').length || 0;
  const completedApplications = applications?.filter(app => app.status === 'completed').length || 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gram Panchayat E-Services</h1>
              <p className="text-sm text-gray-600">Staff Portal</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{profile.full_name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome, {profile.full_name}!
          </h2>
          <p className="text-gray-600">
            Manage and process citizen applications efficiently.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting initial review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviewingApplications}</div>
              <p className="text-xs text-muted-foreground">
                Currently being processed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedApplications}</div>
              <p className="text-xs text-muted-foreground">
                Successfully processed
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all-applications">All Applications</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="all-applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  All Applications
                </CardTitle>
                <CardDescription>
                  View and manage all citizen applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicationsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>
                  Applications awaiting initial review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicationsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Applications In Progress</CardTitle>
                <CardDescription>
                  Applications currently under review or approved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicationsList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StaffDashboard;
