import { RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function PageRefresher() {
  const [lastUpdatedTime, setLastUpdatedTime] = useState<Date | undefined>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  function ButtonClickHandler() {
    setIsRefreshing(true);
    router.refresh();
    // Simulate an async operation (like an API call)
    setLastUpdatedTime(new Date());
    setIsRefreshing(false);
  }

  return (
    <div className="flex items-center gap-2">
      <span>
        Last Refreshed:{" "}
        {lastUpdatedTime ? lastUpdatedTime.toLocaleTimeString() : "Never"}
      </span>

      <button
        onClick={ButtonClickHandler}
        disabled={isRefreshing}
        className={isRefreshing ? "animate-spin opacity-50" : ""}
      >
        <RefreshCwIcon size={16} />
      </button>
    </div>
  );
}
