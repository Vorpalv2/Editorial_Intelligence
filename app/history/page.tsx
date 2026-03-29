'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Clock, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_SUMMARIES } from '@/src/types';
import { cn } from '@/src/lib/utils';

export default function History() {
  const [filter, setFilter] = useState<'newest' | 'oldest'>('newest');
  const [search, setSearch] = useState('');

  const filteredSummaries = MOCK_SUMMARIES
    .filter(s => s.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => filter === 'newest' ? -1 : 1);

  return (
    <div className="px-6 max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="mb-12">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your archive..."
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline font-medium text-sm"
          />
        </div>
      </div>

      {/* Header */}
      <section className="mb-12 flex items-end justify-between">
        <div className="flex flex-col">
          <h2 className="font-headline font-bold text-3xl tracking-tight text-on-surface mb-2">History</h2>
          <div className="h-1 w-12 bg-primary rounded-full mb-4" />
          <p className="text-outline font-label text-[10px] uppercase tracking-[0.25em]">
            • {filteredSummaries.length} Entries
          </p>
        </div>
        <div className="flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant/30 mb-6">
          <button 
            onClick={() => setFilter('newest')}
            className={cn(
              "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
              filter === 'newest' ? "bg-surface-container-lowest text-primary shadow-sm" : "text-outline hover:text-on-surface"
            )}
          >
            Newest
          </button>
          <button 
            onClick={() => setFilter('oldest')}
            className={cn(
              "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
              filter === 'oldest' ? "bg-surface-container-lowest text-primary shadow-sm" : "text-outline hover:text-on-surface"
            )}
          >
            Oldest
          </button>
        </div>
      </section>

      {/* List */}
      <div className="space-y-12">
        {filteredSummaries.map((summary, index) => (
          <motion.article 
            key={summary.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "group relative flex flex-col md:flex-row gap-8 pb-12 border-b border-outline-variant/30",
              index === 0 && "md:border-b-0" // First item is "featured" in layout
            )}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-primary font-label text-[10px] font-bold uppercase tracking-widest">
                  {summary.source} • 2 hours ago
                </span>
              </div>
              <Link href={`/article/${summary.id}`}>
                <h3 className="font-headline font-bold text-2xl text-on-surface mb-4 leading-snug group-hover:text-primary transition-colors">
                  {summary.title}
                </h3>
              </Link>
              <p className="text-outline text-[15px] leading-relaxed line-clamp-3 mb-6 font-body">
                {summary.content}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-primary-dim text-[11px] font-label font-bold flex items-center gap-1.5">
                  <Clock size={14} /> {summary.readTime}
                </span>
                <span className="text-outline text-[11px] font-label">{summary.date}</span>
              </div>
            </div>
            {summary.imageUrl && (
              <div className="md:w-40 flex-shrink-0">
                <div className="w-full aspect-[4/3] md:aspect-square rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant/30">
                  <img 
                    src={summary.imageUrl} 
                    alt={summary.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}
          </motion.article>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-20 mb-12 flex justify-center">
        <button className="bg-primary text-on-primary px-10 py-3.5 rounded-lg font-label text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-primary-dim transition-all active:scale-95 shadow-lg shadow-primary/10">
          Archive Retrieval (Next 10)
        </button>
      </div>
    </div>
  );
}
