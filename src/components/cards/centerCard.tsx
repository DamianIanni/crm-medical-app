"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { Center } from "@/types/center/index";
import { useSelectCenter } from "@/hooks/center/useCenter";

interface CenterCardProps {
  center: Center;
  isAdmin: boolean;
}

export function CenterCard({ center, isAdmin = false }: CenterCardProps) {
  const router = useRouter();
  const selectCenter = useSelectCenter();

  const setSelectedCenterName = (name: string) => {
    sessionStorage.setItem("selectedCenterName", name);
  };

  const setSelectedCenterCookie = (center_id: string) => {
    sessionStorage.setItem("selectedCenterId", center_id);
  };

  const handleSelectCenter = () => {
    setSelectedCenterName(center.center_name);
    setSelectedCenterCookie(center.center_id);
    selectCenter.mutateAsync({
      center_id: center.center_id,
      role: center.role,
    });
    router.replace("/dashboard");
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
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isAdmin 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {isAdmin ? 'Admin' : center.role}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
