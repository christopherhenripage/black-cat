"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["NEW", "CONFIRMED", "CLOSED"] as const;

const statusColors = {
  NEW: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  CLOSED: "bg-gray-100 text-gray-600 border-gray-200",
};

export function RequestStatusUpdater({
  requestId,
  currentStatus,
}: {
  requestId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      router.refresh();
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={isUpdating}
      className={`text-xs px-2 py-1 rounded border ${
        statusColors[currentStatus as keyof typeof statusColors] ||
        statusColors.NEW
      } disabled:opacity-50`}
    >
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
