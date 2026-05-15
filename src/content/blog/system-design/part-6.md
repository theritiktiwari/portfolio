---
title: "CAP Theorem & Consistency in Distributed Systems"
description: "Understand CAP theorem, consistency models, PACELC, Raft consensus, eventual consistency, conflict resolution, and distributed trade-offs with real-world examples."
pubDate: 2026-05-15T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-cap.avif
tags: ["system-design", "distributed-systems", "cap-theorem", "consistency", "scalability"]
featured: false
draft: false
series:
    name: "System Design"
    part: 6
---

## The Story: The City with Two Post Offices

Imagine your city has two post offices — one in the north, one in the south. Both maintain a list of registered addresses. Normally, they sync with each other every hour.

One day, the road between them floods. They can't communicate. Now:

- Do both post offices keep accepting new registrations (and risk diverging from each other)?
- Or does one refuse to accept changes until the road reopens?

This is the CAP dilemma. You must choose.

---

## CAP Theorem

**CAP Theorem (Brewer's Theorem, 2000):** In a distributed system experiencing a network partition, you can only guarantee either Consistency or Availability — not both.

| Letter | Property            | Meaning                                                                       |
| ------ | ------------------- | ----------------------------------------------------------------------------- |
| **C**  | Consistency         | Every read returns the most recent write (or an error)                        |
| **A**  | Availability        | Every request receives a response (not an error) — may not be the latest data |
| **P**  | Partition tolerance | System continues to operate when network partitions occur                     |

**The unavoidable reality:** Network partitions happen. In any distributed system (multiple machines), packets get dropped, routers fail, datacenters get isolated. P is not optional — you will have partitions. So the real choice is:

> **CP or AP?** During a partition, do you prioritize Consistency or Availability?

### CP — Consistency over Availability

During a partition: refuse requests that might return stale data.

```
[North DB] ← partition → [South DB]

Request to South: "What's the balance for user 42?"
South: "I'm not sure my data is current. I'm refusing this request."
→ Returns error to user
```

**Examples:** Banking systems, inventory management, leader elections  
**Tools:** HBase, Zookeeper, MongoDB (default config), PostgreSQL (with synchronous replication)

### AP — Availability over Consistency

During a partition: respond with possibly stale data.

```
[North DB] ← partition → [South DB]

Request to South: "What's the balance for user 42?"
South: "My last known value is 1500. Here you go."
→ Returns potentially stale data
```

**Examples:** Social media feeds, DNS, shopping carts, search indexes  
**Tools:** Cassandra, DynamoDB (default), CouchDB

### The false promise of "CA"

CA systems (consistent and available, no partition tolerance) only exist in single-node systems with no network. The moment you have multiple machines, you have a network, and partitions become possible. **CA is only theoretical** in distributed systems.

---

## The Spectrum of Consistency

CAP makes it sound binary. Reality is a spectrum. Between "always return the latest write" and "return whatever we have," there are many points.

### Strong Consistency (Linearizability)

Every read sees the most recent write. Period.

```
T=1: Write  X = 5  (to all nodes)
T=2: Read   X      → always returns 5 (from any node)
```

**Cost:** Higher latency (writes must propagate before acknowledged), reduced availability  
**Use:** Financial transactions, distributed locks, configuration management

---

### Sequential Consistency

Operations appear to execute in some sequential order consistent with program order — but not necessarily real-time. All processes see the same order of operations, but that order may lag real-time.

---

### Causal Consistency

If operation A causally depends on operation B, any process that sees A also sees B.

```
User posts: "I got the job!" (causally depends on seeing the rejection of competitor)
Replies referencing that post are causally dependent on it
→ A reader always sees the post before any replies to it
```

Weaker than strong consistency, but preserves cause-and-effect. Used by MongoDB sessions.

---

### Eventual Consistency

Given no new updates, all replicas will converge to the same value — eventually.

```
T=0:    Write X = 5 to Node A
T=0:    Node B still has X = 3 (hasn't received update yet)
T=50ms: Replication propagates
T=50ms: Node B now has X = 5

→ Consistent... eventually
```

**Cost:** Window of inconsistency. Applications must handle stale reads.  
**Use:** DNS, shopping carts, social media likes, search indexes, CDNs  
**Tools:** Cassandra, DynamoDB, CouchDB

---

### Read-Your-Writes Consistency

After you write, you always read your own write.

```
User updates profile photo
→ Immediately reads their own profile → sees new photo (guaranteed)
→ Another user reads the profile → may still see old photo (not guaranteed)
```

**Implementation:** after a write, route the same user's reads to the primary for a short window.

---

### Monotonic Reads

A client never reads older data after reading newer data.

```
Read 1 → X = 5
Read 2 → X must be ≥ 5 (never goes "backwards" to X = 3)
```

**Implementation:** always route a given user to the same replica.

---

## PACELC: The More Complete Model

CAP was clarified by PACELC (Daniel Abadi, 2012). It covers both partition and non-partition scenarios.

```
If Partition (P):
    Availability (A) vs Consistency (C)

Else (E — normal operation):
    Latency (L) vs Consistency (C)
```

The insight: **even without a partition, there's a trade-off between latency and consistency.** To be strongly consistent, you must wait for acknowledgment from multiple nodes — that takes time.

| System           | Partition behavior | Normal behavior  |
| ---------------- | ------------------ | ---------------- |
| Cassandra        | PA (available)     | EL (low latency) |
| DynamoDB         | PA (available)     | EL (low latency) |
| MongoDB          | PC (consistent)    | EC (consistent)  |
| Zookeeper        | PC (consistent)    | EC (consistent)  |
| MySQL/PostgreSQL | PC (consistent)    | EC (consistent)  |

**Interview insight:** When an interviewer asks about CAP, mention PACELC — it shows you understand the nuance that the trade-off exists even in normal operation, not just during failures.

---

## Conflict Resolution in Distributed Systems

When two nodes accept writes to the same data simultaneously (split-brain), you have a conflict.

### Last Write Wins (LWW)

The write with the highest timestamp wins.

```
Node A at T=100: X = "Alice"
Node B at T=101: X = "Bob"

→ LWW picks X = "Bob"
```

**Pro:** Simple, always resolves  
**Con:** Loses data ("Alice" is silently discarded). Clock skew can cause wrong winner.

---

### Multi-Version Concurrency Control (MVCC)

Keep multiple versions. Let the application or user decide which is correct.

```
Version A (from Node A): { name: "Alice", timestamp: T=100 }
Version B (from Node B): { name: "Bob", timestamp: T=101 }

→ Return both. Application merges or user chooses.
```

Used by CouchDB, Riak.

---

### CRDTs (Conflict-free Replicated Data Types)

Mathematically designed data structures that always merge consistently — no conflicts possible.

**Examples:**

- **G-Counter (grow-only counter):** increment count on any node, merge by taking max per node
- **OR-Set (observed-remove set):** add/remove items, merge correctly even with concurrent operations
- **LWW-Register:** last-write-wins but proven safe

Used by: Riak, Redis (some types), collaborative editors (like Google Docs)

---

### Vector Clocks

Track causality — instead of wall-clock time, track which node has "seen" which writes.

```
Node A: { A:1, B:0, C:0 } → write X = "Alice"
Node B: { A:0, B:1, C:0 } → write X = "Bob"

→ Vectors are incomparable → concurrent writes → conflict detected
→ Application must resolve

Node A: { A:2, B:1, C:0 } → causally after Node B's write → not a conflict
```

Used by: DynamoDB, Riak, Amazon's internal services.

---

## Distributed Consensus: Getting Nodes to Agree

When you need strong consistency, nodes must **agree** on a value. This is the distributed consensus problem.

**Why it's hard**

In an asynchronous network with possible failures, getting all nodes to agree on the same value is provably hard (FLP impossibility theorem — 1985). Practical systems make trade-offs.

---

### Raft Consensus Algorithm

The most approachable consensus algorithm. Used by etcd, CockroachDB, TiKV.

**Three roles:**

- **Leader:** Handles all writes. One at a time.
- **Follower:** Accepts writes replicated from leader.
- **Candidate:** Campaigning to become the next leader.

**Leader election:**

```
1. All nodes start as Followers
2. Followers start election timer (randomized: 150–300ms)
3. First to timeout → becomes Candidate → requests votes from peers
4. Candidate with majority votes → becomes Leader
5. Leader sends heartbeats to prevent new elections
```

**Log replication:**

```
1. Client sends write to Leader
2. Leader appends to its log
3. Leader replicates to Followers
4. Once majority ACK → Leader commits → replies to client
5. Followers commit on next heartbeat
```

**Safety:** A write is committed only when majority of nodes have it. Majority node failure = system stops (no data loss, but unavailable). **This is the CP trade-off.**

---

### Paxos (the original)

Older, proven correct, but famously difficult to understand and implement. Raft was designed as "Paxos but understandable." In practice, most new systems use Raft.

**Two-phase process:**

1. **Prepare phase:** Leader asks "can I be the leader?" — gets promises from majority
2. **Accept phase:** Leader proposes a value — majority accepts

---

## Real-World Consistency Scenarios

### Banking: You need strong consistency

```
User balance: 1000

Simultaneous transactions:
  Thread 1: Withdraw 800 → check balance (1000 ≥ 800) → deduct → new balance: 200
  Thread 2: Withdraw 800 → check balance (1000 ≥ 800) → deduct → new balance: 200

Without isolation: both succeed → balance goes to -600 → bank loses money
With serializable isolation (strong consistency): Thread 2 fails → balance is 200
```

**Choice:** CP. Use PostgreSQL with SERIALIZABLE isolation.

---

### Social Media Likes: Eventual consistency is fine

```
Post has 1M likes.

User A adds a like.
User B immediately views the post → sees 999,999 likes (stale by 1)
50ms later → all replicas synced → User B refreshes → sees 1,000,001 likes

Is this acceptable? Yes — no one is harmed by seeing 1M vs 1,000,001 likes.
```

**Choice:** AP. Use Cassandra with eventual consistency.

---

### DNS: Eventual consistency by design

```
You update your website's IP address.
DNS change propagates across the internet over minutes to hours.
Some users see old IP, some see new IP — both are served (different versions of site).
Eventually: all users see new IP.
```

**Choice:** AP. TTL-based eventual consistency.

---

### Shopping Cart: Nuanced

During partition: allow adds to cart (AP — don't lose the sale).  
At checkout: strong consistency required (CP — don't oversell inventory).

```
Add to cart: Cassandra (AP)
Checkout/payment: PostgreSQL (CP)
```

---

## The Two Generals Problem

A classic illustration of why distributed consensus is hard.

**Story:** Two generals want to attack a city simultaneously. They must both attack at the same time or they'll both fail. They communicate by messenger through enemy territory — any message might be captured.

```
General A sends: "Attack at dawn?"
General B replies: "Agreed!"

But B can't be sure A got the reply. So B sends a confirmation.
But A can't be sure B got the confirmation. So A sends another confirmation...
```

**This repeats forever.** There is no protocol that gives both generals 100% certainty over an unreliable channel.

**In distributed systems:** This is why you can't have perfect exactly-once semantics over a network without accepting trade-offs. At-least-once + idempotency is the practical solution.

---

## Flashcards

**Q: Explain CAP theorem**

> CAP theorem states that a distributed system can only guarantee two of three properties: Consistency (every read returns the most recent write), Availability (every request gets a response), and Partition tolerance (system works despite network partitions). Since partitions happen in real distributed systems, the real choice is CP vs AP — do you prioritize returning correct data or always returning a response? I'd choose CP for financial systems where stale data causes real harm, and AP for social features, caches, and user-facing reads where eventual consistency is acceptable.

**Q: What is eventual consistency?**

> Given no new updates, all replicas will eventually converge to the same value. There's a window of time where different nodes may return different values. The key is making the application handle stale reads gracefully — and ensuring the system has a reconciliation mechanism. Systems like DynamoDB, Cassandra, and DNS all use eventual consistency at scale.

**Q: What are the three properties in CAP theorem?**

> Consistency (every read sees the most recent write), Availability (every request gets a response), Partition tolerance (system works during network partitions).

**Q: During a network partition, what is the real choice?**

> CP (return error if unsure about freshness) vs AP (return possibly stale data).

**Q: What is eventual consistency?**

> Given no new updates, all replicas converge to the same value eventually. There's a window of staleness.

**Q: What is PACELC?**

> Extension of CAP: during Partition choose A vs C; Else (normal) choose Latency vs Consistency.

**Q: What is a CRDT?**

> Conflict-free Replicated Data Type — data structure designed to always merge consistently across nodes without conflicts.

**Q: What is the Raft algorithm?**

> A distributed consensus algorithm. Nodes elect a leader; all writes go through the leader; committed once majority ACK. Used by etcd, CockroachDB.

**Q: What is read-your-writes consistency?**

> After a write, the same user's subsequent reads always see their own write. Implemented by routing reads to primary after a write.
