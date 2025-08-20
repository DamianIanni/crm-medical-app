import { Center } from "@/types/center";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Actions from "@/components/tables/actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export type CenterStats = Center & {
  total_patients: number;
  total_users: number;
};

interface CenterInfoProps {
  data: CenterStats;
}

/**
 * CenterInfo component.
 * Re-uses the visual style of EntityInfo to show a medical center's information.
 * Displays center name, phone, address, total patients and total users.
 */
export default function CenterInfo({ data }: CenterInfoProps) {
  const t = useTranslations("CenterInfo");
  const router = useRouter();
  const details: { label: string; value: string | number | undefined }[] = [
    { label: t("phone"), value: data.phone },
    { label: t("address"), value: data.address },
    { label: t("totalPatients"), value: data.total_patients },
    { label: t("totalUsers"), value: data.total_users },
  ];

  return (
    <div className="w-full max-w-2xl h-full flex flex-col rounded-xl p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t("title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("subtitle")}
        </p>
      </div>
      <Card
        className="w-full max-w-2xl h-full flex flex-col rounded-xl p-6"
        data-slot="center-info"
      >
        <CardHeader className="mb-4 px-0 pt-0">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {data.name}
            </CardTitle>
            <Actions data={data} route="centers" inInfo />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 px-0">
          {details.map((item) => (
            <div
              key={item.label}
              className="flex flex-wrap md:flex-nowrap justify-between items-center border-b pb-1 last:border-none"
            >
              <p className="text-muted-foreground min-w-[140px] text-sm font-medium leading-none">
                {item.label}
              </p>
              <p className="break-words text-right w-full md:w-auto text-sm font-medium leading-none">
                {item.value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
