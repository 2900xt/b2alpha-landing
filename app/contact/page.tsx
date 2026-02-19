"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex flex-col">
      <Navbar active="Contact" />

      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="min-h-full flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-lg mx-auto w-full">

            <div className="border border-white/15 rounded-md bg-black/70 backdrop-blur-sm p-6 sm:p-8">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-yellow-400">
                Contact
              </span>
              <h1 className="mt-3 text-lg font-bold text-white">
                Get in touch.
              </h1>
              <p className="mt-1 text-sm text-white/55 leading-relaxed">
                Questions, partnerships, or feedback — we read everything.
              </p>

              {status === "success" ? (
                <div className="mt-8 border border-white/10 rounded-md bg-white/5 px-5 py-6 text-center">
                  <p className="text-sm font-bold text-white">Message sent.</p>
                  <p className="mt-1 text-xs text-white/50">We&apos;ll get back to you soon.</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 text-xs text-yellow-400 hover:text-yellow-300 uppercase tracking-wider transition-colors"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Name" id="name" type="text" required placeholder="Jane Smith" />
                    <Field label="Email" id="email" type="email" required placeholder="jane@example.com" />
                  </div>
                  <Field label="Subject" id="subject" type="text" placeholder="Partnership inquiry" />
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="message"
                      className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40"
                    >
                      Message <span className="text-yellow-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-xs text-white/80 placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-yellow-400/60 focus:border-yellow-400/40 transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-xs text-red-400">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-2 w-full bg-white/5 border border-white/10 hover:border-yellow-400/40 hover:bg-yellow-400/5 text-white/70 hover:text-white text-xs uppercase tracking-wider font-bold py-2.5 rounded transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400/60 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Field({
  label,
  id,
  type,
  required,
  placeholder,
}: {
  label: string;
  id: string;
  type: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40"
      >
        {label} {required && <span className="text-yellow-400">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-xs text-white/80 placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-yellow-400/60 focus:border-yellow-400/40 transition-colors"
      />
    </div>
  );
}
