"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityForm } from "@/components/forms/entityForm";
import { useGetCenterById } from "@/hooks/center/useCenter";
import { CenterFormSkeleton } from "@/components/skeletons/centerFormSkeleton";
import { AlertMessage } from "@/components/feedback/AlertMessage";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";

export default function EditCenterPage() {
  const router = useRouter();
  const {
    data: center,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useGetCenterById();

  if (isPending || isFetching) {
    return (
      <DashboardPageWrapper>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <CenterFormSkeleton />
          </div>
        </div>
      </DashboardPageWrapper>
    );
  }

  if (isError) {
    return (
      <DashboardPageWrapper>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="w-full flex flex-col items-center justify-center mx-auto mt-10">
              <AlertMessage
                title="Error loading center"
                description={`CODE: 3001 - Report this to Aisel team.`}
              />
              <div className="mt-4 flex justify-end">
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardPageWrapper>
    );
  }

  return (
    <DashboardPageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Edit Medical Center
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update the center information
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Edit Center Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EntityForm formType="center" mode="edit" data={center} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageWrapper>
  );
}
