import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { SummaryBar } from "@/components/SummaryBar";
import CompositeScoreDisclaimer from "@/components/CompositeScoreDisclaimer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RPA Global South Intelligence OS",
  description:
    "Country readiness dashboard for fiscal intermediary expansion analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--bg-secondary)] text-[var(--text-primary)]">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="ml-64 flex min-h-screen flex-1 flex-col">
            <SummaryBar />
            <div className="flex-1 p-6">
              {children}
              <div className="mt-8">
                <CompositeScoreDisclaimer />
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
