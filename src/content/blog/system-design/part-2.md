---
title: "Deep Dive into Databases"
description: "A complete guide to databases in system design — SQL vs NoSQL, indexing, replication, sharding, and how to choose the right database at scale."
pubDate: 2026-03-19T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-database.avif
tags: ["system-design", "database", "backend", "architecture"]
featured: false
draft: false
series:
    name: "System Design"
    part: 2
---

Databases are the **heart of any system**. If your application is a city, your database is the **vault** — where truth lives. In this chapter, we’ll learn how data is stored, scaled, and accessed in real-world systems.

---

## The Story: The City's Record-Keeping System

The city is growing. We need to store information permanently. Not on sticky notes (cache), not shouted across the street (in-memory). We need a **vault** — structured, durable, queryable.

Two types of record keepers exist:

| The Meticulous Archivist (SQL)      | The Flexible Warehouse Manager (NoSQL) |
| ----------------------------------- | -------------------------------------- |
| Every record follows a strict form. | Accepts anything.                      |
| Relationships are explicit.         | No strict rules.                       |
| Extremely reliable.                 | Blazing fast for the right use case.   |

---

## SQL: The Meticulous Archivist

A **relational database** stores data in **tables** with a **schema**, and uses **SQL** to query.

```
Users table:
| id  | name  | email             | created_at          |
| --- | ----- | ----------------- | ------------------- |
| 1   | Ritik | ritik@example.com | 2026-03-19 10:30:00 |
| 2   | Dummy | dummy@example.com | 2026-03-19 09:00:00 |

Orders table:
| id  | user_id | amount | status    |
| --- | ------- | ------ | --------- |
| 101 | 1       | 599.00 | delivered |
| 102 | 1       | 299.00 | shipped   |
| 103 | 2       | 999.00 | pending   |
```

`user_id` in Orders is a **foreign key** — links to `id` in Users. This is a **relationship**.

---

### ACID — The Four Guarantees

| Property        | What it means                                           | City analogy                                                  |
| --------------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| **Atomicity**   | All-or-nothing. Failure rolls everything back           | Transfer ₹1000; debit AND credit both happen, or neither does |
| **Consistency** | DB always moves from valid state to valid state         | You can never have an order without a valid user              |
| **Isolation**   | Concurrent transactions don't see each other mid-flight | Two people booking the last seat can't both succeed           |
| **Durability**  | Once committed, survives crashes                        | After "Payment confirmed," a power cut can't erase it         |

**Memory anchor:** ACID = the bank's promise to you.

---

### When to use SQL

- Financial data (transactions, ledgers)
- User accounts and authentication
- Any data with clear, stable relationships
- When correctness > raw speed

**Popular SQL databases:** PostgreSQL, MySQL, SQLite

---

## NoSQL: The Flexible Warehouse

### Document Stores — The Filing Cabinet

Stores JSON-like documents. Each document can have different fields.

```json
{
	"_id": "64a7f9e2b1c4d",
	"name": "Ritik Tiwari",
	"email": "ritik@example.com",
	"preferences": { "theme": "dark", "language": "en" },
	"addresses": [
		{ "type": "home", "city": "Auraiya" },
		{ "type": "work", "city": "Bangalore" }
	]
}
```

This would need 3 separate tables in SQL. Here it is only one document. Flexible schema allows for easy evolution.

**Use when:** User profiles, product catalogs, CMS

**Tools:** MongoDB, CouchDB

---

### Key-Value Stores — The Locker Room

Pure: a key maps to a value. Fastest possible lookups.

```
"session:user_42"     → { "logged_in": true, "cart": [...] }
"rate:ip:1.2.3.4"     → 47
"cache:product:1001"  → { "name": "Laptop", "price": 45999 }
```

**Use when:** Session storage, caching, rate limiting, feature flags

**Tools:** Redis, DynamoDB, Memcached

---

### Wide-Column Stores — The Spreadsheet That Scales to Billions

Each row can have completely different columns, runs across thousands of machines.

```
Row key: "user_42#2026-03-02"
Columns: { "page_view": "/home", "click": "buy_btn", "duration": 45 }

Row key: "user_42#2026-03-19"
Columns: { "page_view": "/product", "purchase": "SKU-001" }  // different columns!
```

**Use when:** Time-series data, IoT, analytics at massive scale

**Tools:** Apache Cassandra, HBase, Google Bigtable

---

### Graph Databases — The Web of Connections

Nodes (entities) + edges (relationships). Fast at traversing connections.

```
(Dummy) --> [FOLLOWS]      --> (Ritik)
(Ritik) --> [LIKES]        --> (Post #42)
(Dummy) --> [COMMENTED_ON] --> (Post #42)
```

**Use when:** Social networks, recommendation engines, fraud detection

**Tools:** Neo4j, Amazon Neptune

---

## SQL vs NoSQL Decision Framework

```
Strong relationships? Exact counts? Transactions?
       YES → SQL (PostgreSQL)
       NO
       ↓
High write throughput? Schema changes? Massive scale (PB+)?
       YES → NoSQL
       ↓
What data shape?
    JSON   →   MongoDB
    K-V    →   Redis
    Time   →   Cassandra
    Graph  →   Neo4j
```

| Factor         | SQL wins                | NoSQL wins          |
| -------------- | ----------------------- | ------------------- |
| Schema         | Known, stable           | Unknown, evolving   |
| Transactions   | Critical                | Not critical        |
| Query patterns | Complex joins           | Simple key lookups  |
| Scale          | Up to ~100M rows easily | Billions of records |
| Consistency    | Strong required         | Eventual acceptable |

**Interview rule:** Default to SQL. Upgrade to NoSQL with a specific justified reason.

---

## Indexing: The Library Card Catalogue

**Story:** 10 million books in a library. Find **"Game of Thrones"** by checking every shelf (full table scan) — or use the **card catalogue** (index). The index is a sorted lookup structure pointing to where the data lives.

### How an index works

```sql
-- Without index: scans ALL rows — O(n)
SELECT * FROM users WHERE email = 'ritik@example.com';

-- Create index
CREATE INDEX idx_users_email ON users(email);

-- Now uses B-tree binary search: O(log n) — microseconds
```

---

### Index trade-offs

| Operation            | Without index    | With index                     |
| -------------------- | ---------------- | ------------------------------ |
| SELECT (filter)      | Full scan — slow | B-tree lookup — fast           |
| INSERT/UPDATE/DELETE | Fast             | Slower (index must update too) |
| Disk space           | Less             | More                           |

**Rule:** Index columns in WHERE, JOIN ON, ORDER BY. Don't index every column.

---

### Composite indexes

```sql
-- Query: orders for user 1 that are 'delivered'
SELECT * FROM orders WHERE user_id = 1 AND status = 'delivered';

CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

**Left-prefix rule:** Index on (A, B, C) serves: A, A+B, A+B+C — but NOT B alone or C alone.

---

## Database Replication: Multiple Record Rooms

**Story:** One master vault. If it burns, everything is lost. Smart cities keep certified duplicates.

### Primary-Replica (Master-Slave) Replication

```
                               →   [Replica 1]   ← App reads
[App] writes → [Primary DB]    →   [Replica 2]   ← App reads
  (sync via WAL/binlog)        →   [Replica 3]   ← App reads
                               →   [Replica 4]   ← App reads
```

**How it works**

1. All writes go to the primary
2. Primary logs every change (WAL/binlog)
3. Replicas apply the same changes
4. Reads are distributed

**Benefits**

- Read scalability
- High availability
- Geo distribution

---

### The Replication Lag Problem

In a primary-replica setup, writes go to the primary, while reads are often served from replicas. **The catch?** Replicas are not updated instantly.

```
T=0:    User updates profile → write goes to Primary
T=0:    Primary confirms success
T=10ms: User reads → request hits Replica → sees OLD data
T=50ms: Replica catches up → now shows updated data
```

This delay is called **replication lag** — a short window where the system returns stale data.

**Why This Happens**

Replication is usually **asynchronous**:

- Primary writes data
- Changes are logged (WAL/binlog)
- Replicas pull and apply changes slightly later

> Trade-off: **better performance vs temporary inconsistency**

**Solutions**

- **Read-your-writes:** After a user writes, route their reads to the primary for a short time
- **Synchronous replication:** Primary waits for replicas before confirming (strong consistency, slower writes)
- **Monotonic reads:** Ensure a user always reads from the same replica to avoid inconsistent results

---

### Multi-Primary Replication

In this setup, multiple databases (primaries) can accept writes simultaneously — often used in multi-region systems.

```
User (India)  → writes → Primary (Asia)
User (US)     → writes → Primary (US)
User (EU)     → writes → Primary (EU)
```

This improves:

- Low latency (users write to nearest region)
- High availability (no single write bottleneck)

**The Problem: Write Conflicts**

If two users update the same data at the same time in different regions, conflicts occur.

```
T=0: User A (India) updates name → "Ritik"
T=0: User B (US) updates name → "Ricky"

Now both databases have different values ❌
```

**Conflict Resolution Strategies:**

- **Last Write Wins (LWW):** The latest timestamp overwrites others, it is simple but can lose data
- **Application-level merge:** Your application decides how to merge conflicts, it offers more control but adds complexity
- **CRDTs (Conflict-free Replicated Data Types):** Special data structures that automatically merge changes. Used in collaborative systems (e.g., docs, chats)

---

## Database Sharding: Splitting the Vault

As the system grows, a single vault (database) eventually becomes a bottleneck — not just in storage, but in how many requests it can handle. At some point, you can’t scale vertically anymore. We need to split the data across multiple databases — this is called **sharding**.

**How this works**

Horizontal partitioning across multiple DBs. Each shard stores only a subset of data, allowing **horizontal scaling**.

```
[All Users] → [Single DB] ❌ bottleneck

user_id % 4 → shard selection

Users 0,4,8... → Shard 0
Users 1,5,9... → Shard 1
Users 2,6,10... → Shard 2
Users 3,7,11... → Shard 3
```

---

### Sharding Strategies

**Range-based**

```
user_id 1–1,000,000           → Shard 1
user_id 1,000,001–2,000,000   → Shard 2
```

| Pros                                   | Cons                                  |
| -------------------------------------- | ------------------------------------- |
| Efficient range queries (Easy queries) | Uneven load distribution (hot shards) |

**Hash-based**

```
shard = hash(user_id) % N
```

| Pros                                   | Cons                                        |
| -------------------------------------- | ------------------------------------------- |
| Even data distribution (no hot shards) | Range queries become hard (complex queries) |
|                                        | Re-sharding is painful                      |

**Consistent hashing**
Used in large-scale distributed systems.

```
Data and nodes are placed on a ring
Only a small portion of data moves when nodes change
```

| Pros                  | Cons                 |
| --------------------- | -------------------- |
| Minimal data movement | Complex to implement |

---

### Sharding Challenges

| Problem                  | What it means                           | Solution                     |
| ------------------------ | --------------------------------------- | ---------------------------- |
| Cross-shard queries      | JOINs across shards are slow/impossible | Denormalize data             |
| Hot shards               | One shard gets most traffic             | Better shard key / hashing   |
| Resharding               | Adding shards requires moving data      | Plan ahead / consistent hash |
| Distributed transactions | ACID across shards is extremely hard    | Avoid / use saga pattern     |

**Important takeaway:**

Sharding is powerful — but expensive in complexity. **Use it only when absolutely necessary.** Before sharding, try:

```
Indexing → Caching → Read Replicas → Vertical Scaling → Denormalization
```

---

## Storage Types

| Type   | Analogy                | Use Case      |
| ------ | ---------------------- | ------------- |
| Block  | Raw disk               | Databases     |
| File   | Shared drive           | Media         |
| Object | Infinite cloud storage | Images/videos |

---

## Schema Design

Designing a good schema is one of the most important decisions in system design. A well-designed schema makes your system easier to scale, query, and maintain.

### Practical Rules

- **Always have a primary key:** Every row should be uniquely identifiable. Use `uuid` for distributed systems or `auto-increment` for simpler setups.

- **Use foreign keys (when possible):** They enforce data integrity at the database level.

    Example: You should never have an order without a valid user.

- **Add timestamps everywhere:** These help with debugging, analytics, and auditing.

```sql
  created_at, updated_at
```

- **Use soft deletes instead of hard deletes:** This prevents accidental data loss and allows recovery.

```sql
  deleted_at (NULL if not deleted)
```

- **Index your foreign keys:** Joins become significantly faster.

- **Use appropriate data types**
    - `VARCHAR(255)` for emails
    - Avoid `TEXT` unless necessary
    - Use `DECIMAL` for money to avoid floating-point issues

---

### Denormalization

In normalized databases, data is split across multiple tables to avoid duplication but sometimes we intentionally duplicate data to improve performance, then we need **denormalization**.

```sql
-- Normalized (This is clean and consistent — but requires joins)
SELECT t.content, u.name
FROM tweets t
JOIN users u ON t.user_id = u.id;

-- Denormalized (No JOIN needed → faster reads)
SELECT content, user_name
FROM tweets;
```

**Trade-offs**

| Normalized           | Denormalized            |
| -------------------- | ----------------------- |
| No data duplication  | Data duplication exists |
| Strong consistency   | Risk of stale data      |
| Slower reads (joins) | Faster reads            |
| Easier updates       | Harder to maintain      |

---

## Quick Comparison

| DB         | Type        | Best For        |
| ---------- | ----------- | --------------- |
| PostgreSQL | Relational  | General purpose |
| MongoDB    | Document    | Flexible data   |
| Redis      | Key-Value   | Cache/sessions  |
| Cassandra  | Wide-column | Massive scale   |

---

## Interview Cheat Sheet

**Step 1 — Ask**

- Schema type?
- Relationships?
- Read/write ratio?

**Step 2 — Default**

> Start with PostgreSQL

**Step 3 — Scale**

- Cache → Redis
- Big data → Cassandra
- Graph → Neo4j

---

## Quick Recap

- SQL = structure + consistency
- NoSQL = flexibility + scale
- Indexing = performance
- Replication = availability
- Sharding = scaling

---

## Flashcards

**Q: What does ACID stand for?**

> Atomicity, Consistency, Isolation, Durability

**Q: What is replication?**

> Copying data for scaling and availability

**Q: What is sharding?**

> Splitting data across DBs

**Q: What is indexing?**

> Faster data lookup

**Q: SQL vs NoSQL?**

> Structure vs flexibility
