"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSummaryContext } from "@/context/url.context";
import { useRefreshContext } from "@/context/refreshingURL.context";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SummaryWatcher() {
  // Inside SummaryWatcher.tsx
  const [watchStartTime] = useState(() => new Date().toISOString());

  const router = useRouter();
  const { pendingUrl, setPendingUrl } = useSummaryContext();
  const { refreshingID, setRefreshingID } = useRefreshContext();

  const activeId = refreshingID[0];

  // // Simplify: If we have a pendingUrl, use it. If not, try ID.
  // const pollUrl = pendingUrl
  //   ? `/api/check-status?url=${encodeURIComponent(pendingUrl)}`
  //   : activeId
  //     ? `/api/check-status?id=${activeId}&sentAt=${watchStartTime}`
  //     : null;
  // 2. Append &sentAt to the URL
  const pollUrl = pendingUrl
    ? `/api/check-status?url=${encodeURIComponent(pendingUrl)}&sentAt=${watchStartTime}`
    : activeId
      ? `/api/check-status?id=${activeId}&sentAt=${watchStartTime}`
      : null;

  const { data, error } = useSWR(pollUrl, fetcher, {
    refreshInterval: 2000,
    revalidateOnFocus: true,
  });

  // Debugging logs - VERY IMPORTANT
  useEffect(() => {
    console.log("Watcher Pulse:", {
      pollUrl,
      isDone: data?.isDone,
      title: data?.title,
      error: error,
    });
  }, [data, pollUrl, error]);

  // useEffect(() => {
  //   if (data?.isDone) {
  //     console.log("MATCH FOUND! Triggering UI updates...");

  //     toast.success(`Summary ready: ${data.title}`, {
  //       position: "bottom-right",
  //     });

  //     // 1. Clear the states FIRST to stop the skeleton/polling
  //     if (pendingUrl) setPendingUrl(null);
  //     if (activeId) {
  //       setRefreshingID((prev) => prev.filter((id) => id !== activeId));
  //     }

  //     // 2. Refresh the server data
  //     router.refresh();
  //   }
  // }, [data?.isDone, activeId, pendingUrl, router]);
  useEffect(() => {
    if (data?.isDone) {
      // 1. Clear polling states
      setPendingUrl(null);
      setRefreshingID([]);

      // 2. Redirect to the ID (even if it's the same ID)
      // Adding a dummy query param like ?updated=... forces Next.js to re-render the segment
      // router.push(`/history`);
      window.location.reload();
    }
  }, [data?.isDone]);

  return null;
}

// // export function SummaryWatcher() {
// //   const router = useRouter();
// //   // 1. Only use Context. No more props needed!
// //   const { pendingUrl, setPendingUrl } = useSummaryContext();
// //   const { refreshingID, setRefreshingID } = useRefreshContext();
// //   const activeId = refreshingID[0];

// //   const { data } = useSWR(
// //     pendingUrl
// //       ? `/api/check-status?url=${encodeURIComponent(pendingUrl)}`
// //       : null,
// //     fetcher,
// //     { refreshInterval: 3000 },
// //   );

// //   useEffect(() => {
// //     // This log will help you see the exact moment isDone turns true
// //     console.log("Watcher Status:", {
// //       pendingUrl,
// //       refreshingID,
// //       dataReceived: data,
// //     });

// //     if (data?.isDone) {
// //       toast.success(`Summary ready: ${data.title}`, {
// //         position: "bottom-right",
// //         autoClose: 5000,
// //       });

// //       // 2. Trigger Next.js to fetch the new card from the server
// //       router.refresh();

// //       // 3. Clear the context! This stops the pulse and the polling loop.
// //       setPendingUrl(null);
// //       setRefreshingID((prev) => prev.filter((id) => id !== activeId));
// //     }
// //   }, [data, setPendingUrl, router, pendingUrl, activeId]);

// //   return null;
// // }

// // export function SummaryWatcher() {
// //   const router = useRouter();
// //   const { pendingUrl, setPendingUrl } = useSummaryContext();
// //   const { refreshingID, setRefreshingID } = useRefreshContext();

// //   const activeId = refreshingID[0];

// //   // 1. We need a way to get the URL for an ID.
// //   // If you don't have a list of all summaries here, you might need to
// //   // pass the 'activeURL' into your RefreshContext as well.

// //   const pollUrl = pendingUrl
// //     ? `/api/check-status?url=${encodeURIComponent(pendingUrl)}`
// //     : activeId
// //     ? `/api/check-status?id=${activeId}` // Make sure your API can handle ?id=
// //     : null;

// //   const { data } = useSWR(pollUrl, fetcher, {
// //     refreshInterval: 2000,
// //     revalidateOnFocus: true
// //   });

// //   useEffect(() => {
// //     if (data?.isDone) {
// //       toast.success(`Summary ready: ${data.title}`);

// //       router.refresh();

// //       // Clean up both possible states
// //       if (pendingUrl) setPendingUrl(null);
// //       setRefreshingID((prev) => prev.filter((id) => id !== activeId));
// //     }
// //   }, [data?.isDone]);

// //   return null;
// // }

// export function SummaryWatcher() {
//   const router = useRouter();
//   const { pendingUrl, setPendingUrl } = useSummaryContext();
//   const { refreshingID, setRefreshingID } = useRefreshContext();

//   const activeId = refreshingID[0];

//   // 1. We need a way to get the URL for an ID.
//   // If you don't have a list of all summaries here, you might need to
//   // pass the 'activeURL' into your RefreshContext as well.

//   const pollUrl = pendingUrl
//     ? `/api/check-status?url=${encodeURIComponent(pendingUrl)}`
//     : activeId
//       ? `/api/check-status?id=${activeId}` // Make sure your API can handle ?id=
//       : null;

//   const { data } = useSWR(pollUrl, fetcher, {
//     refreshInterval: 2000,
//     revalidateOnFocus: true,
//   });

//   useEffect(() => {
//     // This log will help you see the exact moment isDone turns true
//     console.log("Watcher Status:", {
//       pendingUrl,
//       refreshingID,
//       dataReceived: data,
//     });
//   }, []);

//   useEffect(() => {
//     if (data?.isDone) {
//       toast.success(`Summary ready: ${data.title}`);

//       router.refresh();

//       // Clean up both possible states
//       if (pendingUrl) setPendingUrl(null);
//       setRefreshingID((prev) => prev.filter((id) => id !== activeId));
//     }
//   }, [data?.isDone]);

//   return null;
// }
