import { serve } from "inngest/next";
import { inngest } from "@/app/inngest/client"; // Your inngest client file
import { processSummary } from "@/app/inngest/FirstWorkflow"; // Your workflow function
import { RefreshSummary } from "@/app/inngest/SecondWorkflow";

export const maxDuration = 300;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processSummary, // Add your function here so Inngest can see it
    RefreshSummary,
  ],
});
