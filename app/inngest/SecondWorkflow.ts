import InngestLLMAction from "@/actions/InngestLLMAction";
import { scrapeRedditPost } from "@/actions/scrapPost.action";
import { inngest } from "./client";
import InngestSaveToDB from "@/actions/inngestSaveToDBaction";
import InngestDeleteFromDB from "@/actions/InngestDeleteFromDBaction";
import { InngestUpdateSummaryInDB } from "@/actions/InngestUpdateInDBaction";
import InngestRefreshLLMAction from "@/actions/InngestRefreshLLMAction";

export const RefreshSummary = inngest.createFunction(
  { id: "refresh-summary", triggers: { event: "reddit/refresh.requested" } },
  async ({ event, step }) => {
    // Step 1: Scrape the data
    const { url, sortType, summaryMode, id, userId } = event.data;
    console.log(summaryMode, "summary mode in inngest");
    const content = await step.run("scrape-url", async () => {
      return await scrapeRedditPost(url, sortType);
    });

    // Step 2: Hit the LLM (This can take 30s+)
    if (!content || !content.title) {
      console.error("Scraper returned insufficient data. Aborting flow.");

      // Optional: You can trigger a cleanup step or a failure notification here
      return { status: "failed", reason: "Scraper error" };
    }
    const summary = await step.run("get-llm-summary", async () => {
      return await InngestRefreshLLMAction(content, summaryMode, userId);
    });

    if (summary) {
      await step.run("update-in-db", async () => {
        return await InngestUpdateSummaryInDB({ data: summary, id: id });
      });
    } else {
      console.error("no summary generated, aborting control flow");

      return { status: "failed", reason: "no summary generated" };
    }

    return { status: "success" };
  },
);
