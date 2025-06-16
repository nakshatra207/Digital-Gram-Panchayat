
import React from "react";
import { useAuth } from "@/components/OptimizedAuthContext";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function Profile() {
  const { profile, isLoading } = useAuth();

  if (isLoading) return <div>Loading…</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <div className="flex justify-center mt-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div><span className="font-medium">Name:</span> {profile.full_name}</div>
            <div><span className="font-medium">Email:</span> {profile.email}</div>
            <div><span className="font-medium">Phone:</span> {profile.phone || "-"}</div>
            <div><span className="font-medium">Address:</span> {profile.address || "-"}</div>
            <div><span className="font-medium">Role:</span> {profile.role}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
