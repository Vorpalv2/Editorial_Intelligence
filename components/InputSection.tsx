// components/InputSection.tsx
"use client"; // This keeps your state and buttons working
import React, { useEffect, useState, useTransition } from "react";
import SummarizeRedditAction from "@/actions/summarizeReddit.action";
import { Bolt, LinkIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useSummaryContext } from "@/context/url.context";
import { useAISummaryContext } from "@/context/aiSummaryType.context";
import { useUser } from "@clerk/nextjs";

export default function InputSection() {
  const { user } = useUser();
  // const [url, setUrl] = useState("");
  const { pendingUrl, setPendingUrl } = useSummaryContext();
  // const [isSummarizing, setIsSummarizing] = useState(false);
  // const [isPending, startTransition] = useTransition(); // 2. Initialize
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { summary } = useAISummaryContext();
  console.log(summary);

  // const handleSubmit = async (formData: FormData) => {
  //   const urlData = formData.get("url") as string;
  //   if (!urlData) return;

  //   // setIsSummarizing(true); // Start the button animation

  //   // 1. Fire a loading toast and capture its ID
  //   const toastId = toast.loading("Connecting to Reddit...", {
  //     autoClose: false, // Keep it open until we say otherwise
  //   });

  //   startTransition(async () => {
  //     try {
  //       await SummarizeRedditAction({ url: urlData, sortType: "top" });

  //       // 2. Update the toast to tell them it's safely in the background
  //       setPendingUrl(urlData);

  //       toast.update(toastId, {
  //         render: "Background process started! You can browse while we work.",
  //         type: "info",
  //         isLoading: false,
  //         autoClose: 3000, // This one will now fade out
  //       });

  //       //polling or SWR logic would come here
  //     } catch (error) {
  //       toast.update(toastId, {
  //         render: "Failed to start task.",
  //         type: "error",
  //         isLoading: false,
  //         autoClose: 5000,
  //       });
  //       // setIsSummarizing(false); // Stop on error
  //     }
  //   });
  // };

  useEffect(() => {
    if (!pendingUrl) {
      setIsSummarizing(false);
    }
  }, [pendingUrl]);

  const handleSubmit = async (formData: FormData) => {
    const urlData = formData.get("url") as string;
    if (!urlData) return;

    // 1. Instant UI Feedback
    setIsSummarizing(true);
    const toastId = toast.loading("Connecting to Reddit...");

    // Optimistically set this so the watcher starts looking
    setPendingUrl(urlData);

    try {
      // 2. The "Fire-and-Forget" API Call
      const response = await fetch("/api/summarize", {
        method: "POST",
        body: JSON.stringify({
          url: urlData,
          sortType: "top",
          summaryMode: summary,
          userId: user?.id,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to trigger");

      toast.update(toastId, {
        render: "Background process started! You're free to browse.",
        type: "info",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      // 3. Error Cleanup
      setIsSummarizing(false);
      setPendingUrl(null);
      toast.update(toastId, {
        render: "Failed to start. Check your connection.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
    // Note: We don't set setIsSummarizing(false) here because
    // we want the button to pulse until the SummaryWatcher
    // clears the pendingUrl from context!
  };

  return (
    <div className="px-6 max-w-4xl mx-auto space-y-12">
      {/* Input Section */}
      <section>
        <form action={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="relative group">
              <LinkIcon
                className="absolute left-5 top-1/2 -translate-y-1/2 text-outline text-xl"
                size={20}
              />
              <input
                type="text"
                value={pendingUrl || ""}
                name="url"
                onChange={(e) => setPendingUrl(e.target.value)}
                placeholder="Paste URL to summarize..."
                className="w-full pl-14 pr-6 py-4 bg-surface-container-lowest rounded-lg border border-outline-variant/20 focus:border-primary/40 focus:ring-0 text-on-surface placeholder:text-outline transition-all font-body text-base"
              />
            </div>
            <button
              type="submit"
              disabled={isSummarizing}
              className="bg-primary text-on-primary px-8 py-4 rounded-lg font-headline font-bold text-base hover:bg-primary-dim active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSummarizing ? "Summarizing..." : "Summarize"}</span>
              <Bolt
                size={20}
                className={isSummarizing ? "animate-pulse" : ""}
              />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
