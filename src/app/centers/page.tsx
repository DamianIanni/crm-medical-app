"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CenterCard } from "@/components/cards/centerCard";

// Mock centers data - replace with real API call
const mockCenters = [
  {
    id: "1",
    name: "Sunrise Medical Center",
    phone: "+1 (555) 123-4567",
    address: "123 Medical Plaza, Healthcare District, NY 10001",
  },
  {
    id: "2",
    name: "Valley Health Institute",
    phone: "+1 (555) 987-6543",
    address: "456 Wellness Avenue, Medical Valley, CA 90210",
  },
  {
    id: "3",
    name: "Riverside Medical Complex",
    phone: "+1 (555) 456-7890",
    address: "789 River Road, Riverside, TX 75001",
  },
  {
    id: "4",
    name: "Mountain View Healthcare",
    phone: "+1 (555) 321-0987",
    address: "321 Summit Peak, Mountain View, CO 80301",
  },
];

export default function CentersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredCenters = mockCenters.filter(
    (center) =>
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.phone.includes(searchQuery)
  );

  const handleSelectCenter = (centerId: string) => {
    // Find the selected center object
    const selected = mockCenters.find(center => center.id === centerId);
    if (selected) {
      // Store selected center name in localStorage
      localStorage.setItem('selectedCenterName', selected.name);
    }
    // Store selected center in cookies
    document.cookie = `selectedCenter=${centerId}; path=/; max-age=86400`; // 24 hours
    router.replace("/dashboard");
  };

  const handleAddCenter = () => {
    router.push("/centers/new");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Medical Centers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select a medical center to continue working
          </p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center) => (
            <div key={center.id} onClick={() => handleSelectCenter(center.id)}>
              <CenterCard center={center} />
            </div>
          ))}
        </div>

        {filteredCenters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No centers found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
