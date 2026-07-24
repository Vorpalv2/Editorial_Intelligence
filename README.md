# Editorial Intelligence — Project Showcase

## Overview

Editorial Intelligence is a full-stack AI-driven content curation app built with Next.js, Tailwind CSS, Prisma, Clerk, and Inngest. Its main purpose is to ingest Reddit post URLs, scrape content, summarize the article and conversation, and store the result in a database for fast retrieval and historical review.

The app is designed to feel premium with a polished UI and an intelligent workflow that keeps heavy tasks off the frontend by using background processing.

## Key Value Proposition

- Summarizes long Reddit posts and comments into concise, balanced, or comprehensive summaries.
- Preserves top user comments and AI-driven comment analysis.
- Saves summaries to a NeonDB/PostgreSQL database for history and reuse.
- Uses Inngest to handle scraping and LLM summarization asynchronously, which avoids blocking the web app and protects serverless resources.


## Tech Stack

![Static Badge](https://img.shields.io/badge/Next.js-v16-000000?logo=nextdotjs&logoColor=white&color=000000)
![Static Badge](https://img.shields.io/badge/React-v19-61DAFB?logo=react&logoColor=black&color=61DAFB)
![Static Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&color=3178C6)
![Static Badge](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&color=06B6D4)
![Static Badge](https://img.shields.io/badge/Motion-0055FF?logo=framer&logoColor=white&color=0055FF)
![Static Badge](https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui&logoColor=white&color=000000)
![Static Badge](https://img.shields.io/badge/Aceternity_UI-000000?logo=vercel&logoColor=white&color=000000)
![Static Badge](https://img.shields.io/badge/SWR-000000?logo=vercel&logoColor=white&color=000000)
![Static Badge](https://img.shields.io/badge/React_Toastify-3498DB?logo=react&logoColor=white&color=3498DB)
![Static Badge](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white&color=339933)
![Static Badge](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white&color=000000)
![Static Badge](https://img.shields.io/badge/Server_Actions-000000?logo=nextdotjs&logoColor=white&color=000000)
![Static Badge](https://img.shields.io/badge/Inngest-000000?logo=inngest&logoColor=white&color=000000)
![Static Badge](https://img.shields.io/badge/Puppeteer_Core-40B5A4?logo=puppeteer&logoColor=white&color=40B5A4)
![Static Badge](https://img.shields.io/badge/Browserless-1E293B?logo=googlechrome&logoColor=white&color=1E293B)
![Static Badge](https://img.shields.io/badge/Google_Gemini-8E75B2?logo=googlegemini&logoColor=white&color=8E75B2)
![Static Badge](https://img.shields.io/badge/Vercel_AI_SDK-000000?logo=vercel&logoColor=white&color=000000)
![Static Badge](https://img.shields.io/badge/OpenAI_SDK-412991?logo=openai&logoColor=white&color=412991)
![Static Badge](https://img.shields.io/badge/Ollama-000000?logo=ollama&logoColor=white&color=000000)
![Static Badge](https://img.shields.io/badge/LangChain-1C3C3C?logo=langchain&logoColor=white&color=1C3C3C)
![Static Badge](https://img.shields.io/badge/Pinecone-000000?logo=pinecone&logoColor=white&color=000000)
![Static Badge](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&color=4169E1)
![Static Badge](https://img.shields.io/badge/Prisma_ORM-2D3748?logo=prisma&logoColor=white&color=2D3748)
![Static Badge](https://img.shields.io/badge/NeonDB-00E599?logo=neon&logoColor=black&color=00E599)
![Static Badge](https://img.shields.io/badge/Clerk_Auth-6C47FF?logo=clerk&logoColor=white&color=6C47FF)
![Static Badge](https://img.shields.io/badge/Sanity_CMS-F03E2F?logo=sanity&logoColor=white&color=F03E2F)
![Static Badge](https://img.shields.io/badge/Resend-000000?logo=resend&logoColor=white&color=000000)
![Static Badge](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white&color=3E67B1)
![Static Badge](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white&color=3FCF8E)
![Static Badge](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&color=2496ED)
![Static Badge](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white&color=000000)

---

## Architecture

### Frontend

- `app/(NavigationLayout)/page.tsx` renders the homepage with the input section and latest summary.
- `components/InputSection.tsx` collects a Reddit URL and triggers the summary workflow using `/api/summarize`.
- `components/LatestSummary.tsx` shows the most recent summary for the logged-in user.
- `app/(NavigationLayout)/history/page.tsx` shows user history with server-side summary loading.
- `app/(NavigationLayout)/article/[id]/page.tsx` shows a detailed summary page for a selected entry.
- `components/AISlider.tsx` allows users to choose summary depth mode: `Concise`, `Balanced`, or `Comprehensive`.
- `context/aiSummaryType.context.tsx` stores the current summary mode and persists it to Clerk unsafe metadata.
- `context/url.context.tsx` keeps a `pendingUrl` state that signals the summary watcher.
- `components/SummaryWatcher.tsx` polls `/api/check-status` to detect when background summarization has finished and refreshes the UI.

### Backend

- `app/api/summarize/route.ts` receives summary requests from the client and sends an Inngest event.
- `app/inngest/client.ts` initializes the Inngest SDK client.
- `app/inngest/FirstWorkflow.ts` responds to `reddit/summarize.requested` and orchestrates scrape → LLM → save.
- `app/inngest/SecondWorkflow.ts` responds to `reddit/refresh.requested` and orchestrates refresh flows.
- `actions/scrapPost.action.ts` contains Puppeteer scraping logic for Reddit posts.
- `actions/InngestLLMAction.ts`, `actions/InngestBackupLLMAction.ts`, and `actions/InngestRefreshLLMAction.ts` handle model invocation.
- `actions/inngestSaveToDBaction.ts` and `actions/InngestUpdateInDBaction.ts` persist results to the database.

### Database

- `prisma/schema.prisma` defines the data model.
- `src/prisma.ts` configures Prisma with a PostgreSQL adapter.

Models:

- `User`: internal ID, Clerk ID, email, optional username/image, join date, and relation to summaries.
- `SummarizedData`: stores title, summarized text, source URL, selected depth mode, top comments, AI comment analysis, takeaways, unread state, timestamps, and associated user.

## AI Integration

### Tool-driven AI Summarization

The core AI logic is implemented as a tool called `summarizeRedditTool` in `ai/tools/summarizeRedditPostTool.ts`.

The tool:

- Defines a strict `zod` schema for input: title, description, URL, comments, and summary mode.
- Constructs a detailed, mode-aware prompt describing the expected output format.
- Uses `generateText` from the `ai` SDK with `google("gemini-3.1-flash-lite-preview")`.
- Returns structured output as an object with `summarizedText`, `commentAnalysis`, and `takeAways`.

### Prompt Strategy

- Prompts include the raw scraped Reddit title, content, URL, and comments.
- The tool enforces a summary format: one short paragraph plus three bullet points.
- It also includes a comment-analysis step, instructing the model to extract themes from the top comments.
- Summary depth is controlled by the selected mode:
  - `Concise`: tight, point-forward summaries.
  - `Balanced`: a middle-ground summary.
  - `Comprehensive`: deeper and more detailed coverage.

### LLM Fallback and Resilience

The project uses a fallback strategy to avoid failed summarization:

- `InngestLLMAction.ts` calls Gemini 3 flash preview as the primary model.
- If the primary call fails, `FirstWorkflow.ts` catches the error and calls `InngestBackupLLMAction.ts`.
- `InngestBackupLLMAction.ts` uses `gemini-2.5-flash-lite` as a secondary model.
- `InngestRefreshLLMAction.ts` uses `gemini-3.1-flash-lite-preview` when refreshing existing summaries.

### Direct Gemini API Use

There is also an example integration at `src/services/geminiService.ts` that directly uses `@google/genai` and a raw JSON prompt to summarize a general URL. This shows familiarity with both tool-driven AI workflows and raw API invocation.

## Inngest Background Workflow

### Why Inngest?

- Scraping Reddit and calling LLMs are slow operations that can exceed serverless timeouts.
- Inngest enables the app to run these tasks asynchronously in the background.
- The client can send a request, and the workflow continues without blocking the user.

### Workflow Flow

1. User submits a URL on the frontend.
2. Frontend calls `/api/summarize`.
3. The route sends an Inngest event: `reddit/summarize.requested`.
4. `app/inngest/FirstWorkflow.ts` receives the event.
5. Workflow steps:
   - `scrape-url`: run `scrapeRedditPost(url, sortType)`.
   - `get-llm-summary`: run `InngestLLMAction(...)`.
   - `save-to-db`: persist the generated summary in Prisma.
6. If the primary LLM fails, the workflow retries with `InngestBackupLLMAction`.

### Refresh Workflow

- Users can refresh a saved summary from history.
- The refresh event `reddit/refresh.requested` triggers `SecondWorkflow.ts`.
- The workflow re-scrapes the post, regenerates the summary, and updates the existing database record.

### Event-driven UX

- The app keeps a `pendingUrl` state when a summary request is outstanding.
- `components/SummaryWatcher.tsx` polls `/api/check-status` with the pending URL or refresh ID.
- When the database record is updated after background processing, the watcher reloads the page.

## Scraping Strategy

### `actions/scrapPost.action.ts`

- Uses `puppeteer-core` to scrape Reddit pages.
- In production, connects to Browserless (`browserWSEndpoint`) with a token.
- In development, launches local Chrome on macOS.
- Targets `new.reddit.com` and the Shreddit UI.
- Uses a modern user agent and a Reddit session cookie to reduce blocking.
- Extracts:
  - title
  - description/content body
  - top comments (depth 0 comments only)

### Production Considerations

- The scraper includes network idle waits, additional delays, and 403 detection.
- It uses a session cookie for authenticated access to avoid being blocked by Reddit.
- This design offloads heavy browsing and scraping away from the frontend and serverless environment.

## User Experience

### Pages

- Home: paste a URL and submit summary requests.
- History: view a paginated summary archive with search and sort.
- Detail: open a full summary card with takeaways and comment analysis.
- Settings/Login: custom Clerk-based auth flows and summary preference selection.

### Features

- Persistent user preference for summary depth.
- Background-only processing to keep the UI fast.
- Real-time “watcher” polling for workflow completion.
- History page with infinite scroll and refresh/delete controls.
- Latest summary preview on the landing page.
- Rating of summaries through mode badges and source metadata.

## Notable Implementation Details

- `SummaryDepthModeEnum` is used consistently across Prisma, context, and actions.
- `AISlider` is animated with `motion/react` and persists mode selection to Clerk metadata.
- `SummaryWatcher` uses SWR polling and page refresh once the background job completes.
- `InfiniteList` supports refreshing individual summaries and optimistic UI states.
- `LatestSummary` is server-rendered and uses Clerk auth to show personalized content.

## Recruiter / Developer Highlights

- Demonstrates full-stack capability: React/Next.js frontend, backend server routes, database modeling, and auth integration.
- Shows ability to design event-driven systems with Inngest.
- Implements resilient AI workflows with primary/fallback models.
- Uses advanced scraping logic to safely extract content from a modern web app.
- Balances user experience with backend complexity by offloading heavy tasks.
- Uses structured AI tool patterns and schema validation for predictable LLM behavior.

## File References

- `README.md` — original project summary.
- `prisma/schema.prisma` — database schema.
- `app/api/summarize/route.ts` — API entry point for summary requests.
- `app/inngest/FirstWorkflow.ts` — summary workflow.
- `app/inngest/SecondWorkflow.ts` — refresh workflow.
- `actions/scrapPost.action.ts` — Reddit scraping logic.
- `ai/tools/summarizeRedditPostTool.ts` — tool-driven AI prompt and output schema.
- `actions/InngestLLMAction.ts`, `actions/InngestBackupLLMAction.ts`, `actions/InngestRefreshLLMAction.ts` — model invocations.
- `components/InputSection.tsx`, `components/SummaryWatcher.tsx`, `components/LatestSummary.tsx` — frontend interaction flow.
- `context/aiSummaryType.context.tsx` — AI mode persistence and choice handling.
- `src/prisma.ts` — Prisma client configuration.

## Summary

Editorial Intelligence is a polished execution of an AI-assisted summarization workflow. It combines modern frontend UX, background orchestration with Inngest, resilient LLM usage, and reliable persistence. This project is especially relevant for roles that require building AI products, event-driven architecture, or modern full-stack applications with meaningful user experience.
