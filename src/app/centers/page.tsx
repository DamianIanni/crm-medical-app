"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CenterCard } from "@/components/cards/centerCard";
import { useGetAllCenters } from "@/hooks/center/useCenter";
import { CentersSkeleton } from "@/components/skeletons/centerSkeleton";
import { AlertMessage } from "@/components/feedback/AlertMessage";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Center } from "@/types/center/index";
import { AccountActions } from "@/components/nav/account-actions";

export default function CentersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const {
    data: centers,
    isPending,
    isError,
    refetch,
    isFetching,
  } = useGetAllCenters();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Esta haciendo la reuqest esperando el finalToken, por eso no esta autorizado
  // Crear condicion que en caso de que no tenga el finalToken, llame a la otra ruta

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
              Medical Centers
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Select a medical center to continue working
            </p>
          </div>
          <div className="mt-1">
            <AccountActions />
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search centers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg "
            />
          </div>
          <Button onClick={handleAddCenter}>Add New Center</Button>
        </div>

        {(isPending || isFetching) && <CentersSkeleton isMobile={isMobile} />}
        {isError && (
          <div className="w-full max-w-2xl flex flex-col items-center justify-center mx-auto mt-10">
            <AlertMessage
              title="Error loading list of centers"
              description={`CODE: 3001 - Report this to Aisel team.`}
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        )}
        {!isPending && !isFetching && !isError && centers && (
          <div className="space-y-8">
            {/* My Centers (Admin) Section - Only show if there are admin centers or no search query */}
            {(filteredCenters?.some(center => center.role === 'admin') || !searchQuery) && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-foreground">My Centers</h2>
                {filteredCenters?.filter(center => center.role === 'admin').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCenters
                      .filter(center => center.role === 'admin')
                      .map((center) => (
                        <CenterCard key={center.center_id} center={center} isAdmin={true} />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? "No admin centers match your search."
                        : "You don't have any centers yet."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Invited Centers Section - Only show if there are invited centers or no search query */}
            {(filteredCenters?.some(center => center.role !== 'admin') || !searchQuery) && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-foreground">Invited Centers</h2>
                {filteredCenters?.filter(center => center.role !== 'admin').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCenters
                      .filter(center => center.role !== 'admin')
                      .map((center) => (
                        <CenterCard key={center.center_id} center={center} isAdmin={false} />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? "No invited centers match your search."
                        : "You haven't been invited to any centers yet."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* No results message - Only show if there are no centers at all */}
            {filteredCenters?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No centers found matching your search.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
