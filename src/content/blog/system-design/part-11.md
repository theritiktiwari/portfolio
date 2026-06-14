---
title: "Scaling Systems: Performance, Bottlenecks & Capacity Planning"
description: "Learn how systems scale from 1K to 10M users, identify bottlenecks, optimize databases, use connection pooling, read replicas, async I/O, and perform capacity planning for large-scale applications."
pubDate: 2026-06-14T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-scaling.avif
tags:
    ["system-design", "scalability", "performance", "database", "capacity-planning", "optimization"]
featured: false
draft: false
series:
    name: "System Design"
    part: 11
---

## The Story: How a City Grows

A village of 100 becomes a town of 10,000, then a city of 1M. Each stage of growth forces infrastructure changes:

- Village: one well for water (vertical)
- Town: municipal water system (shared infrastructure)
- City: water towers in every district (distributed)

Your system follows the same growth curve. **The architecture that works at 1K users breaks at 100K. What works at 100K breaks at 10M.** The skill is knowing which bottleneck to fix at each stage.

---

## Identifying Bottlenecks

**Bottleneck:** The single constraint that limits overall system throughput. Fix everything else — it doesn't matter. Fix the bottleneck — everything improves.

**The Four Classic Bottlenecks**

```
[Network] → [App Server: CPU/Memory] → [Database: I/O/Locks] → [Disk]
```

**How to find yours:**

```bash
# CPU bottleneck
top                              # CPU > 90% consistently
vmstat 1 10                      # us (user), sy (system) columns

# Memory bottleneck
free -h                          # check available memory
vmstat 1                         # si/so (swap in/out) — swap usage = memory problem

# I/O bottleneck
iostat -x 1 10                   # %util column → disk saturation
iotop                            # which processes are I/O heavy

# Network bottleneck
nethogs                          # per-process network usage
ss -s                            # socket statistics
netstat -i                       # interface stats

# Database bottleneck
SHOW PROCESSLIST;                # MySQL — what queries are running
SELECT * FROM pg_stat_activity;  # PostgreSQL
EXPLAIN ANALYZE SELECT ...;      # query plan + actual timing
```

---

## The Scalability Toolkit

### Horizontal Scaling (Scale Out)

Add more servers. The fundamental answer to traffic growth.

```
Before: [Server: handles 1K RPS]
After:  [Server][Server][Server][Server] behind LB → handles 4K RPS
```

**Prerequisites:**

1. App must be stateless (no session on server)
2. Shared state in external systems (Redis, DB)
3. Load balancer in front

### Database Read Replicas

Your DB is the bottleneck. 90% of queries are reads. Add read replicas.

```
All writes → [Primary DB]
                 ↓ replication
All reads  → [Replica 1] [Replica 2] [Replica 3]
```

**Application code:**

```python
# Write connection pool
write_db = create_engine("postgresql://primary:5432/db")

# Read connection pool (round-robin across replicas)
read_db = create_engine("postgresql://replica1,replica2,replica3/db", execution_options={ "postgresql_readonly": True })

def get_user(user_id):
    return read_db.execute("SELECT * FROM users WHERE id = ?", user_id)

def update_user(user_id, data):
    write_db.execute("UPDATE users SET ... WHERE id = ?", user_id)
```

### Connection Pooling

**Problem:** Each DB connection is expensive (~memory, TCP handshake). App opens connection per request → 10K concurrent requests → 10K connections → DB melts.

**Solution:** Connection pool — maintain a pool of open connections, reuse them.

```python
# SQLAlchemy connection pool
engine = create_engine(
    "postgresql://localhost/db",
    pool_size=20,                # maintain 20 connections
    max_overflow=10,             # allow 10 more under load
    pool_timeout=30,             # wait 30s for connection before error
    pool_recycle=3600            # recycle connections every hour (prevents stale)
)
```

**Tools:** PgBouncer (PostgreSQL connection pooler — handles 10K+ connections down to 100 DB connections), ProxySQL (MySQL).

### Async I/O

**Synchronous:** Thread waits while waiting for DB/API response. Thread blocked. 100 concurrent requests = 100 threads.

**Async:** Thread registers callback for I/O completion, moves on. One thread handles thousands of concurrent I/O-bound operations.

```python
# Sync — blocks per request
def get_user_sync(user_id):
    user = db.query("SELECT...")   # thread blocks here
    posts = api.get_posts(user_id) # thread blocks here
    return merge(user, posts)

# Async — both I/O operations run concurrently
async def get_user_async(user_id):
    user, posts = await asyncio.gather(
        db.async_query("SELECT..."),
        api.async_get_posts(user_id)
    )
    return merge(user, posts)
```

**Frameworks:** Python (FastAPI, asyncio), Node.js (event loop), Go (goroutines), Java (reactive streams).

---

## Database Performance Optimization

### Query Optimization

**EXPLAIN ANALYZE — your best friend:**

```sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2026-06-01'
GROUP BY u.id, u.name;
```

Output:

```
Gather (cost=... rows=...)
  → Hash Join (...)
      → Seq Scan on users (cost=...) ← RED FLAG: full table scan
      → Hash (...)
          → Seq Scan on orders (...)
Planning time: 1.2ms
Execution time: 2847ms  ← WAY too slow
```

After adding index on `users.created_at`:

```
Index Scan on users using idx_created_at (...)
Execution time: 12ms  ← 237× faster
```

### N+1 Query Problem

**The silent killer of application performance.**

```python
# N+1 problem: 1 query for users + N queries for each user's orders
users = db.query("SELECT * FROM users LIMIT 100")  # 1 query
for user in users:
    orders = db.query("SELECT * FROM orders WHERE user_id = ?", user.id)  # 100 queries
    # 101 total queries instead of 1

# Fixed: JOIN or batch fetch
users_with_orders = db.query("""
    SELECT u.*, o.id as order_id, o.amount
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.id IN (...)
""")  # 1 query
```

**ORMs make this easy to do by accident.** Always check query counts in development.

### Database Partitioning (Table Partitioning)

Split a large table into smaller physical partitions — within the same DB.

```sql
-- Partition orders by year
CREATE TABLE orders (
    id BIGINT,
    user_id BIGINT,
    created_at TIMESTAMP,
    amount DECIMAL
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2022 PARTITION OF orders
    FOR VALUES FROM ('2022-01-01') TO ('2023-01-01');
CREATE TABLE orders_2023 PARTITION OF orders
    FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
CREATE TABLE orders_2024 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

Query `WHERE created_at > '2024-01-01'` only scans `orders_2024` — massive performance gain for time-series data.

---

## Application Performance

### The Performance Measurement Hierarchy

```
p50 latency  : median — 50% of requests are faster than this
p95 latency  : 95% of requests are faster than this
p99 latency  : 99% of requests are faster than this
p999 latency : 99.9% of requests are faster than this (the "long tail")
```

**Always use percentiles, never averages.** A p50 of 50ms is fine. A p99 of 5000ms means 1% of users have terrible experience.

**The long tail problem:** Tail latencies compound. If a page makes 10 parallel API calls each with p99=500ms, the page p99 = probability that at least one is slow = much worse than 500ms.

### Concurrency Models

**Multi-threading (Python/Java):**

```
1 process → N threads
Each thread handles 1 request
Good for: CPU-bound workloads
Problem: Thread overhead, GIL in Python limits CPU parallelism
```

**Event loop (Node.js, asyncio):**

```
1 thread → event loop → callbacks
Handles thousands of concurrent I/O-bound operations
Good for: I/O-bound (API calls, DB queries)
Problem: CPU-bound tasks block the event loop
```

**Multi-process (Gunicorn, Uvicorn workers):**

```
N worker processes, each with their own memory
Each worker handles 1 (or more with async) request at a time
Good for: Python apps (bypasses GIL), isolation
```

**Goroutines (Go):**

```
M goroutines on N OS threads (M:N threading)
Thousands of goroutines with minimal overhead (~2KB each vs 1MB for OS threads)
Good for: massive concurrency with both CPU and I/O workloads
```

### Lazy Loading vs Eager Loading

```python
# Eager loading: load everything upfront
user = User.query.options(
    joinedload(User.orders),
    joinedload(User.preferences)
).get(user_id)
# One query, but loads data you may not use

# Lazy loading: load only when needed
user = User.query.get(user_id)  # fast
if need_orders:
    orders = user.orders  # triggers query only when needed
```

**General rule:** Use eager loading when you know you'll need related data. Use lazy loading for optional data.

---

## Capacity Planning

**Back-of-envelope calculations** tell you what resources you need before you build.

### Example: Design Instagram's photo storage

**Assumptions:**

```
Users: 500M daily active users
10% post a photo/day = 50M new photos/day
Average photo size: 3MB (original)
Multiple versions stored (thumbnail, medium, full): 5MB total per photo
System lifetime: 10 years
```

**Storage:**

```
Daily: 50M × 5MB = 250TB/day
Annual: 250TB × 365 = ~90PB/year
10 years: ~900PB ≈ 1 exabyte
```

**Read traffic:**

```
200M users view 100 photos/day
= 20B photo views/day
= 20B / 86,400s ≈ 230,000 reads/second
```

**Bandwidth:**

```
Served size ≈ 0.5MB average (thumbnail + medium)
230,000 RPS × 0.5MB = 115GB/s outbound bandwidth
→ This is the CDN's job — origin serves far less
```

**Servers:**

```
Assume each server handles 1000 photo read RPS with caching
230,000 / 1000 ≈ 230 servers (minimum, before redundancy)
With N+1 redundancy and headroom: ~500 app servers
```

### The Capacity Planning Formula

```
Required servers = (RPS × average_request_duration_seconds) / target_CPU_utilization

Example:
RPS = 10,000
Average request duration = 50ms = 0.05s
Target CPU utilization = 70%

Required servers = (10,000 × 0.05) / 0.7 = 500 / 0.7 ≈ 715 servers
```

---

## Performance Anti-Patterns

### Synchronous Chain of Services

```
❌ User request triggers:
Service A (50ms) → Service B (30ms) → Service C (40ms) → Service D (25ms)
Total: 145ms latency, 4× failure surface area

✅ Parallelise independent calls:
Service A (50ms) ─┐
Service B (30ms)  ├─ all parallel → 50ms (longest one)
Service C (40ms) ─┘
Then Service D (depends on above): +25ms
Total: 75ms, better failure isolation
```

### Missing Database Indexes

```
❌ Query runs fine in development (100 rows)
✅ Same query takes 30 seconds in production (10M rows)
   → Add EXPLAIN ANALYZE to every non-trivial query
   → Index every column you filter, sort, or join on
```

### Loading Too Much Data

```
❌ SELECT * FROM users WHERE ...    → returns 50 columns, uses 200 bytes/row
✅ SELECT id, name, email WHERE ... → returns only needed columns, 40 bytes/row

❌ Load all 10M records, filter in app code
✅ Filter in SQL WHERE clause — let DB do the work

❌ Load all 10K orders for dashboard "total revenue" calculation
✅ SELECT SUM(amount) FROM orders — aggregate in DB
```

### Not Using Bulk Operations

```python
❌ for user in users:     # 10,000 individual INSERT statements
       db.insert(user)

✅ db.bulk_insert(users)  # 1 INSERT with 10,000 rows
   # 100× faster
```

---

## Flashcards

**Q: How do you scale a system from 1K to 10M users?**

> At 1K users: single server is fine.
>
> At 10K: add caching (Redis) and a read replica — database is usually the first bottleneck.
>
> At 100K: horizontal scaling of app servers behind a load balancer, CDN for static assets.
>
> At 1M: database sharding or migration to Cassandra for high-write workloads, message queues to decouple heavy operations.
>
> At 10M: multi-region deployment, aggressive caching, specialised storage per use case (search → Elasticsearch, analytics → ClickHouse), potential microservices extraction for independently-scaling components.

**Q: What is the N+1 query problem?**

> Fetching N records and then making 1 additional query per record — totaling N+1 queries. Fix with JOINs or batch fetching.

**Q: Why use percentiles instead of averages for latency?**

> Averages hide the "long tail" — a few very slow requests don't move the average much but represent real user suffering. p99 shows what 1% of users experience.

**Q: What is connection pooling?**

> Maintaining a pool of reusable DB connections instead of creating/destroying per request. Dramatically reduces DB overhead.

**Q: What is the difference between vertical and horizontal scaling?**

> Vertical = bigger machine (more CPU/RAM). Horizontal = more machines. Horizontal is preferred at scale but requires stateless apps.

**Q: What does EXPLAIN ANALYZE do in SQL?**

> Shows the query execution plan with actual timing — reveals full table scans, missing indexes, and where time is spent.
