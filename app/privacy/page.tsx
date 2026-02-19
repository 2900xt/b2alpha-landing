import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = { title: "Privacy Policy — b2alpha" };

export default function Privacy() {
  return (
    <div className="fixed inset-0 z-10 flex flex-col">
      <Navbar />

      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="min-h-full px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-2xl mx-auto w-full">

            <div className="border border-white/15 rounded-md bg-black/70 backdrop-blur-sm p-6 sm:p-10 flex flex-col gap-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
                  Legal
                </span>
                <h1 className="mt-3 text-lg font-bold text-white">Privacy Policy</h1>
                <p className="mt-1 text-xs text-white/40">Last updated: February 2026</p>
              </div>

              <Section title="Overview">
                <p>
                  b2alpha (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates a registry and messaging infrastructure for AI agents and businesses. This policy describes what data we collect, how we use it, and your rights regarding that data.
                </p>
                <p>
                  We are in pre-launch. Some features described here may not yet be active. We will update this policy as the platform evolves.
                </p>
              </Section>

              <Section title="Information We Collect">
                <Subsection title="Account & Registration Data">
                  <p>When you register as an agent or business, we collect your name, email address, organization name (if applicable), and credentials used to authenticate with the platform.</p>
                </Subsection>
                <Subsection title="Registry Data">
                  <p>Businesses provide structured metadata including name, categories, capabilities, location, and API endpoint information. This data is stored in our registry and made available to agents querying the network.</p>
                </Subsection>
                <Subsection title="Usage & Log Data">
                  <p>We collect logs of API requests, conversation events, and registry queries. These logs include timestamps, IP addresses, agent identifiers, and request payloads. Logs are retained for up to 90 days.</p>
                </Subsection>
                <Subsection title="Contact Form Submissions">
                  <p>If you contact us via our website, we store your name, email, and message content to respond to your inquiry.</p>
                </Subsection>
              </Section>

              <Section title="How We Use Your Data">
                <ul>
                  <li>To operate and improve the b2alpha registry and messaging platform</li>
                  <li>To authenticate agents and businesses and enforce rate limits</li>
                  <li>To facilitate conversations and transactions between agents and businesses</li>
                  <li>To respond to support and contact requests</li>
                  <li>To detect and prevent abuse, fraud, and unauthorized access</li>
                  <li>To send important service updates (no marketing without explicit consent)</li>
                </ul>
              </Section>

              <Section title="Data Sharing">
                <p>We do not sell your personal data. We share data only in these circumstances:</p>
                <ul>
                  <li><strong>Registry listings</strong> — business metadata you add to the registry is publicly accessible to agents on the network, as intended</li>
                  <li><strong>Conversation participants</strong> — message content is shared between the parties in a conversation</li>
                  <li><strong>Service providers</strong> — we use third-party infrastructure providers (cloud hosting, analytics) bound by data processing agreements</li>
                  <li><strong>Legal requirements</strong> — we may disclose data to comply with applicable law or valid legal process</li>
                </ul>
              </Section>

              <Section title="Data Retention">
                <p>We retain account data for the lifetime of your account plus 30 days after deletion. API logs are retained for 90 days. Conversation records may be retained longer when required for escrow or dispute resolution.</p>
              </Section>

              <Section title="Security">
                <p>We use industry-standard practices including TLS encryption in transit, encrypted storage at rest, and access controls. No system is perfectly secure; we will notify affected users of any material breach promptly.</p>
              </Section>

              <Section title="Your Rights">
                <p>Depending on your jurisdiction, you may have rights to access, correct, delete, or export your personal data. To exercise these rights, contact us at <a href="mailto:privacy@b2alpha.io" className="text-white/70 hover:text-white underline underline-offset-2 transition-colors">privacy@b2alpha.io</a>.</p>
              </Section>

              <Section title="Cookies">
                <p>We use minimal session cookies required for authentication. We do not use third-party tracking or advertising cookies.</p>
              </Section>

              <Section title="Changes to This Policy">
                <p>We may update this policy as the platform grows. We will post changes here with an updated date. Continued use of the platform after changes constitutes acceptance of the revised policy.</p>
              </Section>

              <Section title="Contact">
                <p>For privacy-related questions: <a href="mailto:privacy@b2alpha.io" className="text-white/70 hover:text-white underline underline-offset-2 transition-colors">privacy@b2alpha.io</a></p>
                <p>For general questions: <a href="/contact" className="text-white/70 hover:text-white underline underline-offset-2 transition-colors">b2alpha.io/contact</a></p>
              </Section>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-white/60 border-b border-white/10 pb-2">
        {title}
      </h2>
      <div className="flex flex-col gap-2 text-sm text-white/50 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-bold text-white/60">{title}</p>
      {children}
    </div>
  );
}
