"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NewCenterForm } from "@/components/forms/newCenterForm";

// TODO: Add role-based access control
// This should check if user is admin before allowing access

export default function AddCenterPage() {
  const router = useRouter();

  const handleSubmit = (data: {
    name: string;
    phone: string;
    address: string;
  }) => {
    // TODO: Implement API call to add center
    console.log("Adding center:", data);
    // After successful addition, redirect to centers page
    router.push("/centers");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/centers")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Centers
            </Button>
          </div>

          <Card>
            <CardContent>
              <NewCenterForm onSubmit={handleSubmit} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
