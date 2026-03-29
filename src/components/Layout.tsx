import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Home, History, Settings, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 glass-header border-b border-outline-variant/15 shadow-sm shadow-on-surface/5">
        <div className="flex justify-between items-center px-6 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button className="text-primary hover:bg-surface-container-low transition-colors p-2 rounded-full active:scale-95">
              <Menu size={20} />
            </button>
            <h1 className="font-headline font-extrabold tracking-tighter text-primary text-lg uppercase">
              Editorial Intelligence
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {location.pathname.includes('/article/') && (
              <button className="text-primary hover:bg-surface-container-low transition-colors p-2 rounded-full active:scale-95">
                <Share2 size={20} />
              </button>
            )}
            <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/30 cursor-pointer active:scale-95 transition-transform">
              <img 
                src="https://picsum.photos/seed/user/100/100" 
                alt="User" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-32">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface border-t border-outline-variant/15">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center justify-center transition-all scale-95 active:scale-90",
            location.pathname === '/' ? "text-primary font-bold" : "text-outline hover:text-primary"
          )}
        >
          <Home size={24} fill={location.pathname === '/' ? "currentColor" : "none"} />
          <span className="font-label text-[11px] font-medium tracking-wider uppercase mt-1">Home</span>
        </Link>
        <Link 
          to="/history" 
          className={cn(
            "flex flex-col items-center justify-center transition-all scale-95 active:scale-90 relative",
            location.pathname === '/history' ? "text-primary font-bold" : "text-outline hover:text-primary"
          )}
        >
          <History size={24} />
          <span className="font-label text-[11px] font-medium tracking-wider uppercase mt-1">History</span>
          {location.pathname === '/history' && (
            <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
          )}
        </Link>
        <Link 
          to="/settings" 
          className={cn(
            "flex flex-col items-center justify-center transition-all scale-95 active:scale-90",
            location.pathname === '/settings' ? "text-primary font-bold" : "text-outline hover:text-primary"
          )}
        >
          <Settings size={24} fill={location.pathname === '/settings' ? "currentColor" : "none"} />
          <span className="font-label text-[11px] font-medium tracking-wider uppercase mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
