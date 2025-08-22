"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CenterCard } from "@/components/cards/centerCard";
import { useGetAllCenters } from "@/hooks/center/useCenter";
import { CentersSkeleton } from "@/components/skeletons/centerSkeleton";
import { AlertMessage } from "@/components/feedback/AlertMessage";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Center } from "@/types/center/index";
import { AccountActions } from "@/components/nav/account-actions";
import { useAuth } from "@/components/providers/AuthProvider";

export default function CentersPage() {
  const t = useTranslations("CentersPage");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  const {
    data: centers,
    isPending,
    isError,
    refetch,
    isFetching,
  } = useGetAllCenters(user!.id);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const filteredCenters: Center[] = centers?.filter(
    (center) =>
      center.center_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.center_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.center_phone.includes(searchQuery)
  );

  const handleAddCenter = () => {
    router.push("/centers/new");
  };

  return (
    <div className="min-h-screen min-w-screen p-4 bg-background">
      <div className="h-[calc(100vh-2rem)] w-full max-w-[2000px] mx-auto rounded-2xl bg-sidebar p-6 overflow-y-auto flex flex-col">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t("title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <AccountActions />
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="h-10 w-full pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <Button className="h-10" onClick={handleAddCenter}>{t("addCenter")}</Button>
        </div>

        {(isPending || isFetching) && <CentersSkeleton isMobile={isMobile} />}
        {isError && (
          <div className="w-full max-w-2xl flex flex-col items-center justify-center mx-auto mt-10">
            <div className="space-y-4">
              <AlertMessage
                title={t("error.title")}
                description={t("error.description")}
                variant="error"
              />
              <Button variant="outline" onClick={() => refetch()}>
                {t("error.retry")}
              </Button>
            </div>
          </div>
        )}
        {!isPending && !isFetching && !isError && centers && (
          <div className="space-y-8">
            {/* My Centers (Admin) Section - Only show if there are admin centers or no search query */}
            {(filteredCenters?.some((center) => center.role === "admin") ||
              !searchQuery) && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  {t("myCenters")}
                </h2>
                {filteredCenters?.filter((center) => center.role === "admin")
                  .length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCenters
                      .filter((center) => center.role === "admin")
                      .map((center) => (
                        <CenterCard
                          key={center.center_id}
                          center={center}
                          isAdmin={true}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">
                      {searchQuery ? t("noAdminCenters") : t("noCentersYet")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Invited Centers Section - Only show if there are invited centers or no search query */}
            {(filteredCenters?.some((center) => center.role !== "admin") ||
              !searchQuery) && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  {t("invitedCenters")}
                </h2>
                {filteredCenters?.filter((center) => center.role !== "admin")
                  .length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCenters
                      .filter((center) => center.role !== "admin")
                      .map((center) => (
                        <CenterCard
                          key={center.center_id}
                          center={center}
                          isAdmin={false}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? t("noInvitedCenters")
                        : t("noInvitedCentersYet")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* No results message - Only show if there are no centers at all */}
            {filteredCenters?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("noCenters")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
