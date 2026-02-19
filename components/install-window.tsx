"use client";

import { useState, useCallback } from "react";

interface InstallWindowProps {
    command: string;
    className?: string;
}

export function InstallWindow({
    command,
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
        <div className={`relative w-full ${className}`}>

            {/* Terminal window */}
            <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy install command"
                className="group w-full text-left rounded-sm overflow-hidden border border-white/10 bg-black/30 backdrop-blur-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
                {/* Title bar */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10 bg-white/5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>

                {/* Body */}
                <div className="relative px-5 py-5 font-mono text-sm sm:text-base">

                    {/* Comment */}
                    <p className="italic text-white/30 mb-2 select-none">
                        # Works everywhere. Installs everything.
                    </p>

                    {/* Command */}
                    <div className="flex items-start gap-2.5">
                        <span className="text-amber-400 select-none shrink-0 leading-relaxed" aria-hidden="true">
                            $
                        </span>
                        <code className="text-white/85 break-all leading-relaxed">
                            {command}
                        </code>
                    </div>

                    {/* Copy icon / feedback */}
                    <div className="absolute bottom-4 right-4 flex items-center" aria-live="polite">
                        {copied ? (
                            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-emerald-400">
                                Copied
                            </span>
                        ) : (
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-white/25 group-hover:text-white/50 transition-colors duration-200"
                                aria-hidden="true"
                            >
                                <rect x="4.5" y="4.5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
                                <path d="M2.5 9.5H2A1.5 1.5 0 0 1 .5 8V2A1.5 1.5 0 0 1 2 .5H8A1.5 1.5 0 0 1 9.5 2v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                            </svg>
                        )}
                    </div>
                </div>
            </button>
        </div>
    );
}
