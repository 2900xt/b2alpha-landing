"use client";

import { useState, useRef, useEffect } from "react";

interface InteractiveWindowProps {
    label: string;
    headline: string;
    summary: string;
    details: string;
    accentColor?: string;
    hoverBg?: string;
    hoverBorder?: string;
    hoverText?: string;
    hoverMuted?: string;
    className?: string;
}

export function InteractiveWindow({
    label,
    headline,
    summary,
    details,
    accentColor = "text-fuchsia-400",
    hoverBg = "hover:bg-yellow-400",
    hoverBorder = "hover:border-yellow-400",
    hoverText = "group-hover:text-zinc-900",
    hoverMuted = "group-hover:text-zinc-800",
    className = "",
}: InteractiveWindowProps) {
    const [expanded, setExpanded] = useState(false);
    const detailsRef = useRef<HTMLDivElement>(null);
    const [detailsHeight, setDetailsHeight] = useState(0);

    useEffect(() => {
        if (detailsRef.current) {
            setDetailsHeight(detailsRef.current.scrollHeight);
        }
    }, [expanded, details]);

    return (
        <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-label={`${label}: ${headline}`}
            className={`
        group relative text-left w-full
        border border-white/15 rounded-md
        bg-black/70 backdrop-blur-sm
        p-6 sm:p-8
        cursor-pointer
        transition-all duration-200 ease-out
        ${hoverBg} ${hoverBorder}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black
        ${className}
      `}
        >
            {/* Label */}
            <span
                className={`
          text-[10px] uppercase tracking-[0.2em] font-bold
          ${accentColor}
          ${hoverText}
          transition-colors duration-200
        `}
            >
                {label}
            </span>

            {/* Headline */}
            <h2
                className={`
          mt-3 text-lg sm:text-xl font-bold leading-snug text-white
          ${hoverText}
          transition-colors duration-200
        `}
            >
                {headline}
            </h2>

            {/* Summary */}
            <p
                className={`
          mt-2 text-sm leading-relaxed text-white/55
          ${hoverMuted}
          transition-colors duration-200
        `}
            >
                {summary}
            </p>

            {/* Expandable details */}
            <div
                ref={detailsRef}
                className="overflow-hidden transition-all duration-300 ease-out"
                style={{
                    maxHeight: expanded ? `${detailsHeight}px` : "0px",
                    opacity: expanded ? 1 : 0,
                    transform: expanded ? "translateY(0)" : "translateY(-4px)",
                }}
            >
                <div className="pt-4 border-t border-white/10 mt-4 group-hover:border-zinc-400">
                    <p
                        className={`
              text-sm leading-relaxed text-white/70
              ${hoverMuted}
              transition-colors duration-200
            `}
                    >
                        {details}
                    </p>
                </div>
            </div>

            {/* Expand indicator */}
            <span
                className={`
          absolute top-6 right-6 text-white/20
          group-hover:text-zinc-600
          transition-all duration-200 text-lg
        `}
                aria-hidden="true"
            >
                {expanded ? "−" : "+"}
            </span>
        </button>
    );
}
