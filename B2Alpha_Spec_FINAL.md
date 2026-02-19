# B2Alpha Technical Specification v1.0

## Overview

B2Alpha provides two core services:
1. **Registry Service** — Business discovery and endpoint lookup
2. **Conversation Host Service** — Hosted multi-turn conversations with escrow

```
┌─────────────────────────────────────────────────────────────┐
│                        B2Alpha                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌──────────────────────────────────┐   │
│  │  Registry   │    │    Conversation Host             │   │
│  │  (Lookup)   │    │    - Message relay               │   │
│  │             │    │    - History storage             │   │
│  │  - Search   │    │    - Async queue                 │   │
│  │  - Discover │    │    - Escrow integration          │   │
│  └─────────────┘    └──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         │                          │
         │ Mode 1: Lookup           │ Mode 2: Hosted
         │ (then direct)            │ (through B2Alpha)
         ▼                          ▼
   ┌──────────┐              ┌──────────────┐
   │ Business │              │   Business   │
   │   API    │◄── direct ───│    Agent     │
   └──────────┘              └──────────────┘
```

---

## Part 1: Registry Service

### Purpose
DNS for agent commerce. Agents query the registry to find businesses and their capabilities.

### Data Model

```typescript
interface Business {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Human-readable name
  slug: string;                  // URL-safe identifier
  
  // Discovery metadata
  categories: string[];          // e.g., ["restaurant", "italian", "fine-dining"]
  location?: {
    address: string;
    city: string;
    region: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  serviceArea?: {                // For service businesses
    radius_km?: number;
    regions?: string[];
  };
  
  // Capabilities
  capabilities: Capability[];
  
  // Connection modes
  modes: {
    direct?: DirectConfig;       // Mode 1: Direct API
    hosted?: HostedConfig;       // Mode 2: Hosted Conversations
  };
  
  // Metadata
  verified: boolean;
  rating?: number;
  created_at: string;
  updated_at: string;
}

interface Capability {
  action: string;                // e.g., "book_table", "get_quote", "purchase"
  description: string;
  parameters: ParameterSchema[]; // JSON Schema for inputs
  mode: "direct" | "hosted";     // Which mode handles this
  pricing?: {
    type: "fixed" | "variable" | "quote_required";
    amount?: number;
    currency?: string;
  };
}

interface DirectConfig {
  endpoint: string;              // Base URL for direct API calls
  auth_type: "none" | "api_key" | "oauth2";
  openapi_url?: string;          // Link to OpenAPI spec
  rate_limit?: number;           // Requests per minute
}

interface HostedConfig {
  accepts_conversations: boolean;
  response_time_hint?: string;   // e.g., "minutes", "hours", "days"
  escrow_required?: boolean;     // Whether escrow is mandatory
  min_transaction?: number;      // Minimum transaction value
}
```

### Registry API

#### Search Businesses
```http
GET /v1/registry/search
```

Query Parameters:
- `q` — Free-text search query
- `category` — Filter by category
- `location` — Location string or coordinates
- `radius_km` — Search radius (default: 50)
- `capability` — Filter by capability action
- `mode` — Filter by mode ("direct" | "hosted")
- `limit` — Results per page (default: 20, max: 100)
- `offset` — Pagination offset

Response:
```json
{
  "results": [
    {
      "id": "biz_abc123",
      "name": "Mario's Italian Kitchen",
      "categories": ["restaurant", "italian"],
      "location": { "city": "San Francisco", "region": "CA" },
      "capabilities": [
        { "action": "book_table", "mode": "direct" },
        { "action": "catering_quote", "mode": "hosted" }
      ],
      "modes": {
        "direct": { "endpoint": "https://api.marios.com/v1" },
        "hosted": { "accepts_conversations": true }
      },
      "rating": 4.7,
      "verified": true
    }
  ],
  "total": 142,
  "limit": 20,
  "offset": 0
}
```

#### Get Business Details
```http
GET /v1/registry/business/{id}
```

Returns full `Business` object including complete capability schemas.

#### Resolve by Slug
```http
GET /v1/registry/resolve/{slug}
```

Returns business ID and basic info for a known slug (like DNS resolution).

### Business Registration

#### Register Business
```http
POST /v1/registry/business
Authorization: Bearer {api_key}
```

```json
{
  "name": "Acme Contractors",
  "categories": ["contractor", "general", "residential"],
  "location": { ... },
  "modes": {
    "hosted": {
      "accepts_conversations": true,
      "escrow_required": true
    }
  },
  "capabilities": [ ... ]
}
```

#### Update Business
```http
PATCH /v1/registry/business/{id}
Authorization: Bearer {api_key}
```

---

## Part 2: Conversation Host Service

### Purpose
Hosts multi-turn conversations between user agents and business agents. Provides:
- Message relay with guaranteed delivery
- Persistent conversation history
- Payment escrow integration
- Dispute resolution support

### When to Use Hosted vs Direct

| Criteria | Use Direct | Use Hosted |
|----------|------------|------------|
| Single request/response | ✓ | |
| Fixed pricing | ✓ | |
| No negotiation needed | ✓ | |
| Multi-turn interaction | | ✓ |
| Variable/negotiated pricing | | ✓ |
| Money will change hands | | ✓ |
| Need audit trail | | ✓ |
| Async responses expected | | ✓ |
| Dispute possibility | | ✓ |

### Conversation Data Model

```typescript
interface Conversation {
  id: string;                    // Unique conversation ID
  
  // Participants
  user_agent: {
    id: string;                  // Agent identifier
    user_id?: string;            // Optional user identifier
    display_name?: string;
  };
  business: {
    id: string;                  // B2Alpha business ID
    name: string;
  };
  
  // State
  status: "active" | "completed" | "disputed" | "expired" | "cancelled";
  
  // Messages
  messages: Message[];
  
  // Financial
  escrow?: EscrowState;
  
  // Metadata
  created_at: string;
  updated_at: string;
  expires_at?: string;
  
  // Capabilities used
  capability: string;            // The capability this conversation is about
  context?: object;              // Initial context/parameters
}

interface Message {
  id: string;
  conversation_id: string;
  
  // Sender
  sender: "user_agent" | "business_agent" | "system";
  
  // Content
  content: MessageContent;
  
  // Metadata
  timestamp: string;
  signature?: string;            // Cryptographic signature
  
  // Threading
  reply_to?: string;             // Reference to another message ID
}

interface MessageContent {
  type: "text" | "structured" | "proposal" | "acceptance" | "rejection" | "payment_request" | "system";
  
  // For text messages
  text?: string;
  
  // For structured data
  data?: object;
  schema?: string;               // Reference to known schema
  
  // For proposals (quotes, offers)
  proposal?: {
    description: string;
    line_items?: LineItem[];
    total: { amount: number; currency: string };
    valid_until?: string;
    terms?: string;
  };
  
  // For payment requests
  payment_request?: {
    amount: number;
    currency: string;
    description: string;
    escrow_required: boolean;
    milestone?: string;
  };
}

interface EscrowState {
  status: "none" | "pending" | "funded" | "released" | "refunded" | "disputed";
  amount?: number;
  currency?: string;
  funded_at?: string;
  released_at?: string;
  stripe_payment_intent?: string;
  milestones?: Milestone[];
}

interface Milestone {
  id: string;
  description: string;
  amount: number;
  status: "pending" | "funded" | "released" | "disputed";
}
```

### Conversation API

#### Start Conversation
```http
POST /v1/conversations
Authorization: Bearer {agent_api_key}
```

```json
{
  "business_id": "biz_abc123",
  "capability": "get_quote",
  "context": {
    "project_type": "kitchen_remodel",
    "budget_range": "50000-75000",
    "timeline": "3_months"
  },
  "initial_message": {
    "type": "text",
    "text": "Hi, I'm looking for a quote on a kitchen remodel. The space is approximately 200 sq ft."
  }
}
```

Response:
```json
{
  "conversation_id": "conv_xyz789",
  "status": "active",
  "business": {
    "id": "biz_abc123",
    "name": "Acme Contractors"
  },
  "webhook_url": "wss://api.b2alpha.com/v1/conversations/conv_xyz789/stream"
}
```

#### Send Message
```http
POST /v1/conversations/{conversation_id}/messages
Authorization: Bearer {agent_api_key}
```

```json
{
  "content": {
    "type": "text",
    "text": "That sounds good. Can you also include new countertops?"
  }
}
```

#### Get Conversation
```http
GET /v1/conversations/{conversation_id}
Authorization: Bearer {agent_api_key}
```

Returns full conversation with all messages.

#### Get Messages (Paginated)
```http
GET /v1/conversations/{conversation_id}/messages?since={message_id}&limit=50
```

#### List Conversations
```http
GET /v1/conversations?status=active&limit=20
Authorization: Bearer {agent_api_key}
```

### Real-Time Updates

#### WebSocket Stream
```
WSS /v1/conversations/{conversation_id}/stream
```

Receives real-time messages as they're sent by the other party.

Message format:
```json
{
  "type": "message",
  "data": { /* Message object */ }
}
```

Event types:
- `message` — New message in conversation
- `status_change` — Conversation status changed
- `escrow_update` — Escrow state changed
- `typing` — Other party is typing (optional)

#### Webhook Delivery
For agents that can't maintain WebSocket connections:

```http
POST {agent_webhook_url}
X-B2Alpha-Signature: {hmac_signature}
```

```json
{
  "event": "conversation.message",
  "conversation_id": "conv_xyz789",
  "message": { /* Message object */ }
}
```

---

## Part 3: Escrow Integration

### Purpose
Hold funds in escrow until transaction completion. Integrated with Stripe.

### Escrow Flow

```
1. Business sends payment_request message
2. User agent funds escrow via B2Alpha
3. B2Alpha creates Stripe PaymentIntent (capture later)
4. Work proceeds, messages continue
5. User confirms completion OR dispute raised
6. B2Alpha captures/refunds payment
```

### Escrow API

#### Fund Escrow
```http
POST /v1/conversations/{conversation_id}/escrow/fund
Authorization: Bearer {agent_api_key}
```

```json
{
  "amount": 5000.00,
  "currency": "usd",
  "payment_method": "pm_card_xxx",  // Stripe payment method
  "milestone_id": "milestone_1"      // Optional, for milestone-based
}
```

Response:
```json
{
  "escrow_id": "escrow_abc",
  "status": "funded",
  "amount": 5000.00,
  "currency": "usd",
  "stripe_payment_intent": "pi_xxx"
}
```

#### Release Escrow
```http
POST /v1/conversations/{conversation_id}/escrow/release
Authorization: Bearer {agent_api_key}
```

```json
{
  "milestone_id": "milestone_1",     // Optional
  "confirmation": "work_completed"
}
```

#### Request Refund
```http
POST /v1/conversations/{conversation_id}/escrow/refund
Authorization: Bearer {agent_api_key}
```

```json
{
  "reason": "work_not_started",
  "amount": 5000.00                  // Can be partial
}
```

This initiates dispute resolution if business doesn't agree.

### Milestone-Based Escrow

For large projects:

```json
{
  "milestones": [
    { "id": "m1", "description": "Design approval", "amount": 1000, "percentage": 20 },
    { "id": "m2", "description": "Demolition complete", "amount": 1500, "percentage": 30 },
    { "id": "m3", "description": "Installation complete", "amount": 2000, "percentage": 40 },
    { "id": "m4", "description": "Final inspection", "amount": 500, "percentage": 10 }
  ]
}
```

Each milestone can be funded and released independently.

---

## Part 4: Business Agent Integration

### For Businesses: Receiving Conversations

Businesses connect to B2Alpha to receive and respond to conversations.

#### Webhook Configuration
```http
POST /v1/business/webhooks
Authorization: Bearer {business_api_key}
```

```json
{
  "url": "https://mycompany.com/b2alpha/webhook",
  "events": ["conversation.started", "conversation.message", "escrow.funded"],
  "secret": "whsec_xxx"
}
```

#### Receiving Messages

B2Alpha POSTs to webhook:
```json
{
  "event": "conversation.message",
  "conversation_id": "conv_xyz789",
  "message": {
    "id": "msg_123",
    "sender": "user_agent",
    "content": {
      "type": "text",
      "text": "Can you also include new countertops?"
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### Sending Responses
```http
POST /v1/conversations/{conversation_id}/messages
Authorization: Bearer {business_api_key}
```

```json
{
  "content": {
    "type": "proposal",
    "proposal": {
      "description": "Kitchen remodel with countertops",
      "line_items": [
        { "description": "Demolition", "amount": 2000 },
        { "description": "Cabinets", "amount": 8000 },
        { "description": "Countertops (granite)", "amount": 4500 },
        { "description": "Installation", "amount": 5500 }
      ],
      "total": { "amount": 20000, "currency": "usd" },
      "valid_until": "2024-01-22T00:00:00Z",
      "terms": "50% upfront, 50% on completion"
    }
  }
}
```

### Business SDK

We provide SDKs for common platforms:

```python
# Python SDK
from b2alpha import B2AlphaClient

client = B2AlphaClient(api_key="biz_xxx")

@client.on("conversation.message")
def handle_message(conversation_id, message):
    # Your business logic
    response = generate_response(message)
    
    client.send_message(
        conversation_id=conversation_id,
        content={"type": "text", "text": response}
    )

client.listen()
```

---

## Part 5: Direct Mode (Mode 1)

### Purpose
For simple, stateless interactions. B2Alpha provides the endpoint; agent calls business directly.

### Flow

```
1. Agent queries B2Alpha Registry
2. Gets business endpoint + OpenAPI spec
3. Agent calls business API directly
4. B2Alpha is NOT involved in the call
```

### Business OpenAPI Requirements

Businesses supporting direct mode must provide:

```yaml
openapi: 3.0.0
info:
  title: Mario's Restaurant API
  version: 1.0.0
  x-b2alpha:
    business_id: biz_abc123
    capabilities:
      - book_table
      - check_hours
      - view_menu

paths:
  /reservations:
    post:
      operationId: book_table
      summary: Book a table
      x-b2alpha-capability: book_table
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                date: { type: string, format: date }
                time: { type: string }
                party_size: { type: integer }
                name: { type: string }
              required: [date, time, party_size, name]
      responses:
        200:
          description: Reservation confirmed
          content:
            application/json:
              schema:
                type: object
                properties:
                  confirmation_number: { type: string }
                  datetime: { type: string }
```

### Registry Entry for Direct Mode

```json
{
  "id": "biz_abc123",
  "name": "Mario's Italian Kitchen",
  "modes": {
    "direct": {
      "endpoint": "https://api.marios.com/v1",
      "auth_type": "api_key",
      "openapi_url": "https://api.marios.com/v1/openapi.json",
      "rate_limit": 100
    }
  },
  "capabilities": [
    {
      "action": "book_table",
      "mode": "direct",
      "description": "Book a table reservation",
      "parameters": [
        { "name": "date", "type": "string", "required": true },
        { "name": "time", "type": "string", "required": true },
        { "name": "party_size", "type": "integer", "required": true }
      ]
    }
  ]
}
```

---

## Part 6: Authentication & Security

### Agent Authentication

Agents authenticate with B2Alpha using API keys:

```http
Authorization: Bearer agent_xxx
```

Keys have scopes:
- `registry:read` — Search and lookup
- `conversations:write` — Start and participate in conversations
- `escrow:write` — Fund and release escrow

### Business Authentication

Businesses authenticate with separate keys:

```http
Authorization: Bearer biz_xxx
```

### Message Signing

All messages in hosted conversations are cryptographically signed:

```json
{
  "id": "msg_123",
  "content": { ... },
  "timestamp": "2024-01-15T10:30:00Z",
  "signature": "sha256:abc123...",
  "signer": "agent_xxx"
}
```

Signatures enable:
- Proof of who said what
- Tamper detection
- Dispute resolution evidence

### Rate Limits

| Endpoint | Limit |
|----------|-------|
| Registry Search | 1000/min |
| Registry Lookup | 5000/min |
| Start Conversation | 100/min |
| Send Message | 500/min |
| Escrow Operations | 50/min |

---

## Part 7: Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "conversation_not_found",
    "message": "Conversation conv_xyz789 does not exist or you don't have access",
    "details": {
      "conversation_id": "conv_xyz789"
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `invalid_request` | 400 | Malformed request |
| `unauthorized` | 401 | Invalid or missing API key |
| `forbidden` | 403 | Valid key but insufficient permissions |
| `not_found` | 404 | Resource doesn't exist |
| `conversation_closed` | 409 | Can't message a completed/cancelled conversation |
| `escrow_already_funded` | 409 | Escrow already exists |
| `rate_limited` | 429 | Too many requests |
| `business_unavailable` | 503 | Business agent not responding |

---

## Part 8: Example Flows

### Flow 1: Simple Restaurant Booking (Direct Mode)

```
Agent                          B2Alpha                         Business
  |                               |                               |
  |-- GET /registry/search ------>|                               |
  |   q=italian+restaurant        |                               |
  |<-- { results: [...] } --------|                               |
  |                               |                               |
  |-- GET /registry/biz_abc123 -->|                               |
  |<-- { endpoint, openapi } -----|                               |
  |                               |                               |
  |                               |    (Direct call, B2Alpha not involved)
  |-- POST /reservations ---------------------------->|
  |   { date, time, party_size }                      |
  |<-- { confirmation_number } -----------------------|
```

### Flow 2: Contractor Quote (Hosted Mode)

```
Agent                          B2Alpha                         Business
  |                               |                               |
  |-- POST /conversations ------->|                               |
  |   { business_id, capability,  |                               |
  |     initial_message }         |                               |
  |<-- { conversation_id } -------|                               |
  |                               |-- webhook: new conversation -->|
  |                               |                               |
  |                               |<-- POST /messages -------------|
  |                               |    "What's the sq footage?"    |
  |<-- websocket: new message ----|                               |
  |                               |                               |
  |-- POST /messages ------------>|                               |
  |   "About 200 sq ft"           |-- webhook: new message ------->|
  |                               |                               |
  |                               |<-- POST /messages -------------|
  |                               |    { type: proposal,          |
  |                               |      total: $20,000 }         |
  |<-- websocket: new message ----|                               |
  |                               |                               |
  |-- POST /messages ------------>|                               |
  |   { type: acceptance }        |-- webhook: acceptance -------->|
  |                               |                               |
  |                               |<-- POST /messages -------------|
  |                               |    { type: payment_request,   |
  |                               |      escrow: true }           |
  |<-- websocket: payment_request-|                               |
  |                               |                               |
  |-- POST /escrow/fund --------->|                               |
  |   { amount: 10000 }           |-- webhook: escrow funded ----->|
  |<-- { status: funded } --------|                               |
  |                               |                               |
  ...work proceeds, messages continue...
  |                               |                               |
  |-- POST /escrow/release ------>|                               |
  |<-- { status: released } ------|-- webhook: payment released -->|
```

---

## Appendix: Message Type Schemas

### Proposal Message
```json
{
  "type": "proposal",
  "proposal": {
    "id": "prop_123",
    "description": "Kitchen remodel project",
    "line_items": [
      { "description": "Materials", "amount": 8000, "currency": "usd" },
      { "description": "Labor", "amount": 12000, "currency": "usd" }
    ],
    "total": { "amount": 20000, "currency": "usd" },
    "valid_until": "2024-01-22T00:00:00Z",
    "terms": "50% upfront, 50% on completion",
    "attachments": [
      { "name": "detailed_quote.pdf", "url": "https://..." }
    ]
  }
}
```

### Payment Request Message
```json
{
  "type": "payment_request",
  "payment_request": {
    "amount": 10000,
    "currency": "usd",
    "description": "Initial deposit - 50%",
    "escrow_required": true,
    "due_by": "2024-01-20T00:00:00Z",
    "milestone": {
      "id": "m1",
      "description": "Project start"
    }
  }
}
```

### Acceptance Message
```json
{
  "type": "acceptance",
  "acceptance": {
    "proposal_id": "prop_123",
    "accepted_at": "2024-01-16T14:00:00Z",
    "notes": "Please start next Monday"
  }
}
```

### System Message
```json
{
  "type": "system",
  "system": {
    "event": "escrow_funded",
    "details": {
      "amount": 10000,
      "currency": "usd",
      "funded_by": "user_agent"
    }
  }
}
```
