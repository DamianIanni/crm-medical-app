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
import { useTranslations } from "next-intl";
import { PageAnimationWrapper } from "@/components/wrappers/pageAnimationWrapper";

export default function EditCenterPage() {
  const router = useRouter();
  const t = useTranslations("EditCenterPage");

  const {
    data: center,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useGetCenterById();

  if (isPending || isFetching) {
    return (
      <PageAnimationWrapper>
        <DashboardPageWrapper className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("backButton")}
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {t("title")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("loading")}
                </p>
              </div>
              <CenterFormSkeleton />
            </div>
          </div>
        </DashboardPageWrapper>
      </PageAnimationWrapper>
    );
  }

  if (isError) {
    return (
      <PageAnimationWrapper>
        <DashboardPageWrapper className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="w-full flex flex-col items-center justify-center mx-auto mt-10">
                <AlertMessage
                  title={t("error.title")}
                  description={t("error.description")}
                />
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => refetch()}>
                    {t("error.tryAgain")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DashboardPageWrapper>
      </PageAnimationWrapper>
    );
  }

  return (
    <PageAnimationWrapper>
      <DashboardPageWrapper className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("backButton")}
              </Button>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t("title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t("subtitle")}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {t("cardTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EntityForm formType="center" mode="edit" data={center} />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardPageWrapper>
    </PageAnimationWrapper>
  );
}
