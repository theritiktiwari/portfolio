---
title: "Designing for Failure"
description: "Learn how resilient systems survive failures using redundancy, retries, circuit breakers, rate limiting, graceful degradation, and monitoring."
pubDate: 2026-05-01T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-failure.avif
tags: ["system-design", "backend", "distributed-systems", "reliability", "architecture"]
featured: false
draft: false
series:
    name: "System Design"
    part: 4
---

## The Story: The City That Never Sleeps

A great city doesn't shut down when a water main breaks, traffic reroutes, backup generators kick in, or emergency services redirect. The city has **redundancy**, **fallback plans**, and **graceful degradation** baked into its infrastructure.

Your system must be the same. Not "will things fail?" — they will. The question is: **how does your system behave when they do?**

---

## The Reliability Vocabulary

### Availability

The percentage of time your system is operational and serving requests.

```
Availability = uptime / (uptime + downtime) × 100%
```

| SLA                    | Downtime per year | Downtime per month |
| ---------------------- | ----------------- | ------------------ |
| 99% ("two nines")      | 3.65 days         | 7.3 hours          |
| 99.9% ("three nines")  | 8.77 hours        | 43.8 minutes       |
| 99.99% ("four nines")  | 52.6 minutes      | 4.4 minutes        |
| 99.999% ("five nines") | 5.26 minutes      | 26 seconds         |

**Memory anchor:** Five nines = you can only afford 26 seconds of downtime per month. That's the standard for critical infrastructure (banking, telecom, air traffic control).

### Systems in series vs parallel

```
Series (components must ALL work):
[A] → [B] → [C]
Availability = A × B × C
             = 0.99 × 0.99 × 0.99
			 = 0.970 (97%)  ← WORSE than each individual component


Parallel (one must work):
       [A]
[in] → [B] → [out]
       [C]
Availability = 1 - (1-A)(1-B)(1-C)
             = 1 - (0.01)(0.01)(0.01)
			 = 0.999999 (99.9999%) ← MUCH BETTER
```

**Key insight:** Adding redundancy in parallel dramatically increases availability. This is the fundamental reason for replication, clustering, and multi-AZ deployments.

### MTTR and MTBF

| Metric   | Stands for                 | What it measures                  |
| -------- | -------------------------- | --------------------------------- |
| **MTBF** | Mean Time Between Failures | Average uptime between incidents  |
| **MTTR** | Mean Time To Recovery      | Average time to fix after failure |

`Availability ≈ MTBF / (MTBF + MTTR)`

**To improve availability:** Increase MTBF (fewer failures) OR decrease MTTR (faster recovery). MTTR is often more actionable.

---

## Failure Modes: What Can Go Wrong

### Hardware failures

- Server dies, disk fails, NIC fails
- Solution: Redundant hardware, RAID, multiple availability zones

### Software failures

- Memory leaks, deadlocks, infinite loops, crashes
- Solution: Circuit breakers, watchdogs, automatic restarts, chaos engineering

### Network failures

- Packet loss, latency spikes, partition (two parts of the network can't reach each other)
- Solution: Retries with backoff, timeouts, circuit breakers

### Human errors

- Misconfiguration, bad deployments, accidental deletes
- Solution: Deployment safeguards, rollback mechanisms, access controls, backup policies

### Cascading failures

- One service slows → queues back up → retries increase → more load → adjacent services slow → entire system collapses
- Solution: Circuit breakers, bulkheads, load shedding

---

## Redundancy: The Foundation

**Redundancy = having more than one of something critical.**

### Active-Passive (Primary-Standby)

```
[Load Balancer] → [Active Server]  ← does all the work
                  [Passive Server] ← standby, watching, ready


If Active fails:
[Load Balancer] → [Passive Server] ← takes over (failover)
```

**Failover time:** Seconds to minutes (passive must detect failure and warm up)  
**Resource efficiency:** Passive is "wasted" — it's idle until needed  
**Use for:** Databases (primary-replica), systems where split-brain is dangerous

### Active-Active

```
        [Active Server 1] ← handles 50% of traffic
[LB] →
        [Active Server 2] ← handles 50% of traffic


If Server 1 fails:
[LB] →  [Active Server 2] ← handles 100% of traffic (degraded, not down)
```

**Failover time:** Zero (LB instantly reroutes)  
**Resource efficiency:** Both servers doing work  
**Use for:** Stateless app servers, read replicas, multi-region setups

### Geographic redundancy

```
   Region A (Mumbai)                    Region B (Singapore)
[LB] → [Servers] → [DB]               [LB] → [Servers] → [DB]
                       ↕ (replicated) ↕
```

Single datacenter disaster (fire, flood, power grid failure) doesn't take down your system.

**AWS terminology:**

- **Availability Zones (AZs)** = isolated datacenters within a region.
- **Multi-AZ** = redundancy within a region.
- **Multi-Region** = redundancy across geographies.

---

## Circuit Breaker Pattern

**Story:** Your home has a circuit breaker. When too much current flows (overload), it trips and cuts power rather than letting wires overheat and start a fire. Once the problem is fixed, you reset the breaker.

**In software:** When a downstream service is failing, stop calling it. Return an immediate error or fallback. Give it time to recover.

### States

```
           success rate high
               ↗         ↘
 CLOSED ─────────────────────── OPEN
(normal)       failure       (stop calling)
            threshold hit         │
                                 wait
                                  │
                         HALF-OPEN ← (try one request)
                             │
                    success? → CLOSED
                    failure? → OPEN
```

**CLOSED:** Normal operation. Requests pass through. Count failures.  
**OPEN:** Failure threshold exceeded. Immediately return error/fallback. No requests to downstream.  
**HALF-OPEN:** After timeout, allow one test request. Success → CLOSED. Failure → OPEN.

### Implementation pattern

```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.state = "CLOSED"
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.last_failure_time = None
        self.timeout = timeout

    def call(self, func, *args):
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.timeout:
                self.state = "HALF-OPEN"
            else:
                raise Exception("Circuit open — fast fail")

        try:
            result = func(*args)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise

    def _on_success(self):
        self.failure_count = 0
        self.state = "CLOSED"

    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
```

**Tools:** Netflix Hystrix (Java), Resilience4j, Polly (.NET), Python `pybreaker`

---

## Retry with Exponential Backoff

**Story:** You call a restaurant. Line busy. You call again immediately — still busy. And again. You're making it worse by adding load. Smart approach: wait a bit, try again. Wait longer, try again. Eventually stop trying.

### The pattern

```python
import time
import random

def retry_with_backoff(func, max_retries=5, base_delay=1):
    for attempt in range(max_retries):
        try:
            return func()
        except TransientError as e:
            if attempt == max_retries - 1:
                raise  # final attempt — give up

            # Exponential backoff with jitter
            delay = (2 ** attempt) * base_delay + random.uniform(0, 1)
            time.sleep(delay)
            # Attempt 0: sleep ~1s
            # Attempt 1: sleep ~2s
            # Attempt 2: sleep ~4s
            # Attempt 3: sleep ~8s
            # Attempt 4: sleep ~16s
```

**Jitter is critical:** Without jitter, all clients that failed at the same time retry at the same time — thundering herd. Random jitter spreads the retries out.

### What to retry vs what not to

| Error type                | Retry?             | Why                                             |
| ------------------------- | ------------------ | ----------------------------------------------- |
| Network timeout           | Yes                | Transient — service may be temporarily slow     |
| 503 Service Unavailable   | Yes                | Service temporarily overloaded                  |
| 429 Too Many Requests     | Yes, after backoff | Rate limit — back off and retry                 |
| 400 Bad Request           | No                 | Your request is malformed — retrying won't help |
| 401 Unauthorized          | No                 | Auth issue — retrying won't help                |
| 404 Not Found             | No                 | Resource doesn't exist                          |
| 500 Internal Server Error | Sometimes          | Depends on idempotency                          |

**Idempotency matters:** Only retry if the operation is idempotent (same result if called multiple times). GET is idempotent. POST that creates a resource is NOT (retrying creates duplicates).

---

## Bulkhead Pattern

**Story:** A ship's hull is divided into watertight compartments (bulkheads). If one section floods, it doesn't sink the whole ship.

**In software:** Isolate failures in one component so they don't cascade to others.

### Thread pool isolation

```
Without bulkheads:
[App] has 100 thread pool
Service A gets slow → consumes 90 threads waiting
Service B calls start queuing → waiting for threads → now it gets also slow/down even though it is fine


With bulkheads:
Service A → dedicated pool of 30 threads
Service B → dedicated pool of 30 threads
Service C → dedicated pool of 30 threads

Service A degrades → only those 30 threads affected
Service B & C continues normally
```

### Resource bulkheads

Separate resource pools for different criticality levels:

```
Critical path (checkout, payment): large thread pool, high priority
Non-critical (recommendations, analytics): small pool, low priority

Payment service slow? Recommendations are unaffected.
```

---

## Timeouts: The Forgotten Hero

**The danger of no timeouts:** One slow upstream service causes your threads to hang forever, exhausting your thread pool, bringing down your entire service.

```python
# Always set timeouts on external calls
import requests

# Tuple: (connection_timeout, read_timeout)
response = requests.get(
    "https://api.payment.com/charge",
    timeout=(3, 10)  # 3s to connect, 10s to read
)
```

**Timeout hierarchy**

```
User's browser timeout (30s)
    └── API Gateway timeout (25s)
            └── Service A timeout (20s)
                    └── Service B timeout (15s)
                            └── DB query timeout (10s)
```

**Rule:** Each layer's timeout < the caller's timeout. This ensures the inner layer fails first, giving the outer layer time to handle it gracefully.

---

## Rate Limiting: Protecting Your System

Rate limiting prevents any single client from overwhelming your system.

### Token Bucket Algorithm

```
Bucket has N tokens.
Each request consumes 1 token.
Tokens refill at rate R/second.

Request arrives → tokens available? → yes: process, consume token → no: reject (429)
```

Allows bursts up to bucket size. Good for: APIs with burst tolerance.

### Leaky Bucket Algorithm

```
Requests enter a queue (bucket). Queue drains at fixed rate.
Queue full → new requests dropped.
```

Smooths traffic to a constant rate. No bursts allowed. Good for: metered APIs.

### Fixed Window Counter Algorithm

```
Window: 0–60s → max 100 requests
At second 59: user sends request #100 → OK
At second 61: counter resets → user sends 100 more immediately

Problem: user can send 200 requests in 2 seconds across the boundary
```

### Sliding Window Log Algorithm

Track exact timestamps of all requests. Count requests in past 60 seconds.

```
Timestamps: [59.1, 59.3, 59.7, 59.9, 60.1, 60.4]
At 60.5: count in window [0.5–60.5] = 4 → OK

Accurate but memory-intensive (store every timestamp).
```

### Sliding Window Counter Algorithm (best practical choice)

```
current_window_count + (previous_window_count × overlap_percent)

If: prev_count=84, cur_count=36, overlap=70%
Estimated = 36 + 84×0.7 = 94.8 → under 100 → allow
```

Good balance of accuracy and memory efficiency.

---

## Graceful Degradation

**Story:** Netflix is having a problem with its recommendation engine. Instead of returning an error to users, it shows "Popular movies in your region" — a simpler, always-available fallback. The page still loads, just with less personalization.

**Core principle:** When a non-critical component fails, degrade gracefully — show something useful rather than an error.

### Strategies

| Failure                     | Bad response       | Graceful degradation                                    |
| --------------------------- | ------------------ | ------------------------------------------------------- |
| Recommendation service down | Error 500          | Show "Popular in your region"                           |
| Search service slow         | Timeout + error    | Show cached results from 1 hour ago                     |
| Payment service down        | "Error processing" | "We're experiencing issues. Try again in a few minutes" |
| Image CDN failing           | Broken images      | Show placeholder icons                                  |
| Analytics service down      | Log loss           | Drop analytics silently — user unaffected               |

### Feature flags

Turn features on/off without deployment:

```python
def show_recommendations(user_id):
    if feature_flag("recommendations_enabled"):
        try:
            return recommendation_service.get(user_id)
        except Exception:
            return popular_items()  # fallback
    return popular_items()          # feature disabled globally
```

**Tools:** LaunchDarkly, Flagsmith, AWS AppConfig

---

## Health Checks and Monitoring

Your system can't fix what it can't detect.

**Health check types**

**Shallow health check:** Is the process running?

```
GET /health → 200 OK  (just proves server is alive)
```

**Deep health check:** Are all dependencies working?

```
GET /health/deep →
{
  "status": "degraded",
  "checks": {
    "database": "ok",
    "redis": "ok",
    "payment_service": "failing",
    "search": "ok"
  }
}
```

**Important:** Don't route real traffic based on deep health checks — a failing non-critical dependency shouldn't remove a server from the load balancer pool.

**The four golden signals (Google SRE)**

| Signal         | What to monitor                   | Alert when              |
| -------------- | --------------------------------- | ----------------------- |
| **Latency**    | Request duration (p50, p99, p999) | p99 > SLA threshold     |
| **Traffic**    | Requests per second               | Anomalous spike or drop |
| **Errors**     | Error rate (5xx, 4xx)             | Error rate > 1%         |
| **Saturation** | CPU, memory, disk, queue depth    | > 80% utilization       |

---

## Flashcards

**Q: What is the circuit breaker pattern?**

> A resilience pattern that stops calling a failing service (OPEN state) to prevent cascading failures. After a timeout, it tests with one request (HALF-OPEN) before returning to normal (CLOSED).

**Q: What is exponential backoff with jitter?**

> Retry with increasing delays (2^attempt × base) plus random jitter to prevent all clients retrying simultaneously.

**Q: What is the bulkhead pattern?**

> Isolating components into separate resource pools so failure in one doesn't exhaust resources for others.

**Q: What are the four golden signals?**

> Latency, Traffic, Errors, Saturation.

**Q: What is the difference between active-passive and active-active redundancy?**

> Active-passive: one handles traffic, standby waits (failover takes time). Active-active: both handle traffic simultaneously (zero failover time).

**Q: What is graceful degradation?**

> When a non-critical component fails, the system continues with reduced functionality rather than returning an error.

**Q: How do you design for failure?**

> Framework answer:
>
> 1. **Redundancy:** Every critical component is replicated. No single points of failure.
> 2. **Circuit breakers:** Downstream failures don't cascade. Fast fail with fallback.
> 3. **Retry with backoff and jitter:** Transient failures are automatically retried without thundering herd.
> 4. **Timeouts everywhere:** No hanging threads. Each call has a deadline.
> 5. **Bulkheads:** Critical and non-critical paths are isolated.
> 6. **Graceful degradation:** Non-critical features fail silently; core functionality continues.
> 7. **Health checks and monitoring:** Detect failures fast. MTTR depends on detection time.

**Q: What is a SPOF (Single Point of Failure) checklist?**

> For every component in your design: "What happens if this dies?"
>
> - Single app server → add LB + multiple servers
> - Single DB → primary-replica + automatic failover
> - Single cache node → Redis Cluster or Sentinel
> - Single load balancer → active-passive LB pair
> - Single datacenter → multi-AZ or multi-region
