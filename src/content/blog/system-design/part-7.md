---
title: "Rate Limiting & Traffic Control"
description: "Learn rate limiting algorithms like Token Bucket, Leaky Bucket, Sliding Window, distributed rate limiting with Redis, and how APIs protect themselves from abuse at scale."
pubDate: 2026-05-21T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-rate-limit.avif
tags: ["system-design", "rate-limiting", "redis", "api-design", "scalability"]
featured: false
draft: false
series:
    name: "System Design"
    part: 7
---

## The Story: The Club Bouncer

A nightclub has a capacity of 500 people. The bouncer at the door counts people going in and enforces the limit. If you try to enter when it's full, you wait outside. Some VIPs get priority entry. The bouncer also stops the same person from going in and out repeatedly to game the system.

That bouncer is your rate limiter.

**Rate limiting = controlling how many requests a client can make in a time window.**

---

## Why Rate Limiting?

| Reason                     | Without rate limiting                      | With rate limiting                            |
| -------------------------- | ------------------------------------------ | --------------------------------------------- |
| **DDoS protection**        | Single client sends 1M req/s → server dies | Client capped at 1000 req/s → server survives |
| **Fair usage**             | One power user consumes 90% of resources   | Each user gets a fair share                   |
| **Cost control**           | Downstream API calls (GPT, Stripe) blow up | Metered fairly                                |
| **Brute force prevention** | Attacker tries 1M passwords/s              | Locked after 10 attempts/min                  |
| **Revenue (SaaS)**         | Free tier users = unlimited = no paid tier | Free = 100 req/day, Pro = 10K/day             |

---

## Where to Rate Limit?

```
[Client] → [CDN / Edge] → [API Gateway] → [Load Balancer] → [Microservice]
                ↑               ↑                                 ↑
           Rate limit       Rate limit                        Rate limit
           (DDoS, IP)   (per-user, per-API)              (internal protection)
```

- **At the edge (CDN/WAF):** Block IP-based floods before they reach your infrastructure.
- **At the API Gateway:** Per-user, per-API-key, per-plan rate limiting. Most common implementation point.
- **At the service level:** Protection against other internal services misbehaving.

---

## Rate Limiting Algorithms

### Algorithm 1: Token Bucket

**Mental model:**

- A bucket holds tokens.
- Each request consumes one token.
- Tokens refill at a fixed rate.
- No tokens left → request rejected.

```
Bucket capacity: 10 tokens   (max burst size)
Refill rate: 5 tokens/second

T=0:  Bucket has 10 tokens
      Request A → consume 1 → 9 tokens
      Request B → consume 1 → 8 tokens
T=1s: Refill +5 → 13... but capped at 10 → 10 tokens
      Request C → consume 1 → 9 tokens

Burst of 10 requests at once? → allowed (bucket has 10 tokens)
11th request immediately? → rejected (bucket empty, wait for refill)
```

**Implementation:**

```python
import time
import redis

class TokenBucket:
    def __init__(self, redis_client, key, capacity, refill_rate):
        self.redis = redis_client
        self.key = key
        self.capacity = capacity        # max tokens
        self.refill_rate = refill_rate  # tokens per second

    def allow_request(self):
        now = time.time()

        # Atomic Lua script (runs atomically in Redis)
        lua_script = """
        	local key = KEYS[1]
        	local capacity = tonumber(ARGV[1])
        	local refill_rate = tonumber(ARGV[2])
        	local now = tonumber(ARGV[3])

        	local data = redis.call('HMGET', key, 'tokens', 'last_refill')
        	local tokens = tonumber(data[1]) or capacity
        	local last_refill = tonumber(data[2]) or now

        	-- Calculate tokens to add since last refill
        	local elapsed = now - last_refill
        	tokens = math.min(capacity, tokens + elapsed * refill_rate)

        	if tokens >= 1 then
        	    tokens = tokens - 1
        	    redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
        	    redis.call('EXPIRE', key, 3600)
        	    return 1  -- allow
        	else
        	    return 0  -- deny
        	end
        """

        return self.redis.eval(lua_script, 1, self.key, self.capacity, self.refill_rate, now)
```

**Pros:** Allows bursts (good for real-world traffic patterns). Simple to implement.  
**Cons:** Hard to control exact rate — bursts can exceed sustained rate.  
**Used by:** AWS API Gateway, Stripe

---

### Algorithm 2: Leaky Bucket

**Mental model:**

- A bucket with a hole in the bottom.
- Water (requests) pours in at any rate.
- Water leaks out at a constant rate.
- If bucket overflows → requests dropped.

```
Bucket (queue) capacity: 100 requests
Leak rate (processing rate): 50 requests/second

Burst of 200 requests → 100 accepted (queue fills), 100 dropped
Queue drains at 50/s → smooth, constant output rate
```

**Key difference from Token Bucket:**

- Output is always at a constant rate.
- No bursts.
- Traffic is smoothed.

**Pros:** Stable, predictable output rate. Great for downstream services that need steady load.  
**Cons:** Bursty clients always experience drops even if average rate is fine. Added latency (requests wait in queue).
**Used by:** Traffic shaping, network QoS, payment gateways.

---

### Algorithm 3: Fixed Window Counter

**Mental model:**

- A clock with 60-second windows.
- Count requests per window.
- Reset at window boundary.

```
Window: 0–59s → max 100 requests
  Second 30:  50 requests → 50 remaining
  Second 59:  100th request → OK
  Second 60:  RESET → new window → 0 requests counted

Problem: boundary abuse
  Second 59:  Send 100 requests → all OK
  Second 60:  Send 100 requests → all OK (new window)
  → 200 requests in 2 seconds — 2× the limit
```

**Pros:** Simple. Low memory (just a counter per user per window).  
**Cons:** Boundary abuse allows 2× the intended rate. Uneven distribution.

**Implementation:**

```python
def allow_request(user_id, limit=100, window=60):
    now = int(time.time())
    window_key = now // window           # which 60-second window are we in?
    redis_key = f"rate:{user_id}:{window_key}"

    count = redis.incr(redis_key)
    if count == 1:
        redis.expire(redis_key, window)  # set TTL on first request

    return count <= limit
```

---

### Algorithm 4: Sliding Window Log

**Mental model:**

- Keep a log of exact timestamps of all requests.
- Count how many fall within the past 60 seconds.

```
Request log for user_23 (sorted set of timestamps):
[59.1, 59.3, 59.7, 59.9, 60.1, 60.4, 60.8]

At T=61.0: window = [1.0 - 61.0]
Remove timestamps < 1.0 → remove 59.1, 59.3... wait, those are in range
Remove timestamps < (61.0 - 60) = 1.0 → none to remove
Count = 7 → if limit = 100, allow
```

**Pros:** Perfectly accurate. No boundary problem.  
**Cons:** High memory (store every request timestamp). High computation (remove old entries on every request).

**Used when:** Accuracy is critical, request volume is moderate.

---

### Algorithm 5: Sliding Window Counter

**Mental model:** Estimate the current window's request count using the previous window's count weighted by overlap.

```
Current time: T=75s (into 60s window, 15s elapsed)
Previous window (0-60s): 80 requests
Current window (60-120s): 30 requests so far

Overlap with previous window: (60-15)/60 = 75%
Estimated total: 30 + 80 × 0.75 = 90

If limit = 100 → allow (90 < 100)
```

**Pros:** Low memory (just two counters). Good approximation of sliding window.  
**Cons:** Approximate (assumes uniform distribution within windows). Off by up to ~15%.

**Used by:** Cloudflare, NGINX, most production rate limiters.

```python
def allow_request(user_id, limit=100, window=60):
    now = time.time()
    current_window = int(now // window)
    previous_window = current_window - 1
    elapsed_in_current = now % window

    current_key = f"rate:{user_id}:{current_window}"
    previous_key = f"rate:{user_id}:{previous_window}"

    current_count = int(redis.get(current_key) or 0)
    previous_count = int(redis.get(previous_key) or 0)

    # Weight previous window by how much it overlaps
    overlap = (window - elapsed_in_current) / window
    estimated = current_count + previous_count * overlap

    if estimated >= limit:
        return False  # deny

    # Allow — increment current window counter
    redis.incr(current_key)
    redis.expire(current_key, window * 2)
    return True
```

---

## Rate Limiting Dimensions

Don't just limit by user. Consider:

```
Per IP:        prevent DDoS from single source
Per user:      fair usage enforcement
Per API key:   plan-based limits (free vs pro)
Per endpoint:  /search (expensive) may have lower limit than /profile
Per region:    different limits for different markets
Globally:      protect downstream services from your own traffic
```

**Example: Stripe's rate limiting**

```
Test mode:    100 req/s per secret key
Live mode:    1000 req/s per secret key
Specific endpoints: /charges → 10 req/s (expensive operation)
```

---

## Distributed Rate Limiting

When you have multiple API servers, how do they share rate limit state?

### Problem

```
Rate limit: 100 req/min per user

Server 1: user_23 → 60 requests → stored locally: 60
Server 2: user_23 → 60 requests → stored locally: 60
Reality: user_23 made 120 requests → exceeded limit!
```

Each server doesn't know about the other's counts.

### Solution: Centralized Redis

```
All servers → Redis (centralized counter) → atomic INCR
```

All servers share one Redis instance. Every request atomically increments the same key.

**The race condition:** Two servers simultaneously read count=99, both increment to 100, both allow the request. Now count is 101.

**Solution:** Use Redis atomic operations (`INCR` is atomic, Lua scripts for multi-step logic).

### Approximate distributed rate limiting (for extreme scale)

Each server keeps a local counter. Periodically (every 100ms) syncs with Redis.

```
Server 1: local count = 30
Server 2: local count = 25
Server 3: local count = 20

Every 100ms: each server adds local count to Redis, resets local counter
Redis total: 75 requests in this window

Slight overcount possible within 100ms window — acceptable for most use cases
```

---

## Rate Limit Response Design

When you reject a request, give the client useful information:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 100          ← your limit
X-RateLimit-Remaining: 0        ← how many you have left
X-RateLimit-Reset: 1706745600   ← Unix timestamp when limit resets
Retry-After: 45                 ← seconds until you can retry

{
  "error": "rate_limit_exceeded",
  "message": "You have exceeded 100 requests per minute. Please retry after 45 seconds.",
  "retry_after": 45
}
```

**Client-side handling:**

```python
response = api.call(...)
if response.status_code == 429:
    retry_after = int(response.headers.get('Retry-After', 60))
    time.sleep(retry_after)
    response = api.call(...)  # retry once
```

---

## How to design a rate limiter for an API

**Step 1:** What are the requirements?

- Per user, per IP, or both?
- How many users? (determines if we need distributed solution)
- What's the algorithm preference? (Token bucket for burst-friendly, Leaky bucket for smoothed)
- Strict accuracy or approximate?

**Step 2:** Choose algorithm

- Default: **Sliding window counter** — best balance of accuracy and performance
- High burst tolerance: Token bucket
- Smooth output: Leaky bucket

**Step 3:** Storage

- **Redis** — atomic operations, fast, shared across servers
- Key: `rate:{user_id}:{window}` or `rate:{ip}:{window}`
- Lua scripts for atomicity

**Step 4:** Where to implement

- **API Gateway** (Kong, AWS API Gateway) — don't reinvent the wheel in most cases
- Custom middleware — if you need special logic the gateway doesn't support

**Step 5:** Scale

- Single Redis node handles ~100K ops/sec — enough for most systems
- Redis Cluster for multi-billion-request scale
- Edge rate limiting (Cloudflare Workers) for DDoS protection

---

## Flashcards

**Q: What are the five rate limiting algorithms?**

> Token Bucket, Leaky Bucket, Fixed Window Counter, Sliding Window Log, Sliding Window Counter.

**Q: What is the boundary problem in Fixed Window Counter?**

> A user can make 2× the limit in 2 seconds by sending max requests at the end of one window and start of the next.

**Q: What makes Token Bucket different from Leaky Bucket?**

> Token Bucket allows bursts (up to bucket size). Leaky Bucket smooths traffic to a constant output rate regardless of input burstiness.

**Q: What HTTP status code is returned when rate limited?**

> 429 Too Many Requests. Include Retry-After header.

**Q: How do you rate limit across multiple servers?**

> Centralized Redis with atomic INCR. Or approximate: local counters that sync to Redis every N milliseconds.

**Q: What is the sliding window counter algorithm?**

> Estimates current window's count as: current_count + previous_count × (overlap_fraction). Low memory, good approximation.
