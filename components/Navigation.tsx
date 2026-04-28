"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Home,
  History,
  Settings,
  Share2,
  User,
  UserIcon,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  Show,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useAISummaryContext } from "@/context/aiSummaryType.context";
import NavigationSkeleton from "./skeleton/NavigationSkeleton";
import ShareButton from "@/helpers/usePathName";

export function Navigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { summary } = useAISummaryContext();
  const { isLoaded } = useUser();

  function CopyToClipboard() {}

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
            {!isLoaded && <NavigationSkeleton isLoadedProp={isLoaded} />}
            {isLoaded && (
              <>
                <span
                  className={`hidden md:block py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest`}
                >
                  Currently Selected Mode:
                </span>
                <span
                  className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest text-white ${summary === "Balanced" ? "bg-blue-600" : summary === "Concise" ? "bg-green-600" : summary === "Comprehensive" && "bg-amber-600"}`}
                >
                  {summary}
                </span>
                <Show when={"signed-in"}>
                  <button className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 cursor-pointer active:scale-95 transition-transform">
                    <UserButton />
                  </button>
                </Show>
              </>
            )}
            {pathname.includes("/article/") && <ShareButton />}

            <Show when={"signed-out"}>
              <SignInButton>
                <button className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 cursor-pointer active:scale-95 transition-transform">
                  <UserIcon />
                </button>
              </SignInButton>
            </Show>
            {/* <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/30 cursor-pointer active:scale-95 transition-transform">
              <Show when={"signed-in"}>
                <SignOutButton />
              </Show>
            </div> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-32">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface border-t border-outline-variant/15">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center transition-all scale-95 active:scale-90",
            pathname === "/"
              ? "text-primary font-bold"
              : "text-outline hover:text-primary",
          )}
        >
          <Home size={24} fill={pathname === "/" ? "currentColor" : "none"} />
          <span className="font-label text-[11px] font-medium tracking-wider uppercase mt-1">
            Home
          </span>
        </Link>
        <Link
          href="/history"
          className={cn(
            "flex flex-col items-center justify-center transition-all scale-95 active:scale-90 relative",
            pathname === "/history"
              ? "text-primary font-bold"
              : "text-outline hover:text-primary",
          )}
        >
          <History size={24} />
          <span className="font-label text-[11px] font-medium tracking-wider uppercase mt-1">
            History
          </span>
          {pathname === "/history" && (
            <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
          )}
        </Link>
        <Link
          href="/setting"
          className={cn(
            "flex flex-col items-center justify-center transition-all scale-95 active:scale-90",
            pathname === "/settings"
              ? "text-primary font-bold"
              : "text-outline hover:text-primary",
          )}
        >
          <Settings
            size={24}
            fill={pathname === "/settings" ? "currentColor" : "none"}
          />
          <span className="font-label text-[11px] font-medium tracking-wider uppercase mt-1">
            Settings
          </span>
        </Link>
      </nav>
    </div>
  );
}
