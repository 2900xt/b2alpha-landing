import { AsciiBackground } from "@/components/ascii-background";
import { InteractiveWindow } from "@/components/interactive-window";
import { InstallWindow } from "@/components/install-window";

export default function Home() {
  return (
    <>
      <AsciiBackground />
      <div className="fixed inset-0 z-10 flex flex-col">
        {/* Navbar */}
        <nav className="w-full border-b border-white/10 bg-black/50 backdrop-blur-sm shrink-0">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
            <span className="text-white text-sm font-bold tracking-widest uppercase">
              b2alpha
            </span>
            <div className="flex gap-6 text-xs text-white/50 uppercase tracking-wider">
              <span>Network</span>
              <span>Docs</span>
              <span>Contact</span>
            </div>
          </div>
        </nav>

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

              {/* ─── Bottom: Install ─── */}
              <InstallWindow
                command="curl -fsSL https://b2alpha-landing.vercel.app/install.sh | bash"
                hoverBg="hover:bg-amber-400"
                hoverBorder="hover:border-amber-400"
                className="md:col-span-2"
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/10 bg-black/50 backdrop-blur-sm shrink-0">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3 text-xs text-white/30 uppercase tracking-wider">
            <span>&copy; 2026 b2alpha</span>
            <span>Pre-launch</span>
          </div>
        </footer>
      </div>
    </>
  );
}
