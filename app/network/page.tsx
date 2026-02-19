import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { NetworkContent } from "./network-content";

export const metadata = { title: "Network — b2alpha" };

export default function Network() {
  return (
    <div className="fixed inset-0 z-10 flex flex-col">
      <Navbar active="Network" />

      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="min-h-full px-4 sm:px-6 py-6 sm:py-10">
          <div className="max-w-3xl mx-auto w-full">
            <Suspense fallback={<LoadingShell />}>
              <NetworkContent />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function LoadingShell() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="border border-white/15 rounded-md bg-black/85 px-5 py-4 h-14" />
      <div className="border border-white/15 rounded-md bg-black/85 px-4 py-3 h-10" />
      <div className="border border-white/15 rounded-md bg-black/85 h-48" />
    </div>
  );
}
