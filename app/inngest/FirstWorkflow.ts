import InngestLLMAction from "@/actions/InngestLLMAction";
import { scrapeRedditPost } from "@/actions/scrapPost.action";
import { inngest } from "./client";
import InngestSaveToDB from "@/actions/inngestSaveToDBaction";
import InngestBackupLLMAction from "@/actions/InngestBackupLLMAction";

export const processSummary = inngest.createFunction(
  { id: "process-summary", triggers: { event: "reddit/summarize.requested" } },
  async ({ event, step }) => {
    // Step 1: Scrape the data
    const { url, sortType, summaryMode, userId } = event.data;
    console.log(summaryMode, "summary mode in inngest");
    const content = await step.run("scrape-url", async () => {
      return await scrapeRedditPost(url, sortType);
    });
    let summary;
    try {
      // Step 2: Hit the LLM (This can take 30s+)
      summary = await step.run("get-llm-summary", async () => {
        return await InngestLLMAction(content, summaryMode, userId);
      });
    } catch (err) {
      // Step 2: Hit the LLM (This can take 30s+)
      summary = await step.run("get-backp-llm-summary", async () => {
        return await InngestBackupLLMAction(content, summaryMode, userId);
      });
    }

    // Step 3: Save to Neon
    await step.run("save-to-db", async () => {
      if (summary) return await InngestSaveToDB(summary);
      else console.log("Record already exist, skipping database save");
    });

    return { status: "success" };
  },
);
