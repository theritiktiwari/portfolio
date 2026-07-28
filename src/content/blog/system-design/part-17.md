---
title: "Requirements Gathering & System Design Fundamentals"
description: "Master the foundation of system design: requirements gathering, functional vs non-functional requirements, capacity estimation, system analysis, quality attributes, and a proven framework for system design interviews."
pubDate: 2026-07-28T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-sdlc.avif
tags: ["system-design", "requirements-engineering", "capacity-planning", "software-architecture"]
featured: false
draft: false
series:
    name: "System Design"
    part: 17
---

## The Story: Before You Lay a Single Brick

The best architects spend more time understanding the building's purpose than drawing blueprints. A hospital and a hotel have different structural requirements — even if they look similar from outside. Designing without understanding requirements is building the wrong thing perfectly.

This chapter formalises the thinking process: what are we building, why, for whom, and at what scale?

---

## Goals and Objectives of System Design

### The Three-Layer Goal Hierarchy

```
Business Goals (WHY)
  → "Increase user engagement by 30%"
  → "Process payments in 50+ countries"
  → "Reduce infrastructure cost by 40%"

Product Goals (WHAT)
  → "Users can share posts with followers"
  → "Support real-time notifications"
  → "Handle 1M concurrent users"

Technical Goals (HOW)
  → "p99 latency < 200ms"
  → "99.99% availability"
  → "Horizontal scalability"
  → "Data durability 11 nines (S3 equivalent)"
```

### System Design Quality Attributes

Before designing, agree on which attributes matter most for this specific system. You cannot optimise for all simultaneously.

| Attribute           | Definition                   | Measure                             |
| ------------------- | ---------------------------- | ----------------------------------- |
| **Performance**     | Speed of response            | Latency (p50/p99), throughput (RPS) |
| **Scalability**     | Handle growing load          | Can double traffic without redesign |
| **Availability**    | Uptime                       | 99.9%, 99.99%, 99.999%              |
| **Reliability**     | Correct results consistently | Error rate < 0.1%                   |
| **Durability**      | Data not lost                | RPO (data loss window), 11 nines    |
| **Consistency**     | All nodes see same data      | Strong/eventual/causal              |
| **Security**        | Protect from threats         | Auth, encryption, audit             |
| **Maintainability** | Easy to change               | MTTR, deployment frequency          |
| **Cost**            | Infrastructure spend         | $/RPS, $/GB stored                  |

---

## System Design Life Cycle (SDLC)

```
1. Requirements Gathering
   ↓
2. System Analysis
   ↓
3. High-Level Design (HLD) — component architecture
   ↓
4. Low-Level Design (LLD) — class/API design
   ↓
5. Implementation
   ↓
6. Testing
   ↓
7. Deployment
   ↓
8. Operations & Monitoring
   ↓ (feedback loop)
1. Requirements change → repeat
```

### Where Most Interview Failures Happen

Candidates jump from question to design in 30 seconds. Senior engineers know that the first 5 minutes of a 45-minute interview should be pure requirements and estimation.

**The reason:** A system that handles 100 RPS looks completely different from one handling 1M RPS. A system requiring strong consistency looks different from one where eventual consistency is acceptable. The design IS the requirements.

---

## Functional vs Non-Functional Requirements

### Functional Requirements — What the system does

These are the features. User-visible behaviors.

```
Design a ride-sharing app:

Functional Requirements:
  ✓ Rider can request a ride from location A to location B
  ✓ Driver can accept/decline ride requests
  ✓ Real-time location tracking during ride
  ✓ Fare calculation at trip end
  ✓ Payment processing
  ✓ Rating system (driver rates rider, rider rates driver)
  ✓ Ride history for both riders and drivers
  ✓ Surge pricing during high demand
```

### Non-Functional Requirements — How well the system does it

These are the quality attributes.

```
Non-Functional Requirements:
  Availability: 99.99% (only ~52 minutes downtime/year)
  Latency:      Driver match < 1 second
                Map rendering < 100ms
  Scale:        5M concurrent riders during peak
                1M active drivers at peak
  Consistency:  Payment → strong consistency
                Location tracking → eventual (slight lag acceptable)
  Durability:   Trip records → never lost (legal/billing requirement)
  Security:     PCI-DSS compliance for payments
                Personal data encryption (GDPR/PDPA)
```

### Implicit Non-Functional Requirements

Every system has these — even if not stated:

- **Fault tolerance:** System degrades gracefully, doesn't fail catastrophically
- **Observability:** Logs, metrics, traces (you can't operate what you can't see)
- **Security baseline:** No injection vulnerabilities, encrypted in transit (HTTPS)
- **Data retention:** How long to keep data? Delete after how long?

---

## Requirements Gathering Process

### The 5 Questions to Ask in Every Interview

When given a design problem, ask these before touching the whiteboard:

```
1. "Who are the users and what are their primary use cases?"
   → Defines your API surface and data model

2. "What's the expected scale?"
   → DAU, reads/second, writes/second, data volume
   → Determines everything about your architecture

3. "What are the latency requirements?"
   → p99 < 200ms? Real-time? Batch acceptable?

4. "What consistency model is required?"
   → Is eventual consistency acceptable? Strong needed for payments?

5. "What are the availability requirements?"
   → 99.9%, 99.99%, 99.999%? Each 9 costs 10× more.
```

### The Requirements Template (use in every design)

```
System: [name]

Users:
  Primary: [who uses it, estimated count]
  Secondary: [admin users, API consumers]

Functional Requirements (must-have):
  1. [core feature 1]
  2. [core feature 2]
  3. [core feature 3]

Out of Scope (explicitly NOT required):
  - [feature A] — simplifies design significantly
  - [feature B]

Non-Functional Requirements:
  Traffic:      [N] DAU, [N] RPS peak, [N:1] read:write ratio
  Storage:      [N] TB/year growth rate
  Latency:      p99 < [N]ms for [critical path]
  Availability: [N nines]
  Consistency:  [strong/eventual] for [which data]
  Geo:          [single region / multi-region / global]
```

---

## System Analysis vs System Design

These two phases are often confused.

### System Analysis — Understanding the Problem

```
Questions to answer:
  - What is the current system's bottleneck?
  - Where does traffic come from?
  - What data flows through the system?
  - What are the access patterns? (read-heavy? write-heavy?)
  - What are the failure modes?
  - What are the cost constraints?
  - What are the team's capabilities?

Output:
  - Problem statement (clear, specific)
  - Constraints documented
  - Trade-offs identified
  - Risks listed
```

### System Design — Defining the Solution

```
Questions to answer:
  - Which components are needed?
  - How do they communicate?
  - Where does data live?
  - How does the system scale?
  - How does it fail safely?

Output:
  - Architecture diagram
  - API contracts
  - Data models
  - Deployment topology
  - Technology choices with justification
```

**Key distinction:** System Analysis is about understanding the current state and defining the problem. System Design is defining the future state and the solution.

---

## The 8-Step Interview Framework (Expanded)

This is the complete framework for any system design interview:

### Step 1: Clarify Requirements (3–5 min)

Ask the 5 questions above. Write down constraints explicitly.

> Let me clarify before I design. Who are the primary users? What's the expected scale — daily active users and request rates? Any specific latency SLAs? Consistency requirements?

### Step 2: Back-of-Envelope Estimation (3–5 min)

Calculate traffic, storage, bandwidth. Makes your architecture choices defensible.

> Assuming 10M DAU with 100 requests/user/day = 1B requests/day ≈ 11,500 RPS average, peak ~3× = 35,000 RPS.

### Step 3: Define the API (3–5 min)

List the 3–5 core APIs. Request + response shapes. This forces you to think about the interface before the implementation.

```
POST /rides             → creates ride request
GET  /rides/{id}        → gets ride status
PUT  /rides/{id}/accept → driver accepts ride
```

### Step 4: High-Level Design (10 min)

Draw the main components. Start simple (monolith if appropriate), then evolve. Don't draw 20 components immediately.

```
[Users] → [API Gateway] → [Ride Service]     → [DB]
                        → [Location Service] → [Redis]
                        → [Matching Service] → [Queue]
```

### Step 5: Data Model (5 min)

Define the core tables/schemas.

```
rides: { id, rider_id, driver_id, status, pickup, dropoff, fare, created_at }
drivers: { id, user_id, location, status, rating }
```

### Step 6: Deep Dive — Critical Components (10 min)

Pick the hardest 1–2 components and go deep. The interviewer usually guides this.

> Let me go deep on the matching algorithm and real-time location tracking — those are the most interesting scalability challenges here.

### Step 7: Identify and Resolve Bottlenecks (5 min)

For every component: what happens at 10× load? Where does it break?

- Single DB → add read replicas, then shard
- Single matching service → partition by geography
- Location updates → Kafka + Redis, not direct DB writes

### Step 8: Summarise Trade-offs (2 min)

Explicitly state what you optimised for and what you sacrificed.

> This design prioritises availability and low latency for driver matching. We use eventual consistency for location updates — drivers' positions may be up to 4 seconds stale, which is acceptable for matching but not for turn-by-turn navigation. For payment processing, we use strong consistency with PostgreSQL.

---

## Capacity Estimation Reference Card

### Memory cheatsheet

```
1 char               = 1 byte
1 int                = 4 bytes
1 long               = 8 bytes
1 float              = 4 bytes
UUID                 = 16 bytes
URL                  = ~100 bytes average
Tweet                = ~280 bytes text content
User profile         = ~500 bytes average
Photo metadata       = ~1KB
Photo (compressed)   = ~200KB–3MB
Video (1080p, 1 min) = ~100MB
```

### Time cheatsheet

```
1 day   = 86,400 seconds      ≈ 10^5 seconds
1 month ≈ 2.5 million seconds ≈ 2.5 × 10^6
1 year  ≈ 31 million seconds  ≈ 3.15 × 10^7

Traffic rule: peak ≈ 2–3× average
80/20 rule: 20% of users generate 80% of traffic
```

### Scale conversions

```
Million  = 10^6   (1M)
Billion  = 10^9   (1B)
Trillion = 10^12  (1T)

1 million writes/day ÷ 86,400 = ~12 writes/second
1 billion reads/day ÷ 86,400  = ~11,574 reads/second ≈ 12K RPS
```

---

## The first 5 minutes of every design interview

```
"Before I start designing, let me clarify a few things:

1. Who are the users and what's the core use case?
2. What scale are we designing for? DAU? Peak RPS?
3. Any specific latency requirements?
4. Strong or eventual consistency? Which features need strong?
5. Single region or global?

[Wait for answers, write them down visibly]

Now let me estimate: [back-of-envelope calculation]

With these requirements, here's the approach I'd take..."
```

---

## Flashcards

**Q: What is the difference between functional and non-functional requirements?**

> Functional = what the system does (features). Non-functional = how well it does it (latency, availability, scale, consistency).

**Q: What are the 5 questions to ask at the start of every design interview?**

> (1) Who are the users and use cases? (2) What's the expected scale? (3) Latency requirements? (4) Consistency model? (5) Availability requirement?

**Q: What is the difference between system analysis and system design?**

> Analysis = understand the problem (current state, constraints). Design = define the solution (components, data model, architecture).

**Q: What does RPO stand for and what does it measure?**

> Recovery Point Objective — the maximum acceptable amount of data loss measured in time. RPO = 1 hour means you can lose up to 1 hour of data.

**Q: What is the 80/20 rule in capacity planning?**

> 20% of users generate 80% of traffic. Cache the top 20% of data to handle 80% of reads.

**Q: What should you draw first in a system design interview?**

> After requirements and estimation, start with the simplest possible architecture (2–3 components). Evolve it. Don't start with 15 components.
