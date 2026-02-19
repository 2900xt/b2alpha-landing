"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

type Section = "agents" | "business";

export default function Docs() {
  const [active, setActive] = useState<Section>("agents");

  return (
    <>
      <div className="fixed inset-0 z-10 flex flex-col">
        <Navbar active="Docs" />

        <main className="flex-1 overflow-y-auto no-scrollbar">
          <div className="min-h-full flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-12">
            <div className="max-w-5xl mx-auto w-full flex gap-4 items-start">

              {/* Sidebar */}
              <div className="w-44 shrink-0 border border-white/15 rounded-md bg-black/70 backdrop-blur-sm p-4 sticky top-0 self-start">
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/30 mb-3">
                  Quick Setup
                </p>
                <div className="flex flex-col gap-0.5">
                  <SidebarItem
                    label="Agents"
                    active={active === "agents"}
                    onClick={() => setActive("agents")}
                    accent="fuchsia"
                  />
                  <SidebarItem
                    label="Business"
                    active={active === "business"}
                    onClick={() => setActive("business")}
                    accent="emerald"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col gap-4">
                {active === "agents" ? <AgentsContent /> : <BusinessContent />}

                {/* Base URL bar */}
                <div className="border border-white/10 rounded-md bg-black/50 backdrop-blur-sm px-5 py-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">Base URL</span>
                  <code className="text-xs text-white/60">https://api.b2alpha.com</code>
                  <span className="text-white/20">·</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">Auth</span>
                  <code className="text-xs text-white/60">Authorization: Bearer {"{api_key}"}</code>
                </div>
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

function SidebarItem({
  label,
  active,
  onClick,
  accent,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accent: "fuchsia" | "emerald";
}) {
  const accentClass = accent === "fuchsia" ? "text-fuchsia-400" : "text-emerald-400";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left px-3 py-2 rounded text-xs font-bold uppercase tracking-wider
        transition-colors duration-150
        ${active ? `${accentClass} bg-white/5` : "text-white/40 hover:text-white/70 hover:bg-white/5"}
      `}
    >
      {label}
    </button>
  );
}

function AgentsContent() {
  return (
    <div className="border border-white/15 rounded-md bg-black/70 backdrop-blur-sm p-6 sm:p-8 flex flex-col gap-6">
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-fuchsia-400">
          For Agents
        </span>
        <h2 className="mt-3 text-lg font-bold text-white">
          Discover and contact any business.
        </h2>
        <p className="mt-1 text-sm text-white/55 leading-relaxed">
          Your agent queries the registry, picks a connection mode, and talks directly or through hosted conversations.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Step n="1" label="Install">
          <Code>curl -fsSL https://b2alpha.io/install.sh | bash</Code>
        </Step>

        <Step n="2" label="Authenticate">
          <Code>b2a auth login</Code>
          <p className="mt-1.5 text-xs text-white/40">
            Generates an agent API key with scopes:{" "}
            <span className="text-white/60">registry:read</span>,{" "}
            <span className="text-white/60">conversations:write</span>
          </p>
        </Step>

        <Step n="3" label="Search the registry">
          <Code>{`GET /v1/registry/search?q=italian+restaurant&location=SF`}</Code>
          <p className="mt-1.5 text-xs text-white/40">
            Returns businesses with capabilities, modes, and endpoints.
          </p>
        </Step>

        <Step n="4" label="Direct mode — simple requests">
          <p className="text-xs text-white/40 mb-1.5">
            B2Alpha returns the endpoint; your agent calls the business directly. No relay.
          </p>
          <Code>{`GET /v1/registry/business/{id}
# → { modes.direct.endpoint, modes.direct.openapi_url }

POST https://api.business.com/reservations
Authorization: Bearer {their_api_key}`}</Code>
        </Step>

        <Step n="5" label="Hosted mode — negotiations &amp; payments">
          <p className="text-xs text-white/40 mb-1.5">
            Multi-turn conversations with escrow. B2Alpha relays messages and holds funds.
          </p>
          <Code>{`POST /v1/conversations
{
  "business_id": "biz_abc123",
  "capability": "get_quote",
  "initial_message": { "type": "text", "text": "..." }
}

# Stream responses
WSS /v1/conversations/{id}/stream`}</Code>
        </Step>
      </div>
    </div>
  );
}

function BusinessContent() {
  return (
    <div className="border border-white/15 rounded-md bg-black/70 backdrop-blur-sm p-6 sm:p-8 flex flex-col gap-6">
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400">
          For Business
        </span>
        <h2 className="mt-3 text-lg font-bold text-white">
          Register once. Every agent can find you.
        </h2>
        <p className="mt-1 text-sm text-white/55 leading-relaxed">
          List your capabilities in the registry and choose how agents reach you — direct API calls or hosted conversations with built-in escrow.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Step n="1" label="Install &amp; register">
          <Code>{`curl -fsSL https://b2alpha.io/install.sh | bash
b2a register`}</Code>
          <p className="mt-1.5 text-xs text-white/40">
            Interactive setup — name, categories, location, and connection mode.
          </p>
        </Step>

        <Step n="2" label="Define capabilities">
          <Code>{`POST /v1/registry/business
{
  "name": "Acme Co",
  "categories": ["contractor"],
  "capabilities": [
    { "action": "get_quote", "mode": "hosted" },
    { "action": "check_availability", "mode": "direct" }
  ],
  "modes": {
    "hosted": { "accepts_conversations": true, "escrow_required": true },
    "direct": { "endpoint": "https://api.acme.com/v1", "openapi_url": "..." }
  }
}`}</Code>
        </Step>

        <Step n="3" label="Listen for inbound">
          <Code>b2a listen</Code>
          <p className="mt-1.5 text-xs text-white/40">
            Or configure a webhook for server-side delivery:
          </p>
          <Code className="mt-1.5">{`POST /v1/business/webhooks
{
  "url": "https://mycompany.com/b2alpha/webhook",
  "events": ["conversation.started", "conversation.message"]
}`}</Code>
        </Step>

        <Step n="4" label="Respond to messages">
          <Code>{`POST /v1/conversations/{id}/messages
Authorization: Bearer biz_xxx
{
  "content": {
    "type": "proposal",
    "proposal": {
      "description": "Kitchen remodel",
      "total": { "amount": 20000, "currency": "usd" }
    }
  }
}`}</Code>
          <p className="mt-1.5 text-xs text-white/40">
            Send proposals, request payment, or close the conversation. Escrow is handled automatically.
          </p>
        </Step>
      </div>
    </div>
  );
}

function Step({ n, label, children }: { n: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="shrink-0 w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-white/40 font-bold mt-0.5">
        {n}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className="text-xs uppercase tracking-wider text-white/50 font-bold mb-2"
          dangerouslySetInnerHTML={{ __html: label }}
        />
        {children}
      </div>
    </div>
  );
}

function Code({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <pre
      className={`text-xs text-white/70 bg-white/5 border border-white/10 rounded px-3 py-2.5 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed ${className}`}
    >
      {children}
    </pre>
  );
}
