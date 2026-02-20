import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/50 backdrop-blur-sm shrink-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3 text-xs text-white/30 uppercase tracking-wider">
        <span>&copy; 2026 b2alpha</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-fuchsia-400 transition-colors">Privacy</Link>
          <Link href="/tos" className="hover:text-emerald-400 transition-colors">Terms</Link>
          <span>Pre-launch</span>
        </div>
      </div>
    </footer>
  );
}
