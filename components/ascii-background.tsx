"use client";

import { usePathname } from "next/navigation";

export function AsciiBackground() {
  const pathname = usePathname();

  // Mapping paths to palette IDs in memory-array.html
  // 0: All colors (default)
  // 1: Blue gradient
  // 2: Purple gradient
  // 3: Green gradient
  // 4: Yellow gradient
  let paletteId = 0;

  if (pathname === "/network") paletteId = 1;
  else if (pathname === "/docs") paletteId = 2;
  else if (pathname === "/privacy") paletteId = 3;
  else if (pathname === "/terms") paletteId = 4;
  else if (pathname === "/contact") paletteId = 4; // Or whichever you prefer

  return (
    <iframe
      src={`/memory-array.html?palette=${paletteId}`}
      className="fixed inset-0 border-0"
      style={{ width: "100vw", height: "100vh", pointerEvents: "none" }}
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
