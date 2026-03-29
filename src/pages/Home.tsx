import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, Bolt, MessageSquare, Lightbulb, ExternalLink, Database } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_SUMMARIES } from '../types';
import { summarizeUrl } from '../services/geminiService';

export function Home() {
  const [url, setUrl] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const latestSummary = MOCK_SUMMARIES[0];

  const handleSummarize = async () => {
    if (!url) return;
    setIsSummarizing(true);
    try {
      // In a real app, we'd add the result to history
      await summarizeUrl(url);
      alert("Summary generated! (Simulation: check history for examples)");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="px-6 max-w-4xl mx-auto space-y-12">
      {/* Input Section */}
      <section>
        <div className="flex flex-col gap-4">
          <div className="relative group">
            <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-outline text-xl" size={20} />
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste URL to summarize..."
              className="w-full pl-14 pr-6 py-4 bg-surface-container-lowest rounded-lg border border-outline-variant/20 focus:border-primary/40 focus:ring-0 text-on-surface placeholder:text-outline transition-all font-body text-base"
            />
          </div>
          <button 
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="bg-primary text-on-primary px-8 py-4 rounded-lg font-headline font-bold text-base hover:bg-primary-dim active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isSummarizing ? 'Summarizing...' : 'Summarize'}</span>
            <Bolt size={20} className={isSummarizing ? 'animate-pulse' : ''} />
          </button>
        </div>
      </section>

      {/* Latest Summary Content */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
          <h2 className="font-headline font-extrabold text-2xl tracking-tight text-on-surface">Latest Summary</h2>
          <div className="flex items-center gap-2 text-outline text-[10px] font-bold uppercase tracking-widest">
            <span>Source</span>
            <Database size={14} className="text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Summary Card */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5">
                <MessageSquare size={20} className="text-[#FF4500]" />
                <span className="text-xs font-bold font-headline uppercase tracking-wide text-on-surface/70">
                  {latestSummary.source}
                </span>
              </div>
              <span className="text-outline font-body text-[11px] uppercase tracking-wider font-semibold">
                {latestSummary.readTime}
              </span>
            </div>

            <h3 className="font-headline font-extrabold text-2xl mb-6 leading-tight text-primary">
              {latestSummary.title}
            </h3>

            <div className="space-y-6 text-on-surface/80 leading-relaxed text-base font-body">
              <p>{latestSummary.content}</p>
              
              <div className="p-5 bg-surface-container-low rounded-lg border-l-2 border-primary/30">
                <div className="flex gap-3">
                  <Lightbulb size={20} className="text-primary flex-shrink-0" />
                  <p className="text-sm italic leading-relaxed">
                    Summary: {latestSummary.keyTakeaway}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link 
                to={`/article/${latestSummary.id}`}
                className="text-primary font-headline text-xs font-bold flex items-center gap-1.5 hover:text-primary-dim transition-colors uppercase tracking-wider"
              >
                <ExternalLink size={14} />
                View Original Post
              </Link>
            </div>
          </motion.article>

          {/* Comments & Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <aside className="md:col-span-2 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm">
              <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-outline mb-8 flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                Top User Comments
              </h4>
              <div className="space-y-8">
                {latestSummary.comments?.map((comment, i) => (
                  <div key={i} className="border-l border-outline-variant/20 pl-6 py-1">
                    <p className="text-on-surface font-body text-sm leading-relaxed mb-3">
                      "{comment.text}"
                    </p>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest">
                      — {comment.handle}
                    </span>
                  </div>
                ))}
              </div>
            </aside>

            <div className="bg-primary rounded-xl p-8 text-on-primary flex flex-col justify-center items-center text-center shadow-lg shadow-primary/10">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-4 opacity-70">Engagement</p>
              <p className="text-4xl font-extrabold font-headline mb-2">{latestSummary.engagement}</p>
              <p className="text-[11px] font-medium opacity-80 uppercase tracking-wider">Active discussions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
