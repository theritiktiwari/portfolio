---
title: "Monolith vs Microservices — Architecture Trade-offs at Scale"
description: "Understand monoliths, modular monoliths, and microservices. Learn service discovery, API gateways, distributed tracing, BFF, Strangler Fig migration, and how to choose the right architecture for scale."
pubDate: 2026-06-01T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-monolith-microservices.avif
tags: ["system-design", "microservices", "monolith", "api-gateway", "scalability"]
featured: false
draft: false
series:
    name: "System Design"
    part: 8
---

## The Story: The City Hall vs Specialised Departments

**Monolith:** City Hall. One building. Every department like tax office, licensing, permits, courts are all under one roof. One building code, one management, one key. Convenient. Fast internal communication. Efficient. But: if the building catches fire, everything stops. If the plumbing needs upgrading, the whole building is affected.

**Microservices:** Specialised departments scattered across the city. Tax office in one district. Licensing in another. Courts in the civic center. Each runs independently. One can renovate without shutting the others down. But: they need messengers (APIs) to talk. Coordination is complex. More buildings to maintain.

Neither is always better. **The architecture should match the team's maturity and the product's complexity.**

---

## The Monolith

A single deployable unit containing all application logic and data are called a monolith. All components are tightly coupled and run in the same process.

```
┌────────────────────────────────────────────────────────────────────┐
│                                Monolith                            │
│                                                                    │
│  [User Auth]     [Product Catalog]     [Orders]     [Payments]     │
│   [Reviews]          [Search]          [Email]      [Analytics]    │
│                                                                    │
│                             Single database                        │
│                             Single codebase                        │
│                         Deploy everything together                 │
└────────────────────────────────────────────────────────────────────┘
```

### Types of monoliths

#### Modular Monolith

Still one deployable unit, but internally structured with clear module boundaries. Each module has its own domain logic and can only communicate with others through defined interfaces. The best of both worlds for many teams.

```
┌─────────────────────────────────────────┐
│            Modular Monolith             │
│       ┌──────────┐   ┌──────────┐       │
│       │  Orders  │ → │ Payments │       │
│       │  Module  │   │  Module  │       │
│       └──────────┘   └──────────┘       │
│      (communicate via interfaces)       │
└─────────────────────────────────────────┘
```

#### Distributed Monolith

The worst architecture. Multiple services, but so tightly coupled they must be deployed together. All the complexity of microservices, none of the benefits.

### Pros and Cons

| Pros                                   | Cons                                                             |
| -------------------------------------- | ---------------------------------------------------------------- |
| Simple to develop and debug            | Harder to scale individual components                            |
| No network overhead for internal calls | Long deployment pipelines (deploy everything to change anything) |
| Easy transactions (same DB)            | Technology lock-in (one language, one framework)                 |
| Simple deployment (one artifact)       | Teams step on each other at scale (merge conflicts, coupling)    |
| Easy to refactor (same codebase)       | Single point of failure risk                                     |
| **Fastest for early-stage**            | Risky deployments (change X, accidentally break Y)               |

---

## Microservices

Independently deployable services, each owning its domain and its data.

```
┌────────────┐       ┌──────────────┐       ┌────────────┐
│   User     │       │    Product   │       │   Order    │
│  Service   │       │    Service   │       │  Service   │
│ DB: users  │       │ DB: products │       │ DB: orders │
└────────────┘       └──────────────┘       └────────────┘
      ↕ (API calls)         ↕ (events)           ↕ (events)
┌────────────┐       ┌─────────────┐       ┌─────────────┐
│  Payment   │       │   Search    │       │    Email    │
│  Service   │       │   Service   │       │   Service   │
│ DB: pymts  │       │ DB: elastic │       │ (stateless) │
└────────────┘       └─────────────┘       └─────────────┘
```

**The critical rule:** Each microservice owns its own database. **Never share a database between microservices.** This is what makes them independently deployable.

### Pros and Cons

| Pros                                                             | Cons                                                           |
| ---------------------------------------------------------------- | -------------------------------------------------------------- |
| Independent deployments (deploy payment without touching search) | Network overhead on every inter-service call                   |
| Independent scaling (scale only the Order service)               | Distributed systems complexity (partial failures, consistency) |
| Technology freedom (Python for ML, Go for high-throughput)       | Harder to debug (trace spans 8 services)                       |
| Team autonomy (team owns their service end-to-end)               | No ACID across services (must use Saga pattern)                |
| Isolated failures                                                | Service discovery and networking overhead                      |
| Smaller codebases per service                                    | Operational overhead (many deployments, many databases)        |

---

## How to Decide

### The Conway's Law insight

> Organizations which design systems are constrained to produce designs which are copies of the communication structures of those organizations. — Melvin Conway (1967)

Your architecture mirrors your team structure. Before choosing microservices, look at your team:

| Team situation                                               | Recommended architecture                        |
| ------------------------------------------------------------ | ----------------------------------------------- |
| 1–3 developers                                               | Monolith                                        |
| 4–10 developers                                              | Modular monolith                                |
| Multiple teams working in the same codebase causing friction | Consider extracting services                    |
| Teams stepping on each other at release time                 | Microservices                                   |
| Scale is your bottleneck, not team coordination              | Monolith with vertical/horizontal scaling first |
| Different parts need different technology stacks             | Microservices                                   |

### The maturity ladder

```
Stage 1: Monolith
   ↓ (when: teams fighting over codebase, specific scale needs)
Stage 2: Modular Monolith (with clean internal APIs)
   ↓ (when: a specific module needs independent scaling or team)
Stage 3: Extract one or two services that are clearly bounded
   ↓ (when: proven value and team has distributed systems expertise)
Stage 4: Microservices (where justified)
```

**The common mistake:** Going from stage 1 to stage 4 immediately. Startup with 2 engineers building 15 microservices. "Premature microservices" — all the operational complexity, none of the scale benefits.

---

## Communication Between Microservices

### Synchronous (Request-Response)

```
[Order Service] ──> HTTP/gRPC ──> [Payment Service]
                                ← response (success/fail)
```

**When to use:** When you need the result immediately to serve the user.  
**Risk:** Payment service down → Order service returns error. Tight coupling.

### Asynchronous (Event-Driven)

```
[Order Service] ──> "order_placed" event ──> [Message Queue]
                                                    ↓
                                             [Payment Service] (processes when ready)
                                             [Email Service]   (sends confirmation)
                                             [Inventory]       (decrements stock)
```

**When to use:** When downstream services can process independently.  
**Benefit:** Order service doesn't care if payment service is temporarily slow.

### gRPC vs REST for inter-service communication

|                 | REST (HTTP/JSON)              | gRPC (HTTP/2 + Protobuf)            |
| --------------- | ----------------------------- | ----------------------------------- |
| Format          | JSON (human-readable)         | Binary Protobuf (compact, fast)     |
| Speed           | Slower (JSON parsing)         | ~10× faster                         |
| Typing          | Loose                         | Strict (schema enforced)            |
| Streaming       | Not native                    | Built-in bidirectional streaming    |
| Browser support | Native                        | Needs proxy (grpc-web)              |
| Best for        | External APIs, browser-facing | Internal microservice communication |

---

## Service Discovery

**Problem:** You have 50 microservices. Service A needs to call Service B. Where is Service B? Its IP address changes when it scales up/down or restarts.

```
Without service discovery:
Service A → hard-coded "10.0.0.5:8080" → service B
If Service B restarts with new IP → Service A is broken
```

### Client-side discovery

Services register themselves in a registry. Callers look up the registry.

```
Service B startup → registers "payment-service" → [Service Registry] (e.g., Consul, Eureka)
Service A wants to call B:
  1. Query registry: "where is payment-service?"
  2. Registry returns: ["10.0.1.5:8080", "10.0.1.6:8080"]
  3. Service A load-balances and calls one
```

### Server-side discovery (more common today)

Services call a fixed endpoint. The infrastructure routes to the right place.

```
Service A → calls "http://payment-service" (fixed hostname)
→ Kubernetes DNS resolves to the right pod
→ kube-proxy load-balances across healthy pods
```

Kubernetes handles this automatically. You just call `http://payment-service:8080` and it works.

---

## API Gateway in Microservices

Without an API gateway, clients must know about all services:

```
Mobile app → /users    → User Service
Mobile app → /orders   → Order Service
Mobile app → /products → Product Service
```

With an API gateway:

```
Mobile app → [API Gateway]
                   ↓ (routes to)
             /users    → User Service
             /orders   → Order Service
             /products → Product Service
```

**API Gateway responsibilities:**

- **Routing:** Forward requests to correct service
- **Authentication:** Verify JWT/OAuth before requests reach services
- **Rate limiting:** Per-client throttling
- **SSL termination:** Handle HTTPS, forward HTTP internally
- **Request/response transformation:** Adapt between API versions
- **Aggregation:** Combine responses from multiple services (BFF pattern)

**Tools:** Kong, AWS API Gateway, Nginx, Traefik, Envoy

### Backend For Frontend (BFF) Pattern

Different clients have different data needs.

```
Mobile app → [Mobile BFF] → calls multiple microservices → tailored response
Web app    → [Web BFF]    → calls multiple microservices → tailored response
3rd party  → [Public API] → calls microservices          → standardised response
```

Each BFF aggregates and adapts the response for its specific client — avoiding over-fetching (getting too much data) or under-fetching (multiple round trips).

---

## Distributed Tracing

**Problem:** A request fails. It touched 8 services. Where did it fail?

```
Without tracing:
[User] → [API Gateway] → [Order Service] → [Payment] → [Fraud] → [Notification]
                                           ⚠️ Error!
→ You check 6 different log files, each with different timestamps and formats
```

**With distributed tracing:**

Every request gets a **trace ID**. Each service logs with that trace ID. You view the complete trace in one place.

```
Trace ID: abc-123
  Span 1: API Gateway    100ms total
  Span 2: Order Service  80ms
  Span 3: Payment Svc    60ms  ← ⚠️ ERROR HERE, 60ms before timeout
  Span 4: Fraud Svc      40ms
```

**Tools:** Jaeger, Zipkin, AWS X-Ray, Datadog APM

**Implementation:** Pass a `X-Trace-ID` header through every service. Structured logging includes the trace ID.

```python
# Middleware in every service
def trace_middleware(request, next_handler):
    trace_id = request.headers.get('X-Trace-ID') or generate_trace_id()
    with logger.bind(trace_id=trace_id, service="order-service"):
        request.headers['X-Trace-ID'] = trace_id  # forward to downstream
        return next_handler(request)
```

---

## The Strangler Fig Pattern: Migrating Monolith → Microservices

**Don't rewrite everything at once.** The big-bang rewrite is one of the most common causes of project failure.

**The Strangler Fig:** A vine that grows around a tree, slowly replacing it. The tree is still alive and functioning while the vine grows around it.

```
Phase 1: Monolith handles everything
[Client] → [Monolith]

Phase 2: Extract one service, proxy in front
[Client] → [Proxy/API Gateway]
            ↓                ↓
    [User Service]       [Monolith]
        (new)         (everything else)

Phase 3: Extract another service
[Client]    →       [API Gateway]
              ↓           ↓            ↓
         [User Svc]  [Order Svc]  [Monolith]

Phase N: Monolith is gone
[Client]    →         [API Gateway]
              ↓        ↓        ↓        ↓
           [Svc A]  [Svc B]  [Svc C]  [Svc D]
```

**Rules for successful migration:**

1. Extract one service at a time
2. Start with the most independently bounded domain
3. Keep the monolith working throughout
4. Run the new service and monolith in parallel initially (feature flags)
5. Only cut over when the new service is proven

---

## Flashcards

**Q: Monolith or microservices for this system?**

> **Default answer:**
> I'd start with a modular monolith. It gives us fast development velocity, simple deployment, and easy debugging. The modules are clearly separated internally, so if we need to extract a service later (perhaps the ML recommendation engine or the payment flow), we can do so with the strangler fig pattern without a full rewrite.
>
> **When to say microservices:**
> If the design problem specifies different scaling needs for different components, or if it explicitly mentions a large organisation with multiple teams, I'd decompose based on domain boundaries following domain-driven design.

**Q: How do microservices communicate?**

> Synchronously via HTTP REST or gRPC for operations where the caller needs an immediate response. Asynchronously via a message broker (Kafka/RabbitMQ) for events where downstream services process independently. My default is async/event-driven because it decouples services and prevents cascading failures.

**Q: What is the key rule of microservices data ownership?**

> Each microservice owns its own database. Never share a database between services.

**Q: What is Conway's Law?**

> Organizations build systems that mirror their communication structures. Team structure drives architecture.

**Q: What is the Strangler Fig pattern?**

> Migrating from monolith to microservices by extracting one service at a time, proxying in front, keeping monolith functional throughout.

**Q: What does an API Gateway do?**

> Routing, authentication, rate limiting, SSL termination, request transformation. Single entry point for all clients.

**Q: What is the BFF pattern?**

> Backend For Frontend — separate gateway/aggregation layer per client type (mobile, web, 3rd party) to serve tailored responses.

**Q: What is distributed tracing?**

> Attaching a trace ID to every request that flows through all services, enabling you to see the full call chain and locate failures/latency.

**Q: What is a distributed monolith?**

> Multiple services that are so tightly coupled they must be deployed together. Worst of both worlds.
