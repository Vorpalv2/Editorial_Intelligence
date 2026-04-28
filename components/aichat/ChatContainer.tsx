import React from "react";
import { Send, Sparkles } from "lucide-react";

export default function ChatContainer({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col min-h-screeen bg-surface ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="font-headline text-sm font-bold text-on-surface">
              Research Assistant
            </h3>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
              AI Analysis Online
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area - This scrolls independently */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Assistant Message */}
        <div className="flex gap-3 max-w-[90%]">
          <div className="mt-1 h-6 w-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles size={12} className="text-primary" />
          </div>
          <div className="space-y-2">
            <div className="bg-surface-container-high p-4 rounded-2xl rounded-tl-none border border-outline-variant/20 shadow-sm">
              <p className="text-sm text-on-surface-variant leading-relaxed font-body">
                Hello! I've analyzed the summary and the community discussions.
                Would you like me to dive deeper into any specific takeaway?
              </p>
            </div>
            <span className="text-[10px] text-on-surface-variant/50 font-medium uppercase px-1">
              Assistant • Just now
            </span>
          </div>
        </div>

        {/* User Message */}
        <div className="flex flex-row-reverse gap-3 max-w-[90%] ml-auto">
          <div className="space-y-2 flex flex-col items-end">
            <div className="bg-primary p-4 rounded-2xl rounded-tr-none shadow-md">
              <p className="text-sm text-on-primary leading-relaxed font-body">
                What does the community think about the eco-structuralism point?
              </p>
            </div>
            <span className="text-[10px] text-on-surface-variant/50 font-medium uppercase px-1">
              You • 1m ago
            </span>
          </div>
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="p-6 border-t border-outline-variant/30 bg-surface-container-low">
        <div className="relative group">
          <textarea
            rows={1}
            placeholder="Ask a question..."
            className="w-full bg-surface border border-outline-variant rounded-xl py-4 pl-4 pr-14 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-on-surface-variant/50"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-on-primary rounded-lg hover:bg-primary-dim transition-colors shadow-sm active:scale-95">
            <Send size={16} />
          </button>
        </div>
        <p className="text-center text-[9px] text-on-surface-variant/40 mt-3 font-medium uppercase tracking-tighter">
          Powered by Gemini 3 Flash • Research AI Mode
        </p>
      </div>
    </div>
  );
}
