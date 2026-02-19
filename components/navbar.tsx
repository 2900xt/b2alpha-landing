import Link from "next/link";

const links = [
  { label: "Network", href: "#" },
  { label: "Docs", href: "/docs" },
  { label: "Contact", href: "/contact" },
];

export function Navbar({ active }: { active?: string }) {
  return (
    <nav className="w-full border-b border-white/10 bg-black/50 backdrop-blur-sm shrink-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-white text-sm font-bold tracking-widest uppercase">
          b2alpha
        </Link>
        <div className="flex gap-6 text-xs uppercase tracking-wider">
          {links.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={label === active ? "text-white/90" : "text-white/50 hover:text-white/80 transition-colors"}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
