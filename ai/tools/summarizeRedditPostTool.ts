import { useAISummaryContext } from "@/context/aiSummaryType.context";
import { google } from "@ai-sdk/google";
import { generateText, tool, Output } from "ai";
import z from "zod";

const summarizeRedditTool = tool({
  description: "Summarize the reddit post from the given URL",
  inputSchema: z.object({
    title: z.string().describe("title of the reddit post"),
    description: z.string().describe("description of the reddit post"),
    url: z.string().describe("source url of the reddit post"),
    comments: z.array(z.string()),
    summaryMode: z
      .enum(["Concise", "Comprehensive", "Balanced"])
      .describe(
        'one of the three options ["Concise", "Comprehensive", "Balanced"]',
      ),
  }),
  execute: async ({ title, description, url, comments, summaryMode }) => {
    const fullPrompt = `
Summary Mode = ${summaryMode} (this will be one of the three options ["Concise", "Comprehensive", "Balanced"], based on what you recieve follow the guideline)

Summarize this news data:
Title: ${title}
Content: ${description}
Source URL: ${url}
Comments : ${comments}

Guidelines:
- Ignore metadata like "Article Link" or "Source".
- Summarize the technical specs and benchmark claims.
- Format: One short paragraph + 3 bullet points. 
- Different Summarizing Modes are present, you will receive one of the three options between ["Concise", "Comprehensive", "Balanced"], based on what you recieve, you have to summarize the post according to it. if its "Concise" then follow the straightforward approach, highlight the important points and summarize as to the point as you can, if its" Comprehensive" then you are to go as much indepth as you can to understand the post and give out a thoughtful summary of it along with points and if its "Balanced" then keep a balance between the two. However you are in no way to sway away from request Format. you can however increase the text length of inital summary if its requested as "Comprehensive" but 3 points are valid for all 3 different modes.
- Strictly follow the example format
example {
A second-year CSE student from a tier 3-4 college is seeking guidance for their goal of pursuing a Master's degree abroad, expressing concerns about the lack of passion among peers and the potential impact of AI on coding jobs. They are currently self-learning Git and GitHub but are unsure about what other technical skills or courses to pursue, questioning the value of traditional coding education versus a more intuitive "vibe coding" approach.

Key Takeaways
*The student is concerned about job displacement due to AI and questions the effort required for "proper coding" versus "vibe coding."
*They are looking for recommendations on what technical skills to teach themselves that will remain relevant in a rapidly changing tech landscape.
*The student is actively seeking valuable courses, such as those on Generative AI, that will be beneficial for their career and graduate studies by the time they graduate.

Comment Analysis (summarize this section from the ${comments} that you'd recieve)
*Comments highlight skepticism regarding culture building in remote settings, with many users noting that forced return-to-office mandates are driving attrition.
  } 
`;

    const { output } = await generateText({
      model: google("gemini-3.1-flash-lite-preview"),
      prompt: fullPrompt,
      output: Output.object({
        schema: z.object({
          summarizedText: z.string(),
          commentAnalysis: z.array(z.string()),
          takeAways: z.array(z.string()),
        }),
      }),
    });
    // console.log(text, "tool output");
    // console.log(output.commentAnalysis, "tool output");
    return output;
  },
});

export default summarizeRedditTool;
