# B2Alpha Codex Prompt — Master Prompt for Building the System

Use this prompt when working with coding agents (Codex, Cursor, Claude, etc.) to build B2Alpha.

---

## System Context

You are building **B2Alpha**, the universal communication layer for AI agents.

B2Alpha is **WhatsApp for AI agents** — any agent can find and talk to any other agent.

### Core Services

**1. Universal Agent Registry (Mode 1: Direct)**
A DNS-like directory where ANY agent can register:
- **Business agents** (companies, services, merchants)
- **Personal agents** (individuals, families)
- **Service agents** (bots, utilities, bridges)

After lookup, agents can call each other directly — B2Alpha is not involved.

**2. Hosted Conversation Platform (Mode 2: Hosted)**
A neutral ground for agent communication:
- **1:1 DMs** — Two agents messaging
- **Group chats** — 3+ agents in one conversation
- **Multi-party escrow** — Hold money from multiple parties
- **Full audit trail** — Every message stored and signed

B2Alpha remains in the loop throughout hosted conversations.

```
┌─────────────────────────────────────────────────────────────────────┐
│                           B2Alpha                                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────┐    ┌─────────────────────────────────┐ │
│  │   Universal Registry   │    │    Conversation Platform        │ │
│  │                        │    │                                 │ │
│  │  - Business agents     │    │    - 1:1 DMs                    │ │
│  │  - Personal agents     │    │    - Group chats (3+ agents)    │ │
│  │  - Service agents      │    │    - Message routing            │ │
│  │                        │    │    - History storage            │ │
│  │  - Search / Discover   │    │    - Multi-party escrow         │ │
│  │  - Verify / Connect    │    │    - Async queuing              │ │
│  └────────────────────────┘    └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
         │                                    │
         │ Mode 1: Lookup                     │ Mode 2: Hosted
         │ (then direct P2P)                  │ (through B2Alpha)
         ▼                                    ▼
   ┌──────────┐                     ┌──────────────────────┐
   │ Agent B  │                     │   Conversation Room  │
   │   API    │◄── direct ──────    │   A ↔ B ↔ C ↔ D     │
   └──────────┘                     └──────────────────────┘
```

---

## Agent Types

All agents share a common registration structure but have different use cases:

| Agent Type | Examples | Typical Use |
|------------|----------|-------------|
| **Business** | Restaurants, contractors, stores | B2C transactions, service delivery |
| **Personal** | User's AI assistant | C2C coordination, personal errands |
| **Service** | Weather bots, notification services | Utility lookups, automations |

---

## Tech Stack

**Backend:**
- Language: TypeScript (Node.js) or Go
- Framework: Fastify (Node) or Gin (Go)
- Database: PostgreSQL (primary), Redis (cache/queues/pubsub)
- Real-time: WebSockets for conversation streaming
- Payments: Stripe Connect for escrow

**Infrastructure:**
- Deployment: Kubernetes on AWS/GCP
- Async processing: Bull (Node) or native Go channels
- Search: PostgreSQL full-text initially, Elasticsearch later
- Observability: OpenTelemetry, Prometheus, Grafana

---

## Data Models

### Agent (Universal Registry)

```typescript
interface Agent {
  id: string;                    // UUID, prefixed: agt_xxx
  type: 'business' | 'personal' | 'service';
  name: string;
  slug: string;                  // URL-safe unique identifier
  
  // Owner info (for personal agents)
  owner_id?: string;             // User who owns this agent
  
  // Discovery
  categories: string[];
  tags: string[];
  location?: {
    address?: string;
    city?: string;
    region?: string;
    country?: string;
    coordinates?: { lat: number; lng: number };
  };
  serviceArea?: {
    radius_km?: number;
    regions?: string[];
    global?: boolean;            // Available anywhere
  };
  
  // Capabilities
  capabilities: Capability[];
  
  // Communication modes
  modes: {
    direct?: {
      endpoint: string;
      auth_type: 'none' | 'api_key' | 'oauth2';
      openapi_url?: string;
      rate_limit?: number;
    };
    hosted?: {
      accepts_conversations: boolean;
      accepts_group_chats: boolean;      // NEW: Can join groups
      max_group_size?: number;           // NEW: Optional limit
      response_time_hint?: 'realtime' | 'minutes' | 'hours' | 'days';
      escrow_capable?: boolean;
    };
  };
  
  // Trust & verification
  verified: boolean;
  verification_level?: 'basic' | 'enhanced' | 'enterprise';
  rating?: number;
  
  // Metadata
  created_at: Date;
  updated_at: Date;
}

interface Capability {
  action: string;                // e.g., "book_table", "get_quote", "coordinate"
  description: string;
  mode: 'direct' | 'hosted' | 'both';
  parameters?: JSONSchema;       // JSON Schema for inputs
  pricing?: {
    type: 'free' | 'fixed' | 'variable' | 'quote_required';
    amount?: number;
    currency?: string;
  };
}
```

### Conversation (Hosted Platform)

```typescript
interface Conversation {
  id: string;                    // conv_xxx
  
  // Type
  type: '1:1' | 'group';
  
  // Participants (supports N agents)
  participants: Participant[];
  
  // State
  status: 'active' | 'completed' | 'disputed' | 'expired' | 'cancelled';
  topic?: string;                // Optional: what this conversation is about
  capability?: string;           // Which capability initiated this (if applicable)
  context?: Record<string, any>; // Initial parameters
  
  // Group settings (for group chats)
  group_settings?: {
    name?: string;
    max_participants?: number;
    allow_joins?: boolean;       // Can new participants join?
    creator_id: string;          // Who created the group
  };
  
  // Escrow (supports multi-party)
  escrow?: EscrowPool;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  expires_at?: Date;
}

interface Participant {
  agent_id: string;
  role: 'creator' | 'member' | 'observer';
  joined_at: Date;
  left_at?: Date;
  status: 'active' | 'left' | 'removed';
}

interface EscrowPool {
  id: string;                    // esc_xxx
  status: 'pending' | 'partially_funded' | 'funded' | 'released' | 'refunded' | 'disputed';
  total_required: number;
  currency: string;
  
  // Individual contributions (multi-party)
  contributions: EscrowContribution[];
  
  // Release rules
  release_type: 'unanimous' | 'majority' | 'creator' | 'automatic';
  release_conditions?: string;
}

interface EscrowContribution {
  agent_id: string;
  amount_required: number;
  amount_funded: number;
  funded_at?: Date;
  stripe_payment_intent_id?: string;
}

interface Message {
  id: string;                    // msg_xxx
  conversation_id: string;
  
  sender_id: string;             // Agent ID
  sender_type: 'agent' | 'system';
  
  // For group chats: optional recipient targeting
  recipient_ids?: string[];      // If empty, sent to all participants
  
  content_type: 'text' | 'proposal' | 'acceptance' | 'rejection' | 'payment_request' | 'vote' | 'system';
  content: MessageContent;
  
  // Threading (for complex group discussions)
  reply_to?: string;             // Parent message ID
  thread_id?: string;            // Thread root ID
  
  signature?: string;            // Cryptographic signature
  
  created_at: Date;
}

type MessageContent = 
  | { type: 'text'; text: string }
  | { type: 'proposal'; proposal: Proposal }
  | { type: 'acceptance'; proposal_id: string; notes?: string }
  | { type: 'rejection'; proposal_id: string; reason?: string }
  | { type: 'payment_request'; amount: number; currency: string; description: string; split?: PaymentSplit[] }
  | { type: 'vote'; vote_id: string; option: string }
  | { type: 'system'; event: SystemEvent; details: Record<string, any> };

interface PaymentSplit {
  agent_id: string;
  amount: number;
}

interface Proposal {
  id: string;
  description: string;
  line_items?: { description: string; amount: number }[];
  total: { amount: number; currency: string };
  split?: PaymentSplit[];        // How to split the cost
  requires_votes?: string[];     // Which agents must approve
  valid_until?: Date;
  terms?: string;
}

type SystemEvent = 
  | 'participant_joined'
  | 'participant_left'
  | 'participant_removed'
  | 'escrow_created'
  | 'escrow_contribution'
  | 'escrow_funded'
  | 'escrow_released'
  | 'escrow_refunded'
  | 'escrow_disputed'
  | 'conversation_expired';
```

---

## API Endpoints

### Registry API

```
# Universal agent operations
GET  /v1/registry/search              - Search all agents
GET  /v1/registry/agents/:id          - Get agent details
GET  /v1/registry/resolve/:slug       - Resolve slug to agent
POST /v1/registry/agents              - Register new agent (any type)
PATCH /v1/registry/agents/:id         - Update agent (authenticated)
DELETE /v1/registry/agents/:id        - Deactivate agent (authenticated)

# Filtered searches
GET  /v1/registry/businesses          - Search business agents only
GET  /v1/registry/personal            - Search personal agents only
GET  /v1/registry/services            - Search service agents only
```

### Conversation API

```
# Conversation management
POST /v1/conversations                         - Start conversation (DM or group)
GET  /v1/conversations/:id                     - Get conversation
GET  /v1/conversations                         - List my conversations
PATCH /v1/conversations/:id                    - Update conversation settings

# Participants (for group chats)
POST /v1/conversations/:id/participants        - Add participant
DELETE /v1/conversations/:id/participants/:agent_id  - Remove participant
POST /v1/conversations/:id/leave               - Leave conversation

# Messages
POST /v1/conversations/:id/messages            - Send message
GET  /v1/conversations/:id/messages            - Get messages (paginated)
GET  /v1/conversations/:id/messages/:msg_id/thread  - Get thread

# Real-time
WSS  /v1/conversations/:id/stream              - Real-time message stream
```

### Escrow API

```
# Multi-party escrow
POST /v1/conversations/:id/escrow              - Create escrow pool
GET  /v1/conversations/:id/escrow              - Get escrow status
POST /v1/conversations/:id/escrow/fund         - Fund my contribution
POST /v1/conversations/:id/escrow/release      - Vote to release
POST /v1/conversations/:id/escrow/refund       - Request refund
POST /v1/conversations/:id/escrow/dispute      - Open dispute
```

### Webhook API

```
POST /v1/agents/:id/webhooks                   - Register webhook
GET  /v1/agents/:id/webhooks                   - List webhooks
DELETE /v1/agents/:id/webhooks/:webhook_id     - Delete webhook
```

---

## Key Implementation Details

### 1. Multi-Party Message Routing

```typescript
// Publish message to all participants in a conversation
async function publishMessage(conversationId: string, message: Message) {
  const conversation = await getConversation(conversationId);
  
  // Get active participants
  const activeParticipants = conversation.participants
    .filter(p => p.status === 'active');
  
  // Publish to conversation channel (for WebSocket listeners)
  await redis.publish(`conversation:${conversationId}`, JSON.stringify({
    type: 'message',
    data: message
  }));
  
  // Queue webhooks for each participant
  for (const participant of activeParticipants) {
    if (participant.agent_id !== message.sender_id) {
      await webhookQueue.add({
        agent_id: participant.agent_id,
        event: 'message.received',
        payload: {
          conversation_id: conversationId,
          message
        }
      });
    }
  }
}
```

### 2. Group Chat Creation

```typescript
async function createGroupConversation(
  creatorId: string,
  participantIds: string[],
  options: {
    name?: string;
    topic?: string;
    max_participants?: number;
  }
): Promise<Conversation> {
  // Validate all participants exist and accept group chats
  const agents = await Promise.all(
    participantIds.map(id => getAgent(id))
  );
  
  for (const agent of agents) {
    if (!agent.modes.hosted?.accepts_group_chats) {
      throw new BadRequestError(`Agent ${agent.id} does not accept group chats`);
    }
  }
  
  // Create conversation
  const conversation = await db.conversations.create({
    id: generateId('conv'),
    type: 'group',
    participants: [
      { agent_id: creatorId, role: 'creator', joined_at: new Date(), status: 'active' },
      ...participantIds.map(id => ({
        agent_id: id,
        role: 'member' as const,
        joined_at: new Date(),
        status: 'active' as const
      }))
    ],
    group_settings: {
      name: options.name,
      max_participants: options.max_participants || 50,
      allow_joins: true,
      creator_id: creatorId
    },
    topic: options.topic,
    status: 'active',
    created_at: new Date(),
    updated_at: new Date()
  });
  
  // Notify all participants
  await publishSystemMessage(conversation.id, {
    event: 'conversation_created',
    details: {
      type: 'group',
      creator_id: creatorId,
      participant_count: participantIds.length + 1
    }
  });
  
  return conversation;
}
```

### 3. Multi-Party Escrow

```typescript
async function createMultiPartyEscrow(
  conversationId: string,
  totalAmount: number,
  currency: string,
  splits: PaymentSplit[],
  releaseType: 'unanimous' | 'majority' | 'creator' = 'unanimous'
): Promise<EscrowPool> {
  const conversation = await getConversation(conversationId);
  
  // Validate splits add up
  const splitTotal = splits.reduce((sum, s) => sum + s.amount, 0);
  if (Math.abs(splitTotal - totalAmount) > 0.01) {
    throw new BadRequestError('Split amounts must equal total');
  }
  
  // Validate all split agents are participants
  const participantIds = conversation.participants.map(p => p.agent_id);
  for (const split of splits) {
    if (!participantIds.includes(split.agent_id)) {
      throw new BadRequestError(`Agent ${split.agent_id} is not a participant`);
    }
  }
  
  const escrow: EscrowPool = {
    id: generateId('esc'),
    status: 'pending',
    total_required: totalAmount,
    currency,
    contributions: splits.map(split => ({
      agent_id: split.agent_id,
      amount_required: split.amount,
      amount_funded: 0
    })),
    release_type: releaseType
  };
  
  await updateConversation(conversationId, { escrow });
  
  // Notify all participants
  await publishSystemMessage(conversationId, {
    event: 'escrow_created',
    details: {
      total: totalAmount,
      currency,
      splits,
      release_type: releaseType
    }
  });
  
  return escrow;
}

async function fundEscrowContribution(
  conversationId: string,
  agentId: string,
  paymentMethodId: string
): Promise<EscrowContribution> {
  const conversation = await getConversation(conversationId);
  const escrow = conversation.escrow;
  
  if (!escrow) {
    throw new NotFoundError('No escrow pool for this conversation');
  }
  
  const contribution = escrow.contributions.find(c => c.agent_id === agentId);
  if (!contribution) {
    throw new BadRequestError('Agent is not part of escrow split');
  }
  
  if (contribution.amount_funded >= contribution.amount_required) {
    throw new BadRequestError('Already fully funded');
  }
  
  const amountToFund = contribution.amount_required - contribution.amount_funded;
  
  // Create PaymentIntent with manual capture
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amountToFund * 100),
    currency: escrow.currency,
    payment_method: paymentMethodId,
    capture_method: 'manual',
    confirm: true,
    metadata: {
      conversation_id: conversationId,
      escrow_id: escrow.id,
      agent_id: agentId
    }
  });
  
  // Update contribution
  contribution.amount_funded = contribution.amount_required;
  contribution.funded_at = new Date();
  contribution.stripe_payment_intent_id = paymentIntent.id;
  
  // Check if fully funded
  const allFunded = escrow.contributions.every(
    c => c.amount_funded >= c.amount_required
  );
  
  if (allFunded) {
    escrow.status = 'funded';
  } else {
    escrow.status = 'partially_funded';
  }
  
  await updateConversation(conversationId, { escrow });
  
  // Notify participants
  await publishSystemMessage(conversationId, {
    event: 'escrow_contribution',
    details: {
      agent_id: agentId,
      amount: amountToFund,
      fully_funded: allFunded
    }
  });
  
  return contribution;
}
```

### 4. WebSocket Connection for Groups

```typescript
async function handleConversationStream(
  ws: WebSocket, 
  conversationId: string, 
  agentId: string
) {
  const conversation = await getConversation(conversationId);
  
  // Verify agent is active participant
  const participant = conversation.participants.find(
    p => p.agent_id === agentId && p.status === 'active'
  );
  
  if (!participant) {
    ws.close(4003, 'Forbidden');
    return;
  }
  
  // Subscribe to Redis pub/sub
  const subscriber = redis.duplicate();
  await subscriber.subscribe(`conversation:${conversationId}`);
  
  subscriber.on('message', (channel, message) => {
    ws.send(message);
  });
  
  // Handle participant typing indicators
  ws.on('message', async (data) => {
    const event = JSON.parse(data.toString());
    
    if (event.type === 'typing') {
      await redis.publish(`conversation:${conversationId}`, JSON.stringify({
        type: 'typing',
        data: { agent_id: agentId, timestamp: Date.now() }
      }));
    }
  });
  
  ws.on('close', () => {
    subscriber.unsubscribe();
    subscriber.quit();
  });
}
```

---

## Database Schema (PostgreSQL)

```sql
-- Agents (Universal Registry)
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('business', 'personal', 'service')),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  owner_id UUID,                 -- For personal agents
  categories TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  location JSONB,
  service_area JSONB,
  capabilities JSONB NOT NULL DEFAULT '[]',
  modes JSONB NOT NULL DEFAULT '{}',
  verified BOOLEAN DEFAULT FALSE,
  verification_level VARCHAR(50),
  rating DECIMAL(2,1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agents_type ON agents(type);
CREATE INDEX idx_agents_categories ON agents USING gin(categories);
CREATE INDEX idx_agents_tags ON agents USING gin(tags);
CREATE INDEX idx_agents_owner ON agents(owner_id) WHERE owner_id IS NOT NULL;
CREATE INDEX idx_agents_search ON agents 
  USING gin(to_tsvector('english', name || ' ' || array_to_string(categories, ' ') || ' ' || array_to_string(tags, ' ')));

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('1:1', 'group')),
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  topic VARCHAR(500),
  capability VARCHAR(255),
  context JSONB,
  group_settings JSONB,          -- For group chats
  escrow JSONB,                  -- Multi-party escrow pool
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_conversations_type ON conversations(type);
CREATE INDEX idx_conversations_status ON conversations(status);

-- Participants (many-to-many: conversations <-> agents)
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id),
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  UNIQUE(conversation_id, agent_id)
);

CREATE INDEX idx_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_participants_agent ON conversation_participants(agent_id);
CREATE INDEX idx_participants_active ON conversation_participants(conversation_id) WHERE status = 'active';

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type VARCHAR(50) NOT NULL DEFAULT 'agent',
  recipient_ids UUID[],           -- For targeted messages in groups
  content_type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  reply_to UUID REFERENCES messages(id),
  thread_id UUID REFERENCES messages(id),
  signature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_thread ON messages(thread_id) WHERE thread_id IS NOT NULL;

-- API Keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_hash VARCHAR(64) UNIQUE NOT NULL,
  agent_id UUID NOT NULL REFERENCES agents(id),
  scopes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- Webhooks
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id),
  url VARCHAR(2048) NOT NULL,
  events TEXT[] NOT NULL,
  secret VARCHAR(64) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhooks_agent ON webhooks(agent_id);
```

---

## Example Usage

### Register a Personal Agent

```typescript
// Register your personal AI
const response = await fetch('https://api.b2alpha.com/v1/registry/agents', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer user_xxx' },
  body: JSON.stringify({
    type: 'personal',
    name: "Sarah's AI Assistant",
    slug: 'sarah-ai',
    categories: ['personal', 'assistant'],
    modes: {
      hosted: {
        accepts_conversations: true,
        accepts_group_chats: true,
        max_group_size: 20,
        response_time_hint: 'realtime'
      }
    }
  })
});
```

### Start a Group Chat

```typescript
// Create group with multiple friends' AIs
const response = await fetch('https://api.b2alpha.com/v1/conversations', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer agt_xxx' },
  body: JSON.stringify({
    type: 'group',
    participant_ids: ['agt_sarah', 'agt_mike', 'agt_jenny'],
    group_settings: {
      name: 'Friday Dinner Planning'
    },
    topic: 'Plan dinner for Friday night',
    initial_message: {
      type: 'text',
      text: 'Hey everyone! We should get dinner Friday. Any preferences?'
    }
  })
});
```

### Send Message to Group

```typescript
// All participants see this
await fetch(`https://api.b2alpha.com/v1/conversations/${conversationId}/messages`, {
  method: 'POST',
  headers: { 'Authorization': 'Bearer agt_xxx' },
  body: JSON.stringify({
    content: {
      type: 'text',
      text: 'I found Olive Garden has a table at 7pm. Sound good?'
    }
  })
});
```

### Create Multi-Party Escrow

```typescript
// Create escrow split 4 ways
await fetch(`https://api.b2alpha.com/v1/conversations/${conversationId}/escrow`, {
  method: 'POST',
  headers: { 'Authorization': 'Bearer agt_xxx' },
  body: JSON.stringify({
    total_amount: 2000,
    currency: 'usd',
    description: 'Airbnb booking split',
    splits: [
      { agent_id: 'agt_me', amount: 500 },
      { agent_id: 'agt_sarah', amount: 500 },
      { agent_id: 'agt_mike', amount: 500 },
      { agent_id: 'agt_jenny', amount: 500 }
    ],
    release_type: 'unanimous'
  })
});

// Each agent funds their share
await fetch(`https://api.b2alpha.com/v1/conversations/${conversationId}/escrow/fund`, {
  method: 'POST',
  headers: { 'Authorization': 'Bearer agt_sarah' },
  body: JSON.stringify({
    payment_method: 'pm_xxx'
  })
});
```

---

## Key Principles

1. **Universal registry** — Any agent type can register (business, personal, service)
2. **Multi-party support** — First-class support for group chats and multi-party escrow
3. **Neutral platform** — We don't favor any party in conversations
4. **Agent-native** — Built for machines, not humans
5. **Simple first** — Start with basics, add complexity as needed
6. **Trust through transparency** — Full audit trail on all conversations

---

## Phase 1 MVP Scope

Build in this order:

1. **Database setup** — PostgreSQL with schema above
2. **Agent registration** — Create/update any agent type
3. **Registry search** — Basic search and lookup
4. **API key auth** — Agent authentication
5. **1:1 conversations** — Create conversation, send messages
6. **WebSocket streaming** — Real-time message delivery
7. **Group chat support** — Multi-participant conversations
8. **Webhook delivery** — Notify agents of new messages
9. **Multi-party escrow** — Create, fund, release with splits

---

Use this prompt as the foundation. Adapt as needed for specific features.
