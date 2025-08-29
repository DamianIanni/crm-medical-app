"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileForm } from "@/components/forms/profile-form";
import { ProfileFormSkeleton } from "@/components/skeletons/profileFormSkeleton";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/AuthProvider";
import { PageAnimationWrapper } from "@/components/wrappers/pageAnimationWrapper";

export default function AccountPage() {
  const { user, isUserPending, isUserFetching, isErrorUser } = useAuth();
  const router = useRouter();
  const t = useTranslations("AccountPage");

  if (isUserPending || isUserFetching) {
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
                  {t("description")}
                </p>
              </div>
              <ProfileFormSkeleton />
            </div>
          </div>
        </DashboardPageWrapper>
      </PageAnimationWrapper>
    );
  }

  if (isErrorUser) {
    return (
      <PageAnimationWrapper>
        <DashboardPageWrapper className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("backButton")}
              </Button>
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
                <h2 className="mb-2 text-xl font-semibold text-red-800 dark:text-red-100">
                  {t("errorTitle")}
                </h2>
                <p className="mb-4 text-red-700 dark:text-red-300">
                  {t("errorDescription")}
                </p>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-800 hover:bg-red-100 dark:border-red-700 dark:text-red-200 dark:hover:bg-red-800/30"
                  onClick={() => window.location.reload()}
                >
                  {t("errorButton")}
                </Button>
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
                {t("description")}
              </p>
            </div>
            <Card>
              <CardContent>
                <ProfileForm user={user} />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardPageWrapper>
    </PageAnimationWrapper>
  );
}
