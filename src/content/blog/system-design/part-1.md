---
title: "The Big Picture of System Design"
description: "A beginner-friendly introduction to system design — covering core concepts, scaling, architecture, and the mental models you need to think like a system designer."
pubDate: 2026-03-02T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design.avif
tags: ["system-design", "backend", "architecture"]
featured: true
draft: false
series:
    name: "System Design"
    part: 1
---

System design is one of those skills that separates good engineers from great ones. You can write clean code — but can your system handle **10 users? 10,000 users? 10 million users?** This series is about building that intuition from scratch.

---

## The One Analogy That Rules Them All

> **Your application is a city.**

If you understand this analogy, system design becomes much easier to reason about. This mental model will stay with you across every system you design.

| System Design Concept | City Analogy                       | Memory Anchor                          |
| --------------------- | ---------------------------------- | -------------------------------------- |
| Single server         | A house                            | One person doing everything            |
| Load balancer         | Traffic cop at the city gate       | Distributes cars across roads          |
| Application servers   | Office buildings                   | Where the actual work happens          |
| Database              | The city vault / records room      | Permanent, authoritative storage       |
| Cache                 | Sticky note on your desk           | Fast, temporary, nearby                |
| CDN                   | Local shops in every neighbourhood | Content near where users live          |
| Message queue         | The city post office               | Drop work, processed later             |
| DNS                   | City address directory             | Names → IP addresses                   |
| API Gateway           | City reception desk                | One entry point, routes to departments |

---

## What is System Design?

System design is:

> **Designing the architecture, components, and data flow of a system to meet requirements at scale.**

Think of the evolution:

- Junior dev → **_“Does this code work?”_**
- Mid-level dev → **_“Does this work reliably?”_**
- Senior dev → **_“Will this work at scale?”_**
- System designer → **_“How do we build this so it doesn’t break under real-world conditions?”_**

---

## How Real Systems Evolve

No system starts “distributed.” Everything begins simple — and grows.

```
Stage 1: [User] → [Server + DB]
Stage 2: [User] → [App Server] → [DB]
Stage 3: [User] → [App Server] → [Cache] → [DB]
Stage 4: [User] → [LB] → [Multiple App Servers] → [Cache] → [DB]
Stage 5: [CDN] handles static content
Stage 6: [Queue + Workers] handle async tasks
Stage 7: [DB Replication] for scaling reads
```

**Rule:**  
👉 Only add complexity when a bottleneck forces you to.

---

## Core Qualities You Design For

Every system design decision optimizes for one (or more) of these:

| Quality         | Meaning                      | City Analogy                               |
| --------------- | ---------------------------- | ------------------------------------------ |
| Scalability     | Handle increasing load       | City can grow — add buildings and roads    |
| Availability    | System is up and serving     | City hall never closes                     |
| Reliability     | Correct results consistently | Records are always accurate                |
| Latency         | Time for one request         | How fast your food arrives                 |
| Throughput      | Requests per second          | How many orders the kitchen handles/hour   |
| Consistency     | All users see the same data  | Everyone reading the same city map version |
| Fault tolerance | Works when components fail   | City functions despite one grid going down |

---

## Latency Numbers You Should Know

These help you reason about bottlenecks:

| Operation               | Latency |
| ----------------------- | ------- |
| L1 cache                | ~0.5 ns |
| RAM (Main memory)       | ~100 ns |
| SSD                     | ~100 µs |
| Network (same DC)       | ~0.5 ms |
| HDD                     | ~10 ms  |
| Cross-continent network | ~150 ms |

👉 Key insight:  
**Network calls are expensive. Disk is slow. Memory is fast. Cache is king.**

---

## Horizontal vs Vertical Scaling

| Vertical Scaling (Scale Up)       | Horizontal Scaling (Scale Out)  |
| --------------------------------- | ------------------------------- |
| Increase machine power (CPU, RAM) | Add more machines               |
| Simple to implement               | Requires stateless architecture |
| Has a limit                       | Highly scalable                 |
| Single point of failure           | No single point of failure      |

**Example:**

```
Vertical:   [2 CPU, 4GB] → [32 CPU, 128GB]       ← one machine gets bigger
Horizontal: [Server] → [Server][Server][Server]  ← more machines added
```

👉 Modern systems prefer **horizontal scaling**.

---

## Stateful vs Stateless Systems

| Stateful Systems          | Stateless Systems                 |
| ------------------------- | --------------------------------- |
| Server stores session     | No session stored on server       |
| User must hit same server | Any server can handle any request |
| Breaks scalability        | Enables scaling                   |

👉 Any server can handle any request → enables scaling.

---

## The RESHADED Framework (For Interviews)

Use this to structure any system design answer:

| Letter | Stands for        | What to address             |
| ------ | ----------------- | --------------------------- |
| R      | Requirements      | Functional + non-functional |
| E      | Estimation        | Traffic, storage, bandwidth |
| S      | Storage           | SQL vs NoSQL, schema        |
| H      | High-level design | Components + connections    |
| A      | APIs              | Key endpoints               |
| D      | Deep dives        | Bottlenecks, scaling        |
| E      | Edge cases        | Failure modes               |
| D      | Done              | Summarise trade-offs        |

This alone can **level up the interview performance massively**.

---

## Quick Recap

- System design is about **scale, reliability, and architecture**
- Start simple → evolve gradually
- Think in terms of **components, not code**
- Prefer **stateless systems** for scalability
- Understand trade-offs — there’s no perfect system

---

## Flashcards

**Q: What are the core system qualities?**

> Scalability, Availability, Reliability, Latency, Throughput, Consistency, Fault tolerance

**Q: Vertical vs Horizontal scaling?**

> Vertical = bigger machine  
> Horizontal = more machines

**Q: What makes a system stateless?**

> No session stored on server

**Q: Why is caching important?**

> Because memory is orders of magnitude faster than disk/network
