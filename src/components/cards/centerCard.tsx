"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, MapPin } from "lucide-react";
import React from "react";
import { Center } from "@/types/center/index";
import { useSelectCenter } from "@/hooks/center/useCenter";
import { ToastFeedback } from "../feedback/toastFeedback";
import { Button } from "../ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import { RoleBadge } from "../badges/role-badge";
import { useTranslations } from "next-intl";

interface CenterCardProps {
  center: Center;
  isAdmin: boolean;
}

export function CenterCard({ center }: CenterCardProps) {
  const t = useTranslations("CenterCard");
  const selectCenter = useSelectCenter();
  const {
    acceptInvitation,
    rejectInvitation,
    isAcceptInvitationPending,
    isRejectInvitationPending,
  } = useAuth();

  React.useEffect(() => {
    if (isAcceptInvitationPending || isRejectInvitationPending) {
      return;
    }
  }, [isAcceptInvitationPending, isRejectInvitationPending]);

  const handleAcceptInvitation = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await acceptInvitation(center.center_id);
      ToastFeedback({
        type: "success",
        title: t("invitationAccepted.title"),
        description: t("invitationAccepted.description"),
      });
    } catch (err) {
      console.error("Error accepting invitation:", err);
      ToastFeedback({
        type: "error",
        title: t("error.title"),
        description: t("error.description"),
      });
    }
  };

  const handleRejectInvitation = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await rejectInvitation(center.center_id);
      ToastFeedback({
        type: "info",
        title: t("invitationRejected.title"),
        description: t("invitationRejected.description"),
      });
    } catch (err) {
      console.error("Error rejecting invitation:", err);
      ToastFeedback({
        type: "error",
        title: t("error.title"),
        description: t("error.description"),
      });
    }
  };

  const setSelectedCenterName = (name: string) => {
    sessionStorage.setItem("selectedCenterName", name);
  };

  const setSelectedCenterCookie = (center_id: string) => {
    sessionStorage.setItem("selectedCenterId", center_id);
  };

  const handleSelectCenter = () => {
    if (center.status === "pending") {
      ToastFeedback({
        type: "info",
        title: t("invitationPending.title"),
        description: t("invitationPending.description"),
      });
      return;
    }

    setSelectedCenterName(center.center_name);
    setSelectedCenterCookie(center.center_id);
    selectCenter.mutateAsync({
      center_id: center.center_id,
      role: center.role,
    });
  };

  return (
    <Card
      onClick={() => handleSelectCenter()}
      className="bg-background  hover:shadow-lg hover:scale-[1.025] transition-all duration-200 ease-in-out flex flex-col h-full cursor-pointer "
    >
      <CardHeader className="pb-1 px-4">
        <div className="flex items-center gap-1 mb-0.5">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2 text-left">
            {center.center_name}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-1 flex-grow px-4 pb-2 pt-0">
        <div className="flex items-start gap-1">
          <Phone className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <CardDescription className="text-sm text-gray-600 dark:text-gray-300 break-words text-left">
            {center.center_phone}
          </CardDescription>
        </div>

        <div className="flex items-start justify-between w-full">
          <div className="flex items-start gap-1">
            <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <CardDescription className="text-sm text-gray-600 dark:text-gray-300 break-words text-left">
              {center.center_address}
            </CardDescription>
          </div>
          <RoleBadge role={center.role} />
        </div>

        {center.status === "pending" && (
          <div className="mt-6 flex justify-end gap-4 w-full">
            <Button
              onClick={handleRejectInvitation}
              variant="outline"
              className="flex-1 gap-2"
              disabled={isRejectInvitationPending}
            >
              {isRejectInvitationPending
                ? t("buttons.rejecting")
                : t("buttons.reject")}
            </Button>
            <Button
              onClick={handleAcceptInvitation}
              className="flex-1 gap-2"
              disabled={isAcceptInvitationPending}
            >
              {isAcceptInvitationPending
                ? t("buttons.accepting")
                : t("buttons.accept")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
