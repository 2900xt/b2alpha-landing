# B2Alpha: The Infrastructure Layer for Agent Commerce

## Executive Summary

B2Alpha is **DNS + Hosted Conversations** for the AI agent economy.

We provide two services:
1. **Registry** — How agents find businesses (like DNS for agent commerce)
2. **Conversation Host** — Where complex deals happen (like Stripe for negotiations)

The registry gets us distribution. Hosted conversations are the moat.

---

## The Problem

AI agents will handle commerce. But there's no infrastructure:

- **Discovery**: How does an agent find a plumber? A supplier? A contractor?
- **Trust**: When agents negotiate, who keeps the record? Who holds the money?
- **Complexity**: Simple bookings are easy. Multi-turn negotiations are hard.

Today's solutions (APIs, directories) only solve discovery. They leave the hard problems—trust, escrow, disputes—unsolved.

---

## The Solution: Two Modes

### Mode 1: Direct API (Simple Tasks)

```
User Agent → B2Alpha Registry → Gets endpoint → Calls Business API directly
```

- Agent looks up business endpoint in B2Alpha
- Agent calls the business API directly
- B2Alpha is **out of the loop** after lookup
- Fast, cheap, no overhead

**Examples:**
- Booking a restaurant reservation
- Checking store hours
- Ordering from a menu
- Simple purchases with fixed prices

**Why we offer this:** Gets us distribution. Every agent needs discovery. Low friction onboarding.

---

### Mode 2: Hosted Conversations (Complex Tasks)

```
User Agent → B2Alpha → Business Agent → B2Alpha → User Agent
                    ↓
           [History, Escrow, Audit Trail]
```

- Agent initiates conversation **through B2Alpha**
- B2Alpha hosts and relays all messages
- B2Alpha stores conversation history (neutral third party)
- B2Alpha provides escrow, dispute resolution, async handling

**Examples:**
- Getting a construction quote
- Negotiating a contract
- Complex B2B procurement
- Any multi-turn negotiation with money involved

**Why this is the moat:**
- Neutral record of what was agreed
- Payment escrow (funds held until delivery)
- Async message queuing (agent offline? no problem)
- Dispute resolution with immutable audit trail
- Analytics on conversation patterns

---

## Why Both Modes?

| Scenario | Mode | Why |
|----------|------|-----|
| Book dinner for 2 at 7pm | Direct | Fixed price, no negotiation, instant |
| Get quotes from 3 contractors | Hosted | Multi-turn, need audit trail, escrow |
| Check if store has item in stock | Direct | Simple query, single response |
| Negotiate enterprise software deal | Hosted | Complex terms, payment milestones |
| Order standard supplies | Direct | Catalog purchase, known price |
| Custom manufacturing order | Hosted | Specs negotiation, quality disputes possible |

**Businesses choose which modes to support:**
- Small restaurant? Direct only. Simple.
- Law firm? Hosted only. Everything needs a record.
- General contractor? Both. Quick quotes direct, big jobs hosted.

---

## The Moat: Hosted Conversations

Anyone can build a registry. The moat is in **hosted conversations**:

### 1. Neutral Third Party
- Neither side controls the record
- Immutable conversation history
- Cryptographically signed messages

### 2. Payment Escrow
- Funds held by B2Alpha until conditions met
- Milestone-based releases
- Automatic refunds on dispute resolution

### 3. Async Handling
- Agent goes offline? Messages queue.
- Business closes at 5pm? Conversation continues tomorrow.
- No lost context, no dropped deals.

### 4. Dispute Resolution
- Full audit trail of what was agreed
- AI-assisted dispute analysis
- Human arbitration when needed

### 5. Analytics
- Conversion rates by conversation pattern
- Price sensitivity analysis
- Negotiation optimization insights

---

## Revenue Model

| Service | Pricing | Rationale |
|---------|---------|-----------|
| Registry Lookup | Free | Distribution, get everyone on platform |
| Direct API Calls | Free | We're not involved, no cost to us |
| Hosted Conversations | $0.01-0.05/message | Value-based, scales with complexity |
| Conversation Subscription | $99-999/mo | For high-volume businesses |
| Payment Escrow | 2.9% + $0.30 | Stripe-like, only on hosted transactions |
| Dispute Resolution | $25-100/case | Covers human review costs |
| Analytics | $199-999/mo | Premium insights tier |

**Why this works:**
- Free tier captures all agent discovery traffic
- Hosted conversations capture high-value transactions
- Escrow is pure margin (money sitting in our account)
- Network effects: more businesses → more agents → more businesses

---

## Market Size

**Total Addressable Market:**
- B2B commerce: $23 trillion globally
- Business services: $5 trillion
- If 10% goes through agent commerce in 5 years = $2.8T
- At 1% take rate = $28B revenue opportunity

**Beachhead:**
- Local services (contractors, professionals): $500B US market
- 3% B2Alpha penetration at 2% take rate = $300M ARR

---

## Go-to-Market

### Phase 1: Registry (Distribution)
- Free, open registry for businesses
- Simple API for agent developers
- Goal: Become the default lookup for agent commerce

### Phase 2: Hosted Conversations (Monetization)
- Launch for high-value verticals: contractors, legal, B2B
- Escrow integration with Stripe
- Goal: Capture complex transactions

### Phase 3: Platform (Lock-in)
- Analytics dashboard for businesses
- Conversation templates and best practices
- Agent reputation scores
- Goal: Indispensable infrastructure

---

## Competitive Landscape

| Competitor | What They Do | Gap |
|------------|--------------|-----|
| Google/Yelp | Human-facing directories | No agent API, no conversations |
| Twilio | Communication APIs | No business registry, no escrow |
| Stripe | Payments | No discovery, no conversation hosting |
| OpenAI/Anthropic | Agent frameworks | No B2B infrastructure |

**B2Alpha's Position:** The missing layer between agents and businesses.

---

## Team Ask

Building this requires:
- Infrastructure engineers (registry at scale)
- Payments/fintech experience (escrow, compliance)
- AI/ML for dispute resolution and analytics
- Go-to-market for business onboarding

---

## The Vision

Every agent-to-business interaction flows through B2Alpha.

- Simple stuff? We're the lookup. Fast and free.
- Complex stuff? We're the host. Trusted and paid.

We become the infrastructure layer for agent commerce—essential, neutral, profitable.

---

## One-Liner

**B2Alpha: DNS for discovery, Stripe for negotiations.**

The agent economy needs infrastructure. We're building it.
