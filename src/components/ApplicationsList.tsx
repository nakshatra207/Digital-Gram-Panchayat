import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Application, useApplications, useUpdateApplication } from '@/hooks/useApplications';
import { useAuth } from '@/components/OptimizedAuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
};

export const ApplicationsList: React.FC = () => {
  const { profile } = useAuth();
  const { data: applications, isLoading } = useApplications();
  const updateApplication = useUpdateApplication();

  const handleStatusUpdate = (applicationId: string, newStatus: Application['status']) => {
    updateApplication.mutate({
      id: applicationId,
      updates: { 
        status: newStatus,
        updated_at: new Date().toISOString(),
        ...(newStatus === 'completed' && { completed_at: new Date().toISOString() })
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No applications found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">
                  {application.service?.name || 'Service'}
                </CardTitle>
                {profile?.role !== 'citizen' && application.citizen && (
                  <p className="text-sm text-gray-600 mt-1">
                    Applicant: {application.citizen.full_name} ({application.citizen.email})
                  </p>
                )}
              </div>
              <Badge className={statusColors[application.status]}>
                {application.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Submitted:</strong> {format(new Date(application.submitted_at), 'PPP')}
              </div>
              <div>
                <strong>Category:</strong> {application.service?.category || 'N/A'}
              </div>
              <div>
                <strong>Fees:</strong> ₹{application.service?.fees || 0}
              </div>
              <div>
                <strong>Last Updated:</strong> {format(new Date(application.updated_at), 'PPP')}
              </div>
            </div>

            {application.application_data && (
              <div className="mt-4">
                <strong className="text-sm">Application Details:</strong>
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  {Object.entries(application.application_data).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">{key.replace('_', ' ').toUpperCase()}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {application.remarks && (
              <div className="mt-4">
                <strong className="text-sm">Remarks:</strong>
                <p className="text-sm text-gray-600 mt-1">{application.remarks}</p>
              </div>
            )}

            {(profile?.role === 'officer' || profile?.role === 'staff') && (
              <div className="mt-4 flex gap-2 flex-wrap">
                {application.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(application.id, 'under_review')}
                  >
                    Start Review
                  </Button>
                )}
                {application.status === 'under_review' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(application.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusUpdate(application.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {application.status === 'approved' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(application.id, 'completed')}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
