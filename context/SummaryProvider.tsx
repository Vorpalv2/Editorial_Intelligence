"use client";

import { useState, ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import { SummaryWatcher } from "@/components/SummaryWatcher";
import { SummaryContextProvider } from "./url.context";
import { AISummaryContextProvider } from "./aiSummaryType.context";
import { RefreshContextProvider } from "./refreshingURL.context";
// import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <RefreshContextProvider>
        <AISummaryContextProvider>
          <SummaryContextProvider>
            <SummaryWatcher />
            <ToastContainer position="bottom-right" theme="dark" />
            {/* We wrap children here, but how do we let a child button 
         on a different page call setPendingUrl? 
         See step 2 below! 
         */}
            {children}
          </SummaryContextProvider>
        </AISummaryContextProvider>
      </RefreshContextProvider>
    </ClerkProvider>
  );
}
