import { generateText, tool } from "ai";
import z from "zod";
import { google } from "@ai-sdk/google";

const fullPrompt = `
Summarize this article

Guidelines:
- Ignore metadata like "Article Link" or "Source".
- Summarize the technical specs and benchmark claims.
- Format: One short paragraph + 3 bullet points. 
- Strictly follow the example format
example {
A second-year CSE student from a tier 3-4 college is seeking guidance for their goal of pursuing a Master's degree abroad, expressing concerns about the lack of passion among peers and the potential impact of AI on coding jobs. They are currently self-learning Git and GitHub but are unsure about what other technical skills or courses to pursue, questioning the value of traditional coding education versus a more intuitive "vibe coding" approach.

Key Takeaways
*The student is concerned about job displacement due to AI and questions the effort required for "proper coding" versus "vibe coding."
*They are looking for recommendations on what technical skills to teach themselves that will remain relevant in a rapidly changing tech landscape.
*The student is actively seeking valuable courses, such as those on Generative AI, that will be beneficial for their career and graduate studies by the time they graduate.
  } 
`;

const summarizeArticle = tool({
  description: "Summarize the article from the given URL",
  inputSchema: z.object({
    url: z.string().describe("url of the article"),
  }),
  execute: async ({ url }) => {
    const { text: summary } = await generateText({
      model: google("gemini-3-flash-preview"),
      prompt: "",
    });
  },
});
