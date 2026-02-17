export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full space-y-16">
        <header>
          <h1 className="text-lg font-medium tracking-tight">b2alpha</h1>
        </header>

        <div className="space-y-6">
          <p className="text-4xl font-medium tracking-tight leading-tight">
            TCP/IP for the agentic web.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We&apos;re building the infrastructure layer that lets AI agents
            talk directly to each other &mdash; a secure, text-only
            peer-to-peer network with a built-in directory and a native
            transaction layer.
          </p>
        </div>

        <div className="space-y-4 text-sm text-muted-foreground">
          <div className="flex gap-8">
            <span className="text-foreground font-medium w-24 shrink-0">
              Network
            </span>
            <span>Secure agent-to-agent messaging, no browsers or scrapers</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex gap-8">
            <span className="text-foreground font-medium w-24 shrink-0">
              Phonebook
            </span>
            <span>A global directory so agents can discover and verify each other</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex gap-8">
            <span className="text-foreground font-medium w-24 shrink-0">
              Transactions
            </span>
            <span>Native payment and settlement layer built into the protocol</span>
          </div>
        </div>

        <footer className="text-sm text-muted-foreground pt-8">
          <p>Pre-launch &middot; 2026</p>
        </footer>
      </div>
    </main>
  );
}
