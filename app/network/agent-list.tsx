"use client";

import { useState, useMemo } from "react";
import type { Agent } from "./network-content";

const AGENT_TYPES: Record<number, string> = {
  0: "Generic",
  1: "User",
  2: "Business",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function shortDid(did: string) {
  if (did.length <= 24) return did;
  return `${did.slice(0, 12)}…${did.slice(-8)}`;
}

export function AgentList({ agents }: { agents: Agent[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter(
      (a) =>
        a.display_name.toLowerCase().includes(q) ||
        a.did.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q) ||
        a.capabilities.some((c) => c.toLowerCase().includes(q))
    );
  }, [agents, query]);

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="border border-white/15 rounded-md bg-black/85 backdrop-blur-sm flex items-center px-4 gap-3">
        <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, DID, region, capability…"
          className="flex-1 bg-transparent py-3 text-xs text-white placeholder-white/25 outline-none"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-white/25 hover:text-white/50 transition-colors text-xs">
            ✕
          </button>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="border border-white/10 rounded-md bg-black/85 px-5 py-8 text-center text-xs text-white/30">
          {agents.length === 0 ? "No agents registered yet." : "No results for that query."}
        </div>
      ) : (
        <div className="border border-white/15 rounded-md bg-black/85 backdrop-blur-sm overflow-hidden">
          {filtered.map((agent, i) => (
            <AgentRow key={agent.id} agent={agent} last={i === filtered.length - 1} />
          ))}
        </div>
      )}

      {query && filtered.length > 0 && (
        <p className="text-[10px] text-white/25 text-center">
          {filtered.length} of {agents.length} agents
        </p>
      )}
    </div>
  );
}

function AgentRow({ agent, last }: { agent: Agent; last: boolean }) {
  const online = agent.status === 1;
  const typeName = AGENT_TYPES[agent.agent_type] ?? `Type ${agent.agent_type}`;

  return (
    <div className={`px-4 py-2.5 flex items-center gap-3 hover:bg-white/[0.03] transition-colors ${!last ? "border-b border-white/8" : ""}`}>

      {/* Status dot */}
      <span
        className={`shrink-0 w-1.5 h-1.5 rounded-full ${online ? "bg-cyan-400" : "bg-white/15"}`}
        title={online ? "Online" : "Offline"}
      />

      {/* Name + DID */}
      <div className="flex-1 min-w-0 flex items-baseline gap-2">
        <p className="text-xs font-semibold text-white truncate">
          {agent.display_name || shortDid(agent.did)}
        </p>
        {agent.display_name && (
          <p className="text-[10px] text-white/25 font-mono truncate hidden sm:block">{shortDid(agent.did)}</p>
        )}
      </div>

      {/* Capabilities */}
      {agent.capabilities.length > 0 && (
        <div className="hidden md:flex items-center gap-1 shrink-0">
          {agent.capabilities.slice(0, 3).map((cap) => (
            <span key={cap} className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 text-white/35 bg-white/5">
              {cap}
            </span>
          ))}
          {agent.capabilities.length > 3 && (
            <span className="text-[9px] text-white/20">+{agent.capabilities.length - 3}</span>
          )}
        </div>
      )}

      {/* Right meta */}
      <div className="shrink-0 flex items-center gap-3 text-[10px] text-white/30">
        <span className="text-[9px] uppercase tracking-wider text-white/20">{typeName}</span>
        {agent.region && <span>{agent.region}</span>}
        <span className="text-white/20">{timeAgo(agent.last_seen_at)}</span>
      </div>

    </div>
  );
}
