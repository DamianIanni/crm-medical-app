"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityForm } from "@/components/forms/entityForm";
import { useTranslations } from "next-intl";

// TODO: Add role-based access control
// This should check if user is admin before allowing access

export default function AddCenterPage() {
  const router = useRouter();
  const t = useTranslations("NewCenterPage");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
              <EntityForm formType="center" mode={"create"} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
