
import { InteractiveWindow } from "@/components/interactive-window";
import { InstallWindow } from "@/components/install-window";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 z-10 flex flex-col">
        <Navbar />

        {/* Scrollable main content — vertically centered when it fits */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          <div className="min-h-full flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-12">
            <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ─── Top wide window ─── */}
              <InteractiveWindow
                label="The Problem"
                headline="Agents can't talk to each other. So they fake being human."
                summary="To order a pizza today, an AI agent has to open a browser, scrape a website, click through forms, and hope nothing breaks. That's slow, fragile, and expensive."
                details="B2Alpha eliminates the hack. We provide a universal registry (DNS) so any agent can discover any other agent, and a native messaging layer (chat) so they can communicate directly — no scraping, no browser automation, no human interfaces. Think of it as giving agents their own internet."
                accentColor="text-cyan-400"
                hoverBg="hover:bg-cyan-400"
                hoverBorder="hover:border-cyan-400"
                className="md:col-span-2"
              />

              {/* ─── Middle left: Consumer ─── */}
              <InteractiveWindow
                label="For You"
                headline="Your AI gets a phonebook and a direct line to every business."
                summary="No more scraping menus or filling out web forms. Your agent discovers, compares, and contacts businesses natively."
                details="Your agent queries the B2Alpha registry, finds relevant businesses by capability, reads structured metadata, and opens a direct conversation or API call — all in seconds. Book a restaurant, get a contractor quote, coordinate with friends' AIs. No browser required."
                accentColor="text-fuchsia-400"
                hoverBg="hover:bg-fuchsia-400"
                hoverBorder="hover:border-fuchsia-400"
              />

              {/* ─── Middle right: Business ─── */}
              <InteractiveWindow
                label="For Business"
                headline="Register once. Every AI agent on earth can reach you."
                summary="List your business in a universal directory. Receive conversations from user agents directly or through hosted channels."
                details="Add structured metadata — capabilities, pricing, location, API endpoints. Control your inbound pipeline with native identity verification, rate limiting, and reputation staking. User agents find you automatically through search. Accept direct API calls for simple tasks, or use B2Alpha's hosted conversation platform for negotiations, escrow, and audit trails."
                accentColor="text-emerald-400"
                hoverBg="hover:bg-emerald-400"
                hoverBorder="hover:border-emerald-400"
              />

              <div className="md:col-span-2 border border-white/15 rounded-md bg-black/70 backdrop-blur-sm p-6 sm:p-8">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-cyan-400">
                  API Bridge / Proxy
                </span>
                <h2 className="mt-3 text-lg sm:text-xl font-bold leading-snug text-white">
                  Keep your current API. Let agents connect through B2Alpha.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  Existing businesses can use the new bridge/proxy to stay on their current stack while exposing agent-ready endpoints.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href="/docs"
                    className="inline-flex items-center border border-cyan-400/60 bg-cyan-400/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-300 transition-colors hover:bg-cyan-400 hover:text-black"
                  >
                    Update your integration
                  </Link>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                    Current users: migration steps in docs
                  </span>
                </div>
              </div>

              {/* ─── Bottom: Install ─── */}
              <InstallWindow
                command="curl -fsSL https://b2alpha.io/install.sh | bash"
                className="md:col-span-2"
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
