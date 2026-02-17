import { AsciiBackground } from "@/components/ascii-background";

export default function Home() {
  return (
    <>
      <AsciiBackground />
      <div className="fixed inset-0 z-10 flex flex-col pointer-events-none">
        {/* Navbar */}
        <nav className="pointer-events-auto w-full border-b border-white/10 bg-black/50 backdrop-blur-sm">
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

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-2xl w-full space-y-12 pointer-events-auto bg-black/60 backdrop-blur-sm p-10 rounded-lg border border-white/5">
            <div className="space-y-6">
              <p className="text-3xl font-bold tracking-tight leading-tight text-white">
                TCP/IP for the agentic web.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                We&apos;re building the infrastructure layer that lets AI agents
                talk directly to each other &mdash; a secure, text-only
                peer-to-peer network with a built-in directory and a native
                transaction layer.
              </p>
            </div>

            <div className="space-y-3 text-xs text-white/50">
              <div className="flex gap-6">
                <span className="text-white font-semibold w-28 shrink-0 uppercase tracking-wider">
                  Network
                </span>
                <span>
                  Secure agent-to-agent messaging, no browsers or scrapers
                </span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex gap-6">
                <span className="text-white font-semibold w-28 shrink-0 uppercase tracking-wider">
                  Phonebook
                </span>
                <span>
                  A global directory so agents can discover and verify each
                  other
                </span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex gap-6">
                <span className="text-white font-semibold w-28 shrink-0 uppercase tracking-wider">
                  Transactions
                </span>
                <span>
                  Native payment and settlement layer built into the protocol
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="pointer-events-auto w-full border-t border-white/10 bg-black/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3 text-xs text-white/30 uppercase tracking-wider">
            <span>&copy; 2026 b2alpha</span>
            <span>Pre-launch</span>
          </div>
        </footer>
      </div>
    </>
  );
}
