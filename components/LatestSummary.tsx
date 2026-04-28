"use server";
import { GetLatestPost } from "@/actions/summarize.prisma";
import { ArticleMotion } from "@/helpers/Motion";
import RefactorURL from "@/helpers/RefactorURL";
import { Database, ExternalLink, Lightbulb, MessageSquare } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server"; // Import auth

export default async function LatestSummary() {
  const { userId } = await auth();
  if (!userId)
    return <h1 className="text-center">You need to be logged in to view</h1>;
  const latestSummary = await GetLatestPost(userId);
  if (!latestSummary) return <h1 className="text-center">Nothing to Show</h1>;
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
        <h2 className="font-headline font-extrabold text-2xl tracking-tight text-on-surface">
          Latest Summary
        </h2>
        <div className="flex items-center gap-2 text-outline text-[10px] font-bold uppercase tracking-widest">
          <span>Source</span>
          <Database size={14} className="text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Main Summary Card */}
        <ArticleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm`}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2.5">
              <MessageSquare size={20} className="text-[#FF4500]" />
              <span className="text-xs font-bold font-headline uppercase tracking-wide text-on-surface/70">
                {RefactorURL(latestSummary.source)}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <span
                className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest text-white ${latestSummary.summaryDepthMode === "Balanced" ? "bg-blue-600" : latestSummary.summaryDepthMode === "Concise" ? "bg-green-600" : latestSummary.summaryDepthMode === "Comprehensive" && "bg-amber-600"}`}
              >
                {latestSummary.summaryDepthMode}
              </span>
              <span className="text-outline font-body text-[11px] uppercase tracking-wider font-semibold">
                {/* {latestSummary?.readTime || "2 mins"} */} 2 mins
              </span>
            </div>
          </div>

          <h3 className="font-headline font-extrabold text-2xl mb-6 leading-tight text-primary">
            {latestSummary.title}
          </h3>

          <div className="space-y-6 text-on-surface/80 leading-relaxed text-base font-body">
            <p>{latestSummary.summarizedText}</p>

            <div className="p-5 bg-surface-container-low rounded-lg border-l-2 border-primary/30">
              <div className="flex gap-3">
                <Lightbulb size={20} className="text-primary flex-shrink-0" />
                <p className="text-sm italic leading-relaxed">
                  Summary: {latestSummary.takeAways}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href={`/article/${latestSummary.id}`}
              className="text-primary font-headline text-xs font-bold flex items-center gap-1.5 hover:text-primary-dim transition-colors uppercase tracking-wider"
            >
              <ExternalLink size={14} />
              View Original Post
            </Link>
          </div>
        </ArticleMotion>

        {/* Comments & Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <aside className="md:col-span-2 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm">
            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-outline mb-8 flex items-center gap-2">
              <MessageSquare size={18} className="text-primary" />
              Top User Comments
            </h4>
            <div className="space-y-8">
              {latestSummary.topComments?.map((comment, i) => (
                <div
                  key={i}
                  className="border-l border-outline-variant/20 pl-6 py-1"
                >
                  <p className="text-on-surface font-body text-sm leading-relaxed mb-3">
                    "{comment}"
                  </p>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-widest">
                    {/* — {comment.handle} */}
                  </span>
                </div>
              ))}
            </div>
          </aside>

          <div className="bg-primary rounded-xl p-8 text-on-primary flex flex-col justify-center items-center text-center shadow-lg shadow-primary/10">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-4 opacity-70">
              Engagement
            </p>
            <p className="text-4xl font-extrabold font-headline mb-2">
              {latestSummary.id}
            </p>
            <p className="text-[11px] font-medium opacity-80 uppercase tracking-wider">
              Active discussions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
