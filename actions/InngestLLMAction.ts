import summarizeRedditTool from "@/ai/tools/summarizeRedditPostTool";
import { prisma } from "@/src/prisma";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { type SummaryDepthModeEnum } from "@/src/generated/prisma/client";
import { auth } from "@clerk/nextjs/server";

type SummaryForDBSave = {
  source: string;
  title: string;
  topComments: string[];
  summarizedText: string;
  takeAways: string[];
  summaryDepthMode: SummaryDepthModeEnum;
  commentAnalysis: string[];
  userId: string;
};

type ReturnOutputType = {
  summarizedText: string;
  commentAnalysis: string[];
  takeAways: string[];
};

type ReceivedInputType = {
  title: string;
  description: string;
  url: string;
  comment: string[];
};

// enum SummaryModeType {
//   Comprehensive = "Comprehensive",
//   Concise = "Concise",
//   Balanced = "Balanced",
// }

export default async function InngestLLMAction(
  content: ReceivedInputType,
  summaryMode: SummaryDepthModeEnum,
  userId: string,
) {
  const alreadyExists = await prisma.summarizedData.findFirst({
    where: { source: content.url },
  });

  if (alreadyExists) return null;

  const output = await generateText({
    model: google("gemini-3-flash-preview"), // Use stable model naming
    tools: {
      summarize: summarizeRedditTool, // Pass the tool definition here
    },
    // Provide the data context so the LLM knows what to pass to the tool
    prompt: `Summarize this Reddit post using the following data: ${JSON.stringify(content)} and by using the given summary mode ${summaryMode}`,
    // ToolChoice: 'required' forces it to use the tool immediately
    toolChoice: "required",
    // stopWhen: stepCountIs(1),
  });

  const toolResult = output.toolResults[0]?.output as ReturnOutputType;

  const newSummary = {
    source: content.url,
    title: content.title,
    topComments: content.comment,
    summarizedText: toolResult.summarizedText,
    takeAways: toolResult.takeAways,
    summaryDepthMode: summaryMode,
    commentAnalysis: toolResult.commentAnalysis,
    userId: userId,
  };

  return newSummary as SummaryForDBSave;
}
