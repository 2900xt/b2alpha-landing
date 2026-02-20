import Link from "next/link";

const links = [
  { label: "Network", href: "/network" },
  { label: "Docs", href: "/docs" },
  { label: "Contact", href: "/contact" },
];

export function Navbar({ active }: { active?: string }) {
  return (
    <nav className="w-full border-b border-white/10 bg-black/50 backdrop-blur-sm shrink-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-white hover:text-emerald-400 transition-colors text-sm font-bold tracking-widest uppercase">
          b2alpha
        </Link>
        <div className="flex gap-6 text-xs uppercase tracking-wider">
          {links.map(({ label, href }) => {
            const hoverColor =
              label === "Network" ? "hover:text-cyan-400" :
                label === "Docs" ? "hover:text-fuchsia-400" :
                  label === "Contact" ? "hover:text-yellow-400" : "hover:text-white/80";

            return (
              <Link
                key={label}
                href={href}
                className={label === active ? "text-white text-shadow-sm font-medium" : `text-white/50 ${hoverColor} transition-colors`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
