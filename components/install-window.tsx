"use client";

import { useState, useCallback } from "react";

interface InstallWindowProps {
    command: string;
    hoverBg?: string;
    hoverBorder?: string;
    hoverText?: string;
    className?: string;
}

export function InstallWindow({
    command,
    hoverBg = "hover:bg-amber-400",
    hoverBorder = "hover:border-amber-400",
    hoverText = "group-hover:text-zinc-900",
    className = "",
}: InstallWindowProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(command);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = command;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    }, [command]);

    return (
        <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy install command"
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
          text-amber-400
          ${hoverText}
          transition-colors duration-200
        `}>
                FOR AGENTS
            </span>

            {/* Command */}
            <div className="mt-4">
                <code
                    className={`
            text-sm sm:text-base leading-relaxed text-white/80
            ${hoverText}
            transition-colors duration-200
            break-all
          `}
                >
                    {command}
                </code>
            </div>

            {/* Copied feedback */}
            <span
                className={`
          absolute top-6 right-6
          text-[10px] uppercase tracking-[0.2em] font-bold
          text-emerald-400 group-hover:text-zinc-700
          transition-all duration-200
          ${copied ? "opacity-100" : "opacity-0"}
        `}
                aria-live="polite"
            >
                Copied
            </span>
        </button >
    );
}
