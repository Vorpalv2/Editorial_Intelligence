import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles, Microscope, Leaf, BadgeCheck, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_SUMMARIES } from '../types';

export function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const summary = MOCK_SUMMARIES.find(s => s.id === id) || MOCK_SUMMARIES[0];

  return (
    <div className="px-6 max-w-2xl mx-auto space-y-12">
      {/* Hero & Title */}
      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-xl aspect-[16/9] shadow-sm">
          <img 
            src={summary.imageUrl || "https://picsum.photos/seed/detail/1200/800"} 
            alt={summary.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-black/5 flex items-center gap-2">
              <Microscope size={14} className="text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Research AI</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-on-surface-variant text-[11px] font-medium uppercase tracking-widest">
            <span className="text-primary font-bold">{summary.source}</span>
            <span className="w-1 h-1 bg-outline-variant rounded-full" />
            <span>{summary.date}</span>
            <span className="w-1 h-1 bg-outline-variant rounded-full" />
            <span>{summary.readTime}</span>
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-on-surface">
            {summary.title}
          </h2>
        </div>
      </section>

      <div className="thin-divider" />

      {/* Detailed Summary View */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 py-2 border-b border-outline-variant/30">
          <Sparkles size={20} className="text-primary" />
          <h3 className="font-headline text-lg font-bold text-on-surface">Curated Summary</h3>
        </div>
        <div className="space-y-6">
          <p className="leading-relaxed text-on-surface/80 text-lg font-body">
            {summary.content}
          </p>
          <p className="leading-relaxed text-on-surface/80 text-lg border-l-2 border-primary/20 pl-6 italic font-body">
            "{summary.keyTakeaway}"
          </p>
        </div>

        {/* Takeaways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="group">
            <div className="flex items-center gap-3 mb-2">
              <Microscope size={20} className="text-primary" />
              <h4 className="font-headline font-bold text-sm uppercase tracking-wide">Generative Precision</h4>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed font-body">
              Algorithms optimize load-bearing paths that human engineers might overlook, saving tons of steel and concrete.
            </p>
          </div>
          <div className="group">
            <div className="flex items-center gap-3 mb-2">
              <Leaf size={20} className="text-primary" />
              <h4 className="font-headline font-bold text-sm uppercase tracking-wide">Eco-Structuralism</h4>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed font-body">
              AI directly correlates structural integrity with carbon footprint reduction, enabling truly sustainable mega-cities.
            </p>
          </div>
        </div>
      </section>

      <div className="thin-divider" />

      {/* Analysis Points */}
      <section className="space-y-6">
        <h3 className="font-headline text-xl font-extrabold text-on-surface">Analysis Points</h3>
        <ul className="space-y-6">
          <li className="flex gap-4 items-start">
            <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-on-surface font-bold text-sm">Real-time Simulation</p>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body">
                Design phases are shrinking from months to days through high-velocity computation and predictive modeling.
              </p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-on-surface font-bold text-sm">Material Innovation</p>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body">
                AI helps predict the performance of new bio-materials before physical testing begins in the lab.
              </p>
            </div>
          </li>
        </ul>
      </section>

      <div className="thin-divider" />

      {/* Insights */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-xl font-extrabold text-on-surface">Community Lens</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-2 py-1 bg-surface-container-low rounded">
            {summary.comments?.length || 0} Discussions
          </span>
        </div>
        <div className="space-y-10">
          {summary.comments?.map((comment, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-primary font-bold text-xs uppercase">
                  {comment.author.substring(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-xs text-on-surface">{comment.handle}</p>
                    {comment.verified && <BadgeCheck size={12} className="text-primary" />}
                  </div>
                  <p className="text-[9px] text-on-surface-variant uppercase font-semibold">{comment.role || 'Contributor'}</p>
                </div>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed pl-11 font-body">
                "{comment.text}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="pt-8 pb-12">
        <button className="w-full h-14 bg-primary text-on-primary font-headline font-bold text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-primary-dim active:scale-[0.98] transition-all shadow-sm">
          Read Full Original Article
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}
