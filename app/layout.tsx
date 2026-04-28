import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
// import { Navigation } from "@/components/Navigation";
// import { ToastContainer } from "react-toastify";
// import { ClerkProvider } from "@clerk/nextjs";
// import { SummaryWatcher } from "@/components/SummaryWatcher";
import Providers from "@/context/SummaryProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Editorial Intelligence",
  description: "AI-powered digital curator for strategic wisdom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
