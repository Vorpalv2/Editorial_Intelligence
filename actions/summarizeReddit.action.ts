// "use server";

// import { generateText, stepCountIs } from "ai";
// import { scrapeRedditPost } from "./scrapPost.action";
// import { google } from "@ai-sdk/google";
// import summarizeRedditTool from "@/ai/tools/summarizeRedditPostTool";
// import { prisma } from "@/src/prisma";
// import { revalidatePath } from "next/cache";

// type ReturnOutputType = {
//   summarizedText: string;
//   commentAnalysis: string[];
//   takeAways: string[];
// };

// export default async function SummarizeRedditAction({
//   url,
//   sortType,
// }: {
//   url: string;
//   sortType: string;
// }) {
//   try {
//     const scrappedData = await scrapeRedditPost(url, sortType);
//     //   console.log(scrappedData, "Scrapped");

//     const output = await generateText({
//       model: google("gemini-3.1-flash-lite-preview"), // Use stable model naming
//       tools: {
//         summarize: summarizeRedditTool, // Pass the tool definition here
//       },
//       // Provide the data context so the LLM knows what to pass to the tool
//       prompt: `Summarize this Reddit post using the following data: ${JSON.stringify(scrappedData)}`,
//       // ToolChoice: 'required' forces it to use the tool immediately
//       toolChoice: "required",
//       // stopWhen: stepCountIs(1),
//     });

//     const toolResult = output.toolResults[0]?.output as ReturnOutputType;

//     const newSummary = {
//       source: scrappedData.url,
//       title: scrappedData.title,
//       topComments: scrappedData.comment,
//       summarizedText: toolResult.summarizedText,
//       takeAways: toolResult.takeAways,
//       commentAnalysis: toolResult.commentAnalysis,
//     };

//     const createdSummary = await prisma.summarizedData.create({
//       data: newSummary,
//     });
//     revalidatePath("/");
//   } catch (error) {
//     console.log(error);
//   }
// }
