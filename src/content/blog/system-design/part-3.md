---
title: "Caching Strategies"
description: "A deep dive into caching in system design — strategies, invalidation, Redis, and real-world patterns to scale systems efficiently."
pubDate: 2026-04-14T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-caching.avif
tags: ["system-design", "backend", "caching", "architecture"]
featured: false
draft: false
series:
    name: "System Design"
    part: 3
---

Caching is one of the **highest impact optimizations** you can make in any system. Cache is the **short-term memory that makes everything fast**.

---

## The Story: The Sticky Note on Your Desk

You work in a large office. Every time you need a colleague's phone number, you walk to HR, wait, find the file, and come back — 5 minutes. After repeating this a few times, you write it on a sticky note.

👉 That sticky note is your cache.

> **Cache = storing the result of an expensive operation nearby so you don’t repeat it**

---

## Why Caching Exists

Every database read has a cost:

- Disk I/O
- Network latency
- Query execution

```
Without cache:
[User] → [App] → [DB] → [App] → [User]    (~10–100ms)

With cache:
[User] → [App] → [Cache] → [App] → [User] (<1ms)
```

👉 Massive latency reduction  
👉 Massive database load reduction

---

## The Three Laws of Caching

1. **Cache hit = fast, miss = expensive**
2. **Cache stores only hot data**
3. **Invalidation is the hardest problem**

---

## Cache Hit Rate — The Most Important Metric

```
Cache hit rate = hits / (hits + misses)
```

| Hit Rate | Meaning              |
| -------- | -------------------- |
| > 99%    | Excellent            |
| 90–99%   | Good                 |
| 70–90%   | Needs improvement    |
| < 70%    | Cache is ineffective |

👉 Even **1% miss at scale = huge DB load**

---

## Cache Layers

```
Browser Cache          ← HTML/CSS/JS, images (no server needed)
     ↓
CDN Cache              ← Static assets and API responses at edge
     ↓
Load Balancer Cache    ← Simple request deduplication
     ↓
Application Cache      ← In-process memory (HashMap, LRU cache)
     ↓
Distributed Cache      ← Redis/Memcached (shared across app servers)
     ↓
Database Buffer Pool   ← DB caches its own pages in RAM
     ↓
Disk Cache (OS)        ← OS caches disk reads in memory
```

---

## In-process vs Distributed Cache

|                   | In-process (local)           | Distributed (Redis)                            |
| ----------------- | ---------------------------- | ---------------------------------------------- |
| Speed             | Fastest (nanoseconds)        | Fast (microseconds, network)                   |
| Shared?           | No — each server has its own | Yes — all servers share one cache              |
| Survives restart? | No                           | Yes (with persistence)                         |
| Memory limit      | Single server's RAM          | Clustered RAM (terabytes possible)             |
| Use when          | Static data, tiny datasets   | Session data, shared state, horizontal scaling |

**Rule:**

- Single server → `in-process` cache (e.g., LRU cache in app memory)
- Multiple servers → use Redis (because `in-process` cache creates inconsistency)

---

## Caching Strategies

### Cache-Aside (Lazy Loading) — The Most Common

**Story:** You (the app) check your sticky note first. If it's there, done. If not, you go to the records room (DB), get the data, and write it on a new sticky note for next time.

```
READ:
1. App checks cache for key
2. HIT  → return cached value ✓
   MISS → query DB → store result in cache → return result

WRITE:
1. Update DB
2. Invalidate (delete) the cache key ← next read will repopulate
```

```python
def get_user(user_id):
    # 1. Check cache
    cached = redis.get(f"user:{user_id}")
    if cached:
        return json.loads(cached)

    # 2. Cache miss — hit DB
    user = db.query("SELECT * FROM users WHERE id = ?", user_id)

    # 3. Populate cache with TTL
    redis.setex(f"user:{user_id}", 3600, json.dumps(user))

    return user

def update_user(user_id, data):
    db.update("UPDATE users SET ... WHERE id = ?", user_id, data)
    redis.delete(f"user:{user_id}")  # Invalidate cache
```

**Pros:**

- Only requested data gets cached (no wasted memory)
- Cache failures don't break the app — just slower

**Cons:**

- First request always slow (cache cold start)
- Potential for stale data between write and invalidation

**Use when:** General-purpose, read-heavy workloads. Default choice.

---

### Read-Through — The Cache Manages Itself

**Story:** You ask the cache for data. The cache itself goes to the DB on a miss — you never talk to the DB directly.

```
[App] → [Cache] → (hit) → returns data
           ↓ (miss)
          [DB]
           ↓
        [Cache] populates and returns
```

**Difference from cache-aside:** The cache library/service handles the miss logic, not your application code.

**Tools:** Some Redis client libraries support this. Managed services like DAX (DynamoDB Accelerator).

**Pros:**

- Cleaner application code
- Cache miss handling is abstracted

**Cons:**

- First request is always slow
- Less control over what gets cached

---

### Write-Through — Always Stay In Sync

**Story:** Every time you update a record, you update BOTH the DB and the cache simultaneously. The cache is never out of date — for long.

```
WRITE:
1. App writes to CACHE first
2. Cache synchronously writes to DB
3. Returns success only after both writes complete

READ:
Always hits cache → always fresh data
```

**Pros:**

- Cache is always consistent with DB
- Reads are always fast (no cold start problem)

**Cons:**

- Every write is slower (two writes instead of one)
- Cache fills with data that may never be read (write-once, never-read data wastes memory)

**Use when:** Read-heavy systems where stale data is unacceptable.

**Example:** user's own profile page.

---

### Write-Behind (Write-Back) — High-Speed Writes

**Story:** You scribble on the sticky note instantly. At the end of the day, someone updates the official records. Your writes are fast, but there's a delay before the official record is updated.

```
WRITE:
1. App writes to cache → returns SUCCESS immediately
2. Cache asynchronously writes to DB (buffered, batched)

READ:
From cache → always fast
```

**Pros:**

- Extremely fast writes (no DB latency for the user)
- Batch DB writes = fewer DB round-trips

**Cons:**

- Risk of data loss if cache crashes before async write completes
- Complex recovery logic needed

**Use when:** High-throughput write scenarios where occasional data loss is tolerable.

**Example:** social media like counts, view counters, gaming leaderboards.

---

### Refresh-Ahead — The Proactive Cache

**Story:** Before your sticky note expires, someone proactively fetches the fresh data so you never experience a cold miss.

```
Cache detects that key "user:42" TTL expires in 30s
→ Proactively fetches fresh data from DB
→ Repopulates before TTL expires
→ User never sees a cache miss
```

**Pros:** No latency spikes from cold misses on popular keys  
**Cons:** May refresh data that's no longer needed (wasted DB calls)

**Use when:** Highly predictable access patterns (dashboards, popular product pages)

---

### Which Strategy Should You Use?

- **Default:** Cache-aside
- **Strict consistency:** Write-through
- **High write load:** Write-behind
- **Predictable reads:** Refresh-ahead

👉 Most real systems = **Cache-aside + TTL + invalidation**

---

## Cache Invalidation: The Hardest Problem

> **"There are only two hard things in Computer Science: cache invalidation and naming things."** — Phil Karlton

Invalidation = figuring out when cached data has become stale and needs to be removed/updated.

### TTL (Time to Live)

Assign an expiry to every cache entry. After TTL, the key expires and the next read goes to DB.

```python
redis.setex("product:1001", 3600, data)  # expires in 1 hour
```

| TTL too short                      | TTL too long               |
| ---------------------------------- | -------------------------- |
| Many cache misses → DB load spikes | Stale data served to users |

**Choosing TTL:**

- User sessions: 24–72 hours
- Product catalog: 10–60 minutes
- Live sports scores: 10–30 seconds
- User's own profile: 5 minutes or event-driven invalidation

---

### Event-Driven Invalidation

Delete the cache key the moment underlying data changes.

```python
# When order status changes:
def update_order_status(order_id, new_status):
    db.update("UPDATE orders SET status=? WHERE id=?", new_status, order_id)
    redis.delete(f"order:{order_id}")             # direct key
    redis.delete(f"user_orders:{order.user_id}")  # related collection
```

**Pro:** Cache is never stale  
**Con:** You must know all cache keys affected by every write — this gets complex

---

### Versioned Cache Keys

Instead of invalidating, use a new key. Old key becomes orphaned and expires naturally.

```python
# Store version in DB or separate Redis key
version = redis.get("user:42:version") or 1

cache_key = f"user:42:v{version}"

# On update: increment version
def update_user(user_id):
    db.update(...)
    redis.incr(f"user:{user_id}:version")
    # Old versioned key will expire via TTL
```

**Pro:** Simple, atomic, no cache stampede  
**Con:** Old keys waste memory until TTL expires

---

## Cache Eviction Policies

When the cache is full, what gets kicked out?

| Policy                          | How it works                                    | Best for                              |
| ------------------------------- | ----------------------------------------------- | ------------------------------------- |
| **LRU** (Least Recently Used)   | Evict the key not accessed for the longest time | General purpose — default choice      |
| **LFU** (Least Frequently Used) | Evict the key accessed the fewest times         | Long-term hot data retention          |
| **FIFO** (First In, First Out)  | Evict oldest-inserted key                       | Simple queues                         |
| **Random**                      | Evict a random key                              | Low overhead, unpredictable but cheap |
| **TTL-based**                   | Evict expired keys first                        | When TTLs are well-calibrated         |

**Redis eviction policies:** `allkeys-lru` (most common), `volatile-lru` (only keys with TTL), `allkeys-lfu`, `noeviction` (errors on full cache)

---

## Cache Anti-Patterns

### The Cache Stampede (Thundering Herd)

**Problem:** Popular key expires. Simultaneously, 1,000 requests miss the cache, all query the DB at the same time. DB melts.

```
T=3600s: "product:1001" TTL expires
T=3600s + 1ms: 1000 concurrent requests all get MISS
               1000 DB queries fire simultaneously
               DB falls over
```

**Solutions:**

1. **Mutex lock:** First miss acquires a lock, fetches from DB, populates cache. Others wait.

```python
lock = redis.set("lock:product:1001", 1, nx=True, ex=5)  # 5s lock
if lock:
    data = db.fetch(...)
    redis.set("product:1001", data, ex=3600)
    redis.delete("lock:product:1001")
else:
    time.sleep(0.05)
    return get_from_cache("product:1001")  # retry
```

2. **Probabilistic early expiration:** Before TTL hits, probabilistically refresh. High-traffic keys refresh earlier.

3. **Stale-while-revalidate:** Serve the stale value while asynchronously refreshing it.

---

### Cache Penetration — The Ghost Key Attack

**Problem:** Attacker (or bug) queries keys that will never exist (e.g., `user:-1`, `product:99999999`). Every request misses cache and hits DB.

**Solution: Cache null values**

```python
result = db.query(user_id)
if result is None:
    redis.setex(f"user:{user_id}", 60, "NULL")  # cache the miss too
    return None
```

Or use a **Bloom filter** — a probabilistic structure that tells you "definitely not in DB" before even querying.

---

### Cache Avalanche

**Problem:** Many keys expire at the same time (e.g., cache seeded in bulk → all expire in 1 hour). Massive DB spike.

**Solution:** Add jitter to TTLs.

```python
import random
ttl = 3600 + random.randint(-300, 300)  # 3600s ± 5 minutes
redis.setex(key, ttl, value)
```

---

## Redis: The Industry Standard

Redis (Remote Dictionary Server) is not just a cache — it's an in-memory data structure store.

**Data structures**

| Type       | Commands                    | Use case                       |
| ---------- | --------------------------- | ------------------------------ |
| String     | GET, SET, INCR, EXPIRE      | Cache, counters, rate limiting |
| Hash       | HGET, HSET, HMGET           | User objects, shopping carts   |
| List       | LPUSH, RPUSH, LRANGE        | Queues, activity feeds         |
| Set        | SADD, SMEMBERS, SINTER      | Unique visitors, tags          |
| Sorted Set | ZADD, ZRANGE, ZRANGEBYSCORE | Leaderboards, priority queues  |
| Pub/Sub    | PUBLISH, SUBSCRIBE          | Real-time messaging            |
| Streams    | XADD, XREAD                 | Event logs, Kafka-lite         |

**Redis for rate limiting**

```python
def is_rate_limited(user_id, limit=100, window=60):
    key = f"rate:{user_id}"
    count = redis.incr(key)
    if count == 1:
        redis.expire(key, window)  # set expiry on first request
    return count > limit
```

**Redis Cluster**

Horizontal scaling for Redis: data automatically sharded across nodes using consistent hashing (16,384 hash slots). Supports replica nodes per shard for HA.

---

## Caching in Practice: A Real Example

**Scenario:** E-commerce product page receiving 50,000 requests/minute.

```
Product page request flow:

1. Browser checks its own cache (Cache-Control header)
   HIT → serve from browser in 0ms

2. CDN edge (Cloudflare) checks its cache
   HIT → serve from CDN in 5ms

3. App server checks Redis
   HIT → return in 1ms
   MISS
    ↓
4. Query PostgreSQL with read replica
   → takes 15–80ms

5. Store in Redis with TTL=300s (5 min)

6. Return response + set Cache-Control header for CDN/browser
```

**Cache strategy per data type:**

| Data                     | Cache location | TTL                    | Invalidation                    |
| ------------------------ | -------------- | ---------------------- | ------------------------------- |
| Product details          | Redis + CDN    | 5–30 min               | On product update               |
| User session             | Redis          | 24 hours               | On logout                       |
| Homepage recommendations | Redis          | 10 min                 | TTL only                        |
| User's own cart          | Redis          | 72 hours               | On cart update                  |
| Static assets (JS/CSS)   | CDN            | 1 year (versioned URL) | Deploy new version with new URL |

---

## How would you add caching to a system?

**Step 1:** Identify the hot path.

> "What are the most frequently accessed data pieces? Product listings, user sessions, search results?"

**Step 2:** Choose strategy.

> "I'd use cache-aside with Redis. The app checks Redis first; on miss, queries the DB and populates Redis with a 5-minute TTL."

**Step 3:** Address invalidation.

> "On product update, we delete the Redis key. On next read, fresh data populates the cache."

**Step 4:** Address failure.

> "If Redis goes down, the app falls through to the DB — degraded performance but not an outage. Redis persistence is configured so warm restart restores the cache quickly."

**Step 5:** Address stampede.

> "For very high traffic keys, we use a mutex lock on cache miss to prevent thundering herd."

---

## Flashcards

**Q: What is cache-aside (lazy loading)?**

> App checks cache first; on miss, fetches from DB and populates cache. Most common pattern.

**Q: What is write-through caching?**

> Every write goes to both cache and DB synchronously. Cache is always consistent; writes are slower.

**Q: What is write-behind (write-back) caching?**

> Write to cache immediately; async write to DB later. Fastest writes, risk of data loss.

**Q: What is a cache stampede?**

> When a popular cached key expires and many requests simultaneously miss the cache and overload the DB.

**Q: What is cache penetration?**

> Requests for keys that don't exist in DB bypass the cache repeatedly. Solution: cache null values or use Bloom filter.

**Q: What is LRU eviction?**

> When cache is full, evict the key not accessed for the longest time. Default choice for most systems.

**Q: What is cache avalanche?**

> Many cache keys expire simultaneously, causing a traffic spike to the DB. Solution: add random jitter to TTLs.
