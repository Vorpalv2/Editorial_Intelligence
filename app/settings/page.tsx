'use client';

import React from 'react';
import { 
  ArrowLeft, 
  Search, 
  Bell, 
  Lock, 
  Palette, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  LogOut, 
  Trash2 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto w-full px-6">
      {/* Hero Title */}
      <section className="mb-16">
        <span className="font-label text-[10px] font-bold tracking-[0.1em] text-outline uppercase mb-4 block">
          Preferences
        </span>
        <h2 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface">
          Digital Curation
        </h2>
        <p className="mt-6 text-on-surface-variant text-lg leading-relaxed max-w-xl">
          Tailor your editorial experience. Adjust how information is distilled, delivered, and secured.
        </p>
      </section>

      {/* General Settings */}
      <section className="mb-14">
        <h3 className="font-headline text-sm font-bold tracking-widest text-outline uppercase mb-8 ml-1">General</h3>
        <div className="space-y-4">
          {/* Notification Item */}
          <div className="group flex items-center justify-between p-5 rounded-xl bg-surface-container-lowest ambient-diffusion border border-outline-variant/5 hover:border-outline-variant/20 transition-all">
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                <Bell size={24} />
              </div>
              <div>
                <h4 className="font-headline font-semibold text-on-surface text-base">Notifications</h4>
                <p className="text-on-surface-variant text-sm mt-0.5">Manage how you receive real-time updates</p>
              </div>
            </div>
            <label className="relative flex h-6 w-11 cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="h-full w-full rounded-full bg-surface-container-highest transition-colors peer-checked:bg-primary" />
              <div className="absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5 shadow-sm" />
            </label>
          </div>

          {/* Privacy Item */}
          <div className="group flex items-center justify-between p-5 rounded-xl bg-surface-container-lowest ambient-diffusion border border-outline-variant/5 hover:border-outline-variant/20 transition-all cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                <Lock size={24} />
              </div>
              <div>
                <h4 className="font-headline font-semibold text-on-surface text-base">Privacy & Security</h4>
                <p className="text-on-surface-variant text-sm mt-0.5">Control data visibility and encryption</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-outline" />
          </div>

          {/* Appearance Item */}
          <div className="group flex items-center justify-between p-5 rounded-xl bg-surface-container-lowest ambient-diffusion border border-outline-variant/5 hover:border-outline-variant/20 transition-all cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                <Palette size={24} />
              </div>
              <div>
                <h4 className="font-headline font-semibold text-on-surface text-base">Interface Appearance</h4>
                <p className="text-on-surface-variant text-sm mt-0.5">Switch between Light and Dark editorial modes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-label text-xs font-medium text-outline">Light Mode</span>
              <ChevronRight size={20} className="text-outline" />
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Settings */}
      <section className="mb-14">
        <h3 className="font-headline text-sm font-bold tracking-widest text-outline uppercase mb-8 ml-1">Editorial Intelligence</h3>
        <div className="space-y-4">
          {/* Summarization Depth */}
          <div className="p-6 rounded-xl bg-surface-container-lowest ambient-diffusion border border-outline-variant/5">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Sparkles size={24} className="text-primary" />
                <h4 className="font-headline font-semibold text-on-surface text-base">Summary Depth</h4>
              </div>
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Adaptive AI</span>
            </div>
            <div className="relative w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-4">
              <div className="absolute top-0 left-0 h-full w-2/3 micro-gradient" />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-outline uppercase tracking-widest">
              <span>Concise</span>
              <span className="text-primary">Balanced</span>
              <span>Comprehensive</span>
            </div>
          </div>

          {/* Source Verification */}
          <div className="group flex items-center justify-between p-5 rounded-xl bg-surface-container-lowest ambient-diffusion border border-outline-variant/5 hover:border-outline-variant/20 transition-all">
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-headline font-semibold text-on-surface text-base">Source Verification</h4>
                <p className="text-on-surface-variant text-sm mt-0.5">Cross-reference summaries with original sources</p>
              </div>
            </div>
            <label className="relative flex h-6 w-11 cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="h-full w-full rounded-full bg-surface-container-highest transition-colors peer-checked:bg-primary" />
              <div className="absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5 shadow-sm" />
            </label>
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="mb-24">
        <h3 className="font-headline text-sm font-bold tracking-widest text-outline uppercase mb-8 ml-1">Account</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-5 rounded-xl bg-surface-container-lowest border border-error/10 hover:bg-error-container/5 transition-all text-error group">
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-error-container/10">
                <LogOut size={24} />
              </div>
              <h4 className="font-headline font-semibold text-base">Sign Out</h4>
            </div>
            <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button className="w-full flex items-center justify-between p-5 rounded-xl bg-surface-container-lowest border border-error/10 hover:bg-error-container/10 transition-all text-error group">
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-error-container/20">
                <Trash2 size={24} />
              </div>
              <div className="text-left">
                <h4 className="font-headline font-semibold text-base">Deactivate Account</h4>
                <p className="text-error/70 text-sm mt-0.5">Permanently remove all summarized data</p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Footer Profile */}
      <footer className="bg-surface-container-low -mx-6 px-6 py-12 border-t border-outline-variant/15">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/alex/100/100" 
                alt="Alex" 
                className="h-16 w-16 rounded-full bg-surface-container-highest ring-4 ring-surface"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-primary border-2 border-surface" />
            </div>
            <div className="text-left">
              <h5 className="font-headline font-bold text-xl text-on-surface">Alex Rivera</h5>
              <p className="text-on-surface-variant font-medium">Premium Curator</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-lg bg-surface-container-highest text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-all">
              Support
            </button>
            <button className="px-6 py-3 rounded-lg micro-gradient text-on-primary font-semibold text-sm ambient-diffusion hover:opacity-90 transition-all">
              Upgrade Plan
            </button>
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-outline-variant/10 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-4">Editorial Intelligence v2.4.0</p>
          <p className="text-xs text-on-surface-variant/60 max-w-sm">
            This platform treats information as a precious commodity, curated with surgical precision.
          </p>
        </div>
      </footer>
    </div>
  );
}
