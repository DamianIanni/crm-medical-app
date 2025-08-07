"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, MapPin } from "lucide-react";
import Actions from "@/components/tables/actions";
import { useRouter } from "next/navigation";
import { Center } from "@/types/center/index";

interface CenterCardProps {
  center: Center;
}

export function CenterCard({ center }: CenterCardProps) {
  const router = useRouter();

  const handleSelectCenter = () => {
    // Store selected center name in localStorage
    localStorage.setItem("selectedCenterName", center.name);
    // Store selected center in cookies
    document.cookie = `selectedCenter=${center.id}; path=/; max-age=86400`; // 24 hours
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
            {center.name}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-1 flex-grow px-4 pb-2 pt-0">
        <div className="flex items-start gap-1">
          <Phone className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <CardDescription className="text-sm text-gray-600 dark:text-gray-300 break-words text-left">
            {center.phone}
          </CardDescription>
        </div>

        <div className="flex items-start gap-1">
          <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <CardDescription className="text-sm text-gray-600 dark:text-gray-300 break-words text-left">
            {center.address}
          </CardDescription>
        </div>
      </CardContent>

      <div className="flex justify-end px-4 pb-2 pt-0">
        <Actions data={center} route="centers" inInfo={false} />
      </div>
    </Card>
  );
}
