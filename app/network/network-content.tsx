"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { AgentList } from "./agent-list";

export type Agent = {
  display_name: string;
  agent_type: number;
  status: number;
  region: string;
  capabilities: string[];
  last_seen_at: string;
  city?: string | null;
  state?: string | null;
  distance_miles?: number | null;
};

type SortMode = "recent" | "distance";

type NetworkResponse = {
  agents: Agent[];
  count: number;
  limit: number;
  offset: number;
  sort: SortMode;
};

type LocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; lat: number; lng: number }
  | { status: "error"; message: string };

const PAGE_SIZE = 50;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const buildLookupUrl = (input: {
  query: string;
  offset: number;
  sort: SortMode;
  location: LocationState;
}): string => {
  const url = new URL("/functions/v1/agent-lookup", SUPABASE_URL);
  url.searchParams.set("limit", String(PAGE_SIZE));
  url.searchParams.set("offset", String(input.offset));

  const query = input.query.trim();
  if (query) url.searchParams.set("q", query);

  if (input.sort === "distance" && input.location.status === "ready") {
    url.searchParams.set("sort", "distance");
    url.searchParams.set("lat", String(input.location.lat));
    url.searchParams.set("lng", String(input.location.lng));
  }

  return url.toString();
};

const locationLabel = (location: LocationState): string | null => {
  if (location.status === "ready") return "Sorting by distance from your location";
  if (location.status === "loading") return "Getting your location...";
  if (location.status === "error") return location.message;
  return null;
};

export function NetworkContent() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState<SortMode>("recent");
  const [location, setLocation] = useState<LocationState>({ status: "idle" });

  useEffect(() => {
    setOffset(0);
  }, [deferredQuery, sort]);

  useEffect(() => {
    if (sort !== "distance") return;
    if (location.status !== "idle") return;

    if (!navigator.geolocation) {
      setLocation({ status: "error", message: "Location is not available in this browser" });
      return;
    }

    setLocation({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          status: "ready",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (geoError) => {
        setLocation({ status: "error", message: geoError.message || "Location permission was denied" });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }, [sort, location]);

  useEffect(() => {
    if (sort === "distance" && location.status !== "ready") {
      if (location.status === "error") {
        setLoading(false);
        setError(location.message);
      }
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(buildLookupUrl({
          query: deferredQuery,
          offset,
          sort,
          location,
        }), {
          cache: "no-store",
        });

        const payload = await response.json() as NetworkResponse & { error?: string; detail?: string };
        if (!response.ok) {
          throw new Error(payload.detail || payload.error || "Failed to load agents");
        }

        if (cancelled) return;
        setAgents(payload.agents ?? []);
        setCount(payload.count ?? 0);
      } catch (fetchError) {
        if (cancelled) return;
        setAgents([]);
        setCount(0);
        setError(fetchError instanceof Error ? fetchError.message : String(fetchError));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [deferredQuery, offset, sort, location]);

  const pageStart = count === 0 ? 0 : offset + 1;
  const pageEnd = Math.min(offset + agents.length, count);
  const canGoBack = offset > 0;
  const canGoForward = offset + PAGE_SIZE < count;
  const locationMessage = locationLabel(location);

  return (
    <div className="flex flex-col gap-3">
      <div className="border border-white/15 rounded-md bg-black/85 backdrop-blur-sm px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">Live Registry</span>
          <h1 className="mt-0.5 text-sm font-bold text-white">Agent Network</h1>
          {locationMessage && (
            <p className="mt-1 text-[10px] text-white/35">{locationMessage}</p>
          )}
        </div>
        <div className="flex items-center gap-5 shrink-0">
          <Stat label="Total" value={count} />
        </div>
      </div>

      <div className="border border-white/15 rounded-md bg-black/85 backdrop-blur-sm px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, region, capability..."
            className="flex-1 bg-transparent text-xs text-white placeholder-white/25 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-white/25 hover:text-white/50 transition-colors text-xs"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-white/35">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSort("recent");
                setError(null);
              }}
              className={`px-2 py-1 rounded border transition-colors ${
                sort === "recent"
                  ? "border-cyan-400/50 text-cyan-300 bg-cyan-400/10"
                  : "border-white/10 text-white/40 hover:text-white/70"
              }`}
            >
              Most Recent
            </button>
            <button
              onClick={() => {
                setLocation((current) => current.status === "ready" ? current : { status: "idle" });
                setSort("distance");
                setError(null);
              }}
              className={`px-2 py-1 rounded border transition-colors ${
                sort === "distance"
                  ? "border-cyan-400/50 text-cyan-300 bg-cyan-400/10"
                  : "border-white/10 text-white/40 hover:text-white/70"
              }`}
            >
              Near Me
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOffset((current) => Math.max(0, current - PAGE_SIZE))}
              disabled={!canGoBack}
              className="px-2 py-1 rounded border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white/70"
            >
              Prev
            </button>
            <span>
              {pageStart}-{pageEnd} of {count}
            </span>
            <button
              onClick={() => setOffset((current) => current + PAGE_SIZE)}
              disabled={!canGoForward}
              className="px-2 py-1 rounded border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white/70"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="border border-red-500/20 rounded-md bg-red-500/5 px-4 py-3 text-xs text-red-400">
          Failed to load agents: {error}
        </div>
      ) : loading ? (
        <div className="border border-white/15 rounded-md bg-black/85 px-5 py-8 text-center text-xs text-white/30">
          Loading agents...
        </div>
      ) : (
        <AgentList agents={agents} />
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="text-center">
      <p className={`text-lg font-bold tabular-nums ${accent ? "text-cyan-400" : "text-white"}`}>{value}</p>
      <p className="text-[9px] uppercase tracking-[0.15em] text-white/30">{label}</p>
    </div>
  );
}
