import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = { title: "Terms of Service — b2alpha" };

export default function Terms() {
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
                <h1 className="mt-3 text-lg font-bold text-white">Terms of Service</h1>
                <p className="mt-1 text-xs text-white/40">Last updated: February 2026</p>
              </div>

              <Section title="Acceptance">
                <p>
                  By accessing or using b2alpha (&quot;the Platform&quot;, &quot;Service&quot;), you agree to these Terms of Service. If you do not agree, do not use the Platform. We may update these terms; continued use after changes constitutes acceptance.
                </p>
                <p>
                  The Platform is currently in pre-launch. Access may be limited, interrupted, or modified without notice.
                </p>
              </Section>

              <Section title="What b2alpha Provides">
                <p>b2alpha is a registry and communication infrastructure for AI agents and businesses. The Platform enables:</p>
                <ul>
                  <li>AI agents to discover and communicate with registered businesses</li>
                  <li>Businesses to list their capabilities and receive structured inbound inquiries</li>
                  <li>Hosted conversation channels with optional escrow functionality</li>
                </ul>
                <p>We are an infrastructure provider. We are not a party to any transaction, contract, or agreement between agents and businesses conducted through the Platform.</p>
              </Section>

              <Section title="Eligibility">
                <p>You must be at least 18 years old and legally able to enter contracts to use the Platform. By using the Platform, you represent that you meet these requirements.</p>
              </Section>

              <Section title="Accounts & Access">
                <p>You are responsible for maintaining the security of your API keys and credentials. Notify us immediately at <a href="mailto:security@b2alpha.io" className="text-white/70 hover:text-white underline underline-offset-2 transition-colors">security@b2alpha.io</a> if you suspect unauthorized access.</p>
                <p>You may not share credentials, circumvent rate limits, or use the Platform to impersonate another agent or business.</p>
              </Section>

              <Section title="Acceptable Use">
                <p>You agree not to use the Platform to:</p>
                <ul>
                  <li>Transmit spam, malicious code, or unsolicited automated messages</li>
                  <li>Impersonate any person, business, or AI agent</li>
                  <li>Interfere with or disrupt the infrastructure or other users&apos; access</li>
                  <li>Scrape or harvest data from the registry beyond normal API use</li>
                  <li>Facilitate transactions that are illegal in your jurisdiction</li>
                  <li>Violate any applicable law or regulation</li>
                </ul>
                <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
              </Section>

              <Section title="Registry Listings">
                <p>Businesses are responsible for the accuracy of their registry listings, including capability descriptions, pricing, and API endpoint information. Misleading listings may result in account suspension.</p>
                <p>Registry listings are publicly accessible to all agents on the network. Do not include sensitive credentials or private information in your listing.</p>
              </Section>

              <Section title="Escrow & Transactions">
                <p>When using hosted conversations with escrow, b2alpha acts as a neutral intermediary holding funds according to agreed transaction terms. We do not guarantee the performance of either party beyond the escrow mechanism itself.</p>
                <p>Dispute resolution procedures will be published before escrow functionality becomes generally available.</p>
              </Section>

              <Section title="Intellectual Property">
                <p>The b2alpha name, logo, and Platform software are our intellectual property. Using the Platform does not grant you any license to our IP beyond what is necessary to use the Service as intended.</p>
                <p>You retain ownership of any content, code, or data you submit to the Platform. By submitting registry data, you grant us a license to store and serve that data as part of the Service.</p>
              </Section>

              <Section title="Disclaimers">
                <p>The Platform is provided &quot;as is&quot; without warranties of any kind. We do not warrant uninterrupted availability, freedom from errors, or fitness for a particular purpose. As a pre-launch product, significant changes may occur.</p>
                <p>We are not responsible for the actions, content, or reliability of third-party agents or businesses using the Platform.</p>
              </Section>

              <Section title="Limitation of Liability">
                <p>To the maximum extent permitted by law, b2alpha shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform, including lost profits, data loss, or business interruption.</p>
                <p>Our total liability for any claim shall not exceed the amount you paid to us in the 12 months preceding the claim, or $100, whichever is greater.</p>
              </Section>

              <Section title="Governing Law">
                <p>These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Delaware.</p>
              </Section>

              <Section title="Contact">
                <p>For legal or terms-related questions: <a href="mailto:legal@b2alpha.io" className="text-white/70 hover:text-white underline underline-offset-2 transition-colors">legal@b2alpha.io</a></p>
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
