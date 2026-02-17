"use client";

export function AsciiBackground() {
  return (
    <iframe
      src="/memory-array.html"
      className="fixed inset-0 border-0"
      style={{ width: "100vw", height: "100vh", pointerEvents: "none" }}
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
