---
title: "Communication Protocols — HTTP, WebSockets, gRPC & SSE"
description: "Master modern communication protocols including HTTP/HTTPS, REST APIs, WebSockets, Server-Sent Events (SSE), gRPC, Long Polling, and Webhooks. Learn when to use each protocol, their trade-offs, and how large-scale systems enable real-time communication."
pubDate: 2026-06-06T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-communication-protocols.avif
tags: ["system-design", "http", "websockets", "grpc", "sse", "rest-api", "distributed-systems"]
featured: false
draft: false
series:
    name: "System Design"
    part: 9
---

## The Story: Ways to Communicate in a City

- **HTTP (Request-Response):** You send a letter, wait for a reply. You initiate, server responds. Done.
- **WebSockets:** You open a phone call. Both can speak at any time. The line stays open.
- **gRPC:** A highly efficient internal memo system between departments — structured, typed, fast.
- **Server-Sent Events:** A news broadcast. Server pushes updates. You only listen.
- **Long Polling:** You call the office and wait on hold until they have an answer.

---

## HTTP / HTTPS

HTTP (HyperText Transfer Protocol) is the protocol of the web. Every API call, every web page request, every REST call is HTTP.

**Request-Response cycle:**

```
Client → [HTTP Request]  → Server
Client ← [HTTP Response] ← Server
Connection closes (HTTP/1.1: may keep-alive, HTTP/2: multiplexed)
```

**HTTP Versions**

| Version  | Key improvement                               | Connection                                       |
| -------- | --------------------------------------------- | ------------------------------------------------ |
| HTTP/1.0 | Original                                      | New TCP connection per request                   |
| HTTP/1.1 | Keep-alive, pipelining                        | Reuse connection, but HOL blocking               |
| HTTP/2   | Multiplexing, header compression, server push | Multiple requests in parallel on one connection  |
| HTTP/3   | Built on QUIC (UDP)                           | Eliminates TCP HOL blocking, faster reconnection |

**Head-of-Line (HOL) blocking in HTTP/1.1:** Requests are served in order on a connection. If request 1 is slow, requests 2–10 wait even if they're ready. HTTP/2 multiplexing sends all in parallel on one connection.

**HTTP Methods**

| Method | Operation               | Idempotent? | Body? |
| ------ | ----------------------- | ----------- | ----- |
| GET    | Read                    | Yes         | No    |
| POST   | Create                  | No          | Yes   |
| PUT    | Replace entire resource | Yes         | Yes   |
| PATCH  | Partial update          | No          | Yes   |
| DELETE | Delete                  | Yes         | No    |
| HEAD   | Like GET, but no body   | Yes         | No    |

**Idempotent:** Calling the same request multiple times has the same effect as calling it once. Important for retry logic.

**HTTP Status Codes**

```
2xx — Success
  200 OK                     →  success
  201 Created                →  resource created (POST)
  204 No Content             →  success, no body (DELETE)

3xx — Redirection
  301 Moved Permanently      →  browser caches, SEO-safe
  302 Found                  →  temporary redirect
  304 Not Modified           →  browser uses cached version

4xx — Client Error
  400 Bad Request            →  malformed request
  401 Unauthorized           →  not authenticated
  403 Forbidden              →  authenticated but not allowed
  404 Not Found              →  resource doesn't exist
  409 Conflict               →  state conflict (e.g., duplicate username)
  422 Unprocessable          →  validation failure
  429 Too Many Requests      →  rate limited

5xx — Server Error
  500 Internal Server Error  →  generic server crash
  502 Bad Gateway            →  upstream service unreachable
  503 Service Unavailable    →  server overloaded or down
  504 Gateway Timeout        →  upstream too slow
```

### REST Design Principles

**REST (Representational State Transfer)** is an architectural style for HTTP APIs.

**Key principles:**

1. **Resources are nouns** (not verbs):

```
✅ GET    /users/42           → get user 42
✅ POST   /users              → create user
✅ PUT    /users/42           → update user 42
✅ DELETE /users/42           → delete user 42

❌ GET    /getUser?id=42
❌ POST   /createUser
❌ POST   /deleteUser/42
```

2. **Stateless:** Every request contains all information needed. No server-side session state.

3. **Hierarchical URLs reflect relationships:**

```
/users/42/orders           → orders belongs to user 42
/users/42/orders/101       → specific order 101 belongs to user 42
/users/42/orders/101/items → items in the order 101 belongs to user 42
```

4. **Use query params for filtering, sorting, pagination:**

```
GET /products?category=electronics&sort=price_asc&page=2&limit=20
```

5. **Version your API:**

```
GET /api/v1/users/42     ← current
GET /api/v2/users/42     ← new version with breaking changes
```

---

## WebSockets: The Open Phone Line

### What WebSockets solve

HTTP is request-response. The client always initiates. What if the server needs to push data to the client?

**Problem scenarios:**

- Chat: other users' messages appear without you refreshing
- Live scores: score updates automatically
- Stock prices: real-time price changes
- Collaborative editing: see others' cursor movements

**Naive solution: polling**

```
Client: every 1 second → "Any new messages?"
Server: "No"
Client: "Any new messages?"
Server: "No"
Client: "Any new messages?"
Server: "Yes! Here it is."

99% of requests return "No" — wasted bandwidth and latency
```

**WebSocket solution:** Persistent, full-duplex connection. Both sides can send at any time.

### WebSocket Handshake

WebSockets upgrade from HTTP:

```
Client → Server: HTTP upgrade request
GET /chat HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==

Server → Client: 101 Switching Protocols
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

--- Connection is now a WebSocket ---

Server → Client: "{'type':'message','text':'Hello!'}"  (any time)
Client → Server: "{'type':'message','text':'Hi back!'}"  (any time)
```

### WebSocket use cases

| Use case                | Why WebSocket?                          |
| ----------------------- | --------------------------------------- |
| Chat applications       | Bidirectional real-time messaging       |
| Live sports scores      | Server pushes score updates             |
| Collaborative documents | Real-time cursor and edit sync          |
| Online gaming           | Low latency bidirectional state updates |
| Live trading dashboards | Sub-second price updates                |
| IoT device monitoring   | Continuous sensor data streams          |

### WebSocket scaling challenges

```
Problem: User opens WebSocket → connects to Server 1
         User A and User B must be on same server to chat directly

Solution options:
1. Sticky sessions: Load Balancer routes same user to same server always
   - Problem: server failures lose all connections

2. Pub/Sub broker (Redis Pub/Sub):
   Server 1 (User A) → publishes  → [Redis Pub/Sub channel]
   Server 2 (User B) ← subscribes ← [Redis Pub/Sub channel]
   Server 2 delivers to User B

3. Message broker (Kafka/RabbitMQ):
   Same as above but durable (messages survive crashes)
```

**In production:** Use Redis Pub/Sub or a dedicated WebSocket service (Pusher, Ably, AWS API Gateway WebSocket).

---

## Server-Sent Events (SSE)

**One-way push from server to client over HTTP.** Simpler than WebSockets when you only need server → client.

```javascript
// Server (Node.js)
app.get("/events", (req, res) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");

	const interval = setInterval(() => {
		res.write(`data: ${JSON.stringify({ price: getStockPrice() })}\n\n`);
	}, 1000);

	req.on("close", () => clearInterval(interval));
});

// Client (JavaScript)
const es = new EventSource("/events");
es.onmessage = (e) => {
	console.log(JSON.parse(e.data));
};
```

**SSE vs WebSockets:**

|                 | SSE                                    | WebSockets                       |
| --------------- | -------------------------------------- | -------------------------------- |
| Direction       | Server → Client only                   | Bidirectional                    |
| Protocol        | HTTP                                   | WebSocket (upgraded HTTP)        |
| Reconnection    | Automatic                              | Must implement                   |
| Browser support | All modern browsers                    | All modern browsers              |
| Load balancer   | Works with standard HTTP LB            | Needs sticky sessions or pub/sub |
| Use when        | News feed, notifications, live updates | Chat, gaming, collaborative      |

---

## Long Polling

**Before WebSockets:** The trick to simulate server push with regular HTTP.

```
Client → "Any new messages?"
Server holds the request open... (up to 30s)
  → New message arrives → Server responds immediately
  → Timeout reached     → Server responds with empty

Client immediately makes another request:
Client → "Any new messages?"
Server holds... → responds when message arrives or timeout
```

**Better than regular polling** (requests only return when there's data), but worse than WebSockets (still request-response, HTTP overhead per message).

**Still used by:** Some chat systems, webhooks with retry logic, systems where WebSocket infrastructure is unavailable.

---

## gRPC: The High-Performance Internal Messenger

gRPC (Google Remote Procedure Call) is a high-performance RPC framework using Protocol Buffers for serialization and HTTP/2 for transport.

**Think of it as calling a function on a remote server as if it were a local function call.**

**How gRPC works**

1. Define your service in a `.proto` file:

```protobuf
// service.proto
syntax = "proto3";

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (ListUsersRequest) returns (stream User);    // streaming!
  rpc CreateUser (stream CreateUserRequest) returns (User);  // client streaming
}

message GetUserRequest {
  int64 user_id = 1;
}

message User {
  int64 id = 1;
  string name = 2;
  string email = 3;
  google.protobuf.Timestamp created_at = 4;
}
```

2. Generate client/server code in any language (Python, Go, Java, Rust...):

```bash
protoc --python_out=. --grpc_python_out=. service.proto
```

3. Implement the server, call from client:

```python
# Client code — looks like a local function call
user = stub.GetUser(GetUserRequest(user_id=42))
print(user.name)  # Ritik
```

**gRPC vs REST comparison**

|                 | REST/JSON            | gRPC/Protobuf          |
| --------------- | -------------------- | ---------------------- |
| Protocol        | HTTP/1.1 or 2        | HTTP/2                 |
| Format          | JSON (text)          | Protobuf (binary)      |
| Size            | Larger (verbose)     | 3–10× smaller          |
| Speed           | Slower               | ~10× faster            |
| Schema          | Optional (OpenAPI)   | Required (.proto)      |
| Streaming       | Not native           | Built-in               |
| Browser support | Native               | Needs proxy (grpc-web) |
| Tooling         | Mature, widespread   | Strong in backend      |
| Best for        | External/public APIs | Internal microservices |

**gRPC streaming modes**

```
Unary:          Client sends one request, gets one response
Server stream:  Client sends one request, server streams many responses
Client stream:  Client streams many requests, server sends one response
Bidirectional:  Both sides stream simultaneously
```

**Bidirectional streaming example: Real-time audio transcription**

```
Client streams: audio chunks
Server streams: transcript updates
Both happening simultaneously
```

---

## Choosing the Right Protocol

```
Public API (browser/mobile clients)?
    → REST/HTTP — universal support, familiar, easy to debug

Internal microservice-to-microservice?
    → gRPC — faster, type-safe, streaming support

Real-time server → client updates (news, notifications, prices)?
    → Server-Sent Events — simple, works with HTTP

Real-time bidirectional (chat, gaming, collaborative)?
    → WebSockets — persistent connection, low latency

Need support across languages + existing HTTP infrastructure?
    → REST wins (pragmatic choice)

Need maximum performance + you control all clients?
    → gRPC wins
```

---

## Webhooks: The Reverse API

**Traditional API:** you call the server to check for updates.  
**Webhook:** the server calls you when something happens.

```
Traditional polling:
You → "Did the payment succeed?" (every 5 seconds)
Server: "No"... "No"... "No"... "Yes!"

Webhook:
You register: "POST https://your-server.com/webhook when payment completes"
Server: (when payment completes) → POST https://your-server.com/webhook { status: "success" }
```

**Design considerations:**

- Webhooks can fail (your server might be down)
- Implement retry with exponential backoff on the webhook sender side
- Make your webhook endpoint idempotent (deduplication ID)
- Always verify the webhook signature (HMAC-SHA256) to prevent spoofing

```python
import hmac, hashlib

def verify_webhook(payload, signature, secret):
    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)
```

---

## Flashcards

**Q: REST vs WebSocket vs gRPC — when to use each?**

> REST is my default for external APIs — universally supported, easy to debug, works everywhere. WebSockets for real-time bidirectional communication like chat or collaborative editing where the server needs to push data unprompted. gRPC for internal microservice communication where I need high throughput, type safety, and streaming — it's 10× faster than REST due to binary Protobuf serialization over HTTP/2.

**Q: How would you implement real-time notifications?**

> Server-Sent Events for one-way pushes (notifications, live feeds) — they're simple, work over HTTP, and reconnect automatically. WebSockets if users need to interact in real time (chat, collaborative features). For scale, I'd put Redis Pub/Sub behind the WebSocket servers so messages route correctly regardless of which server a client is connected to.

**Q: What is the difference between HTTP/1.1 and HTTP/2?**

> HTTP/2 adds multiplexing (multiple requests in parallel on one connection), header compression, and server push, eliminating the head-of-line blocking of HTTP/1.1.

**Q: When should you use WebSockets vs SSE?**

> WebSockets for bidirectional communication (chat, gaming). SSE for server-to-client only (notifications, live feeds, prices). SSE is simpler and auto-reconnects.

**Q: What makes gRPC faster than REST?**

> Binary Protobuf serialization (smaller payloads), HTTP/2 multiplexing (parallel requests), and generated typed code (no JSON parsing).

**Q: What is a webhook and what's the main reliability concern?**

> A webhook is a server calling your endpoint when an event occurs. Main concern: your endpoint might be down. Sender must implement retries with backoff. Your endpoint must be idempotent.

**Q: What HTTP status code means the resource was created successfully?**

> 201 Created.

**Q: What is head-of-line blocking in HTTP/1.1?**

> Requests are served in order on a connection. A slow request blocks all subsequent requests. HTTP/2 multiplexing eliminates this.
