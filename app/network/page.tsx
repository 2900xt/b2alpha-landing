import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { AgentList } from "./agent-list";

export const metadata = { title: "Network — b2alpha" };

export type Agent = {
  id: string;
  did: string;
  display_name: string;
  agent_type: number;
  status: number;
  region: string;
  capabilities: string[];
  last_seen_at: string;
  message_count: number;
};

export default async function Network() {
  const { data: agents, error } = await supabase
    .from("agents")
    .select("id, did, display_name, agent_type, status, region, capabilities, last_seen_at, message_count")
    .order("last_seen_at", { ascending: false })
    .limit(200);

  const total = agents?.length ?? 0;
  const online = agents?.filter((a) => a.status === 1).length ?? 0;

  return (
    <div className="fixed inset-0 z-10 flex flex-col">
      <Navbar active="Network" />

      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="min-h-full px-4 sm:px-6 py-6 sm:py-10">
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-3">

            {/* Header */}
            <div className="border border-white/15 rounded-md bg-black/85 backdrop-blur-sm px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">Live Registry</span>
                <h1 className="mt-0.5 text-sm font-bold text-white">Agent Network</h1>
              </div>
              <div className="flex items-center gap-5 shrink-0">
                <Stat label="Total" value={total} />
                <Stat label="Online" value={online} accent />
              </div>
            </div>

            {error ? (
              <div className="border border-red-500/20 rounded-md bg-red-500/5 px-4 py-3 text-xs text-red-400">
                Failed to load agents: {error.message}
              </div>
            ) : (
              <AgentList agents={agents ?? []} />
            )}

          </div>
        </div>
      </main>

      <Footer />
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
