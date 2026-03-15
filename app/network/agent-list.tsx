"use client";

import type { Agent } from "./network-content";

const AGENT_TYPES: Record<number, string> = {
  0: "User",
  1: "Business",
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

const cityStateText = (agent: Agent): string | null => {
  if (agent.city && agent.state) return `${agent.city}, ${agent.state}`;
  if (agent.region) return agent.region;
  return null;
};

const distanceText = (agent: Agent): string | null => {
  if (typeof agent.distance_miles === "number") return `${agent.distance_miles.toFixed(1)} mi`;
  return null;
};

export function AgentList({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) {
    return (
      <div className="border border-white/10 rounded-md bg-black/85 px-5 py-8 text-center text-xs text-white/30">
        No agents found for this view.
      </div>
    );
  }

  return (
    <div className="border border-white/15 rounded-md bg-black/85 backdrop-blur-sm overflow-hidden">
      {agents.map((agent, index) => (
        <AgentRow
          key={`${agent.display_name}-${agent.last_seen_at}-${index}`}
          agent={agent}
          last={index === agents.length - 1}
        />
      ))}
    </div>
  );
}

function AgentRow({ agent, last }: { agent: Agent; last: boolean }) {
  const typeName = AGENT_TYPES[agent.agent_type] ?? `Type ${agent.agent_type}`;
  const location = cityStateText(agent);
  const distance = distanceText(agent);

  return (
    <div className={`px-4 py-2.5 flex items-center gap-3 hover:bg-white/[0.03] transition-colors ${!last ? "border-b border-white/8" : ""}`}>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white truncate">
          {agent.display_name || "Unnamed Agent"}
        </p>
      </div>

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

      <div className="shrink-0 flex items-center gap-3 text-[10px] text-white/30">
        <span className="text-[9px] uppercase tracking-wider text-white/20">{typeName}</span>
        {location && <span>{location}</span>}
        {distance && <span>{distance}</span>}
        <span className="text-white/20">{timeAgo(agent.last_seen_at)}</span>
      </div>
    </div>
  );
}
