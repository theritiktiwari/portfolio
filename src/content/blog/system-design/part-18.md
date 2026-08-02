---
title: "Reliability Engineering, Fault Tolerance & Disaster Recovery"
description: "Master reliability engineering fundamentals including SLI, SLO, SLA, error budgets, fault tolerance patterns, disaster recovery strategies, chaos engineering, and complete system design reliability frameworks."
pubDate: 2026-08-02T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-engineering.avif
tags: ["system-design", "reliability", "fault-tolerance", "disaster-recovery", "chaos-engineering"]
featured: false
draft: false
series:
    name: "System Design"
    part: 18
---

## The Story: The City That Cannot Fall

A great city plans for earthquakes, floods, power grid failures, and cyberattacks — not because they're common, but because when they happen, the cost of being unprepared is catastrophic.

Your system will face: hardware failures, software bugs, traffic spikes, DDoS attacks, operator errors, network partitions, and datacenter fires. Reliability is not an accident. It's designed.

This chapter brings everything together into a complete HLD framework.

---

## Reliability Engineering Fundamentals

### SLI, SLO, SLA — The Three Layers of Reliability

```
SLI (Service Level Indicator)
  A specific metric: "99.3% of requests in the past hour returned 2xx in under 200ms"
  → It's measured. It's a fact.

SLO (Service Level Objective)
  The target: "99.9% of requests must return 2xx in under 200ms"
  → It's a goal. Internal. You hold yourself to this.

SLA (Service Level Agreement)
  The contract with customers: "We guarantee 99.9% uptime. Breach = credit."
  → Legal/business. SLA is typically less strict than SLO.

SLO should be stricter than SLA:
  SLA: 99.9%  ← if you breach this, customers get credits
  SLO: 99.95% ← internal alarm fires at 99.95%, giving you buffer
```

### Error Budget

```
SLO: 99.9% = 0.1% allowed failures
Monthly: 0.1% × 2,592,000 seconds = 2,592 seconds ≈ 43 minutes of errors/month

Error budget = the "budget" you have for imperfect reliability.
Spend it on: deployments, experiments, maintenance.

If budget is exhausted → freeze new deployments, focus on reliability.
```

This is Google SRE's framework. Error budgets create alignment between dev (move fast) and ops (keep stable).

---

## Fault Tolerance Patterns (Complete Reference)

### Redundancy at Every Layer

```
Network Layer:
  Multiple network paths
  BGP multipath routing
  Multiple ISPs

Load Balancer Layer:
  Active-passive pair (VRRP)
  Or active-active with DNS

Application Layer:
  Multiple app servers across AZs
  Auto-scaling groups

Cache Layer:
  Redis Sentinel (1 master + 2 replicas, auto-failover)
  Or Redis Cluster (16,384 hash slots, N shards × M replicas)

Database Layer:
  Primary + read replicas
  Multi-AZ deployment (synchronous replica in another AZ)
  Point-in-time recovery backups

Storage Layer:
  S3: 11 nines durability (replication across ≥3 AZs within region)
  Multi-region replication for disaster recovery

Datacenter Layer:
  Multi-AZ (same region, different power/cooling/network)
  Multi-Region (different geography, different disaster zones)
```

### Chaos Engineering

**Definition:** Deliberately injecting failures into production (or staging) to verify your fault tolerance actually works.

**Netflix Chaos Monkey:** Randomly terminates EC2 instances in production during business hours.

**Why production?** Staging doesn't have the same traffic patterns, data volumes, and dependency topology. You need to validate in the environment that matters.

```
Chaos experiment steps:
1. Define steady state: "p99 latency < 200ms, error rate < 0.1%"
2. Hypothesize: "Terminating one API server won't affect steady state"
3. Inject failure: terminate one API server
4. Observe: does steady state hold?
5. Fix if it doesn't. Document if it does.
```

**Common chaos experiments:**

- Terminate random instances
- Introduce network latency (50ms, 500ms) between services
- Drop packets between services (network partition)
- Fill disk
- Kill the database primary (test failover time)
- Kill the cache (test cold-cache fallback)

---

## Disaster Recovery

### RPO and RTO

```
Disaster occurs at T=0

    T=0                    T=RTO
     │                       │
     ▼                       ▼
[Disaster] ──────────────── [System restored]
     │
     │← RPO →│
[Last backup]
     T=-RPO

RPO (Recovery Point Objective):
  Maximum acceptable data loss.
  RPO = 1 hour → you may lose up to 1 hour of data
  RPO = 0 → zero data loss (synchronous replication required)

RTO (Recovery Time Objective):
  Maximum acceptable downtime after a disaster.
  RTO = 1 hour → system must be restored within 1 hour
  RTO = 0 → zero downtime (hot standby required)
```

### DR Strategies (cost vs recovery speed)

| Strategy             | Description                                          | RTO        | RPO       | Cost |
| -------------------- | ---------------------------------------------------- | ---------- | --------- | ---- |
| **Backup & restore** | Periodic snapshots. Restore from backup on failure.  | Hours–days | Hours     | $    |
| **Pilot light**      | Core infrastructure ready, minimal services running  | ~1 hour    | Minutes   | $$   |
| **Warm standby**     | Scaled-down prod environment running, ready to scale | Minutes    | Seconds   | $$$  |
| **Active-active**    | Full prod in multiple regions, both serving traffic  | Near zero  | Near zero | $$$$ |

**Active-active** is expensive but required for: payment gateways, stock exchanges, critical healthcare, telco infrastructure.

---

## A Complete HLD: Design a Notification System

Let's put everything together by designing a notification system (used by Uber, LinkedIn, WhatsApp for push notifications, emails, SMS).

### Step 1: Requirements

**Functional:**

- Send notifications via: push (iOS/Android), email, SMS
- Support different notification types: transactional (immediate), marketing (scheduled/batched)
- Users can configure preferences (opt-out of marketing, choose channels)
- Delivery confirmation tracking
- Rate limiting per user (don't spam)

**Non-functional:**

- Scale: 10M notifications/day initially, 1B/day target
- Latency: transactional < 1 second (OTP, order confirmation)
- Marketing: can be delayed (batch processing acceptable)
- Availability: 99.99% (notification failure is a bad user experience)

### Step 2: Estimation

```
10M notifications/day ÷ 86,400 = ~115 notifications/second average
Peak: 3× = ~350/second
1B/day = 11,574/second

Push notifications: 60% of total
Email: 30%
SMS: 10%

Storage:
  Each notification event: ~500 bytes
  10M/day × 500B = 5GB/day
  1 year: ~1.8TB
```

### Step 3: API Design

```
# Internal API (called by other services)
POST /notifications/send
{
  "user_id": "42",
  "type": "transactional",   // or "marketing"
  "template_id": "order_confirmed",
  "channels": ["push", "email"],  // or ["auto"] — system picks based on preferences
  "data": { "order_id": "ORD-123", "amount": 599 },
  "priority": "high"  // or "normal", "low"
}

# User preference API
GET  /users/{id}/notification-preferences
PUT  /users/{id}/notification-preferences
{
  "marketing_email": false,
  "marketing_push": true,
  "transactional_sms": true
}

# Tracking API
GET /notifications/{id}/status
→ { "status": "delivered", "channel": "push", "delivered_at": "..." }
```

### Step 4: High-Level Architecture

```
[Other Services] → [Notification API Service]
                         ↓
                  [User Preference DB]   (check opt-in/opt-out)
                         ↓
                  [Rate Limiter]         (Redis: max N per user per hour)
                         ↓
                  [Priority Queue]       (Kafka topics by priority)
                    /         \
             [High Priority]  [Low Priority]
                    ↓               ↓
              [Workers]         [Workers]
              (immediate)       (batched)
                    ↓
          ┌─────────────────────────┐
          ↓          ↓              ↓
   [Push Worker] [Email Worker] [SMS Worker]
        ↓              ↓              ↓
  [FCM/APNs]    [SendGrid/SES]  [Twilio/SNS]
  (Firebase)                          ↓
       ↓                        [Delivery DB]  (tracking)
  [Delivery DB]
```

### Step 5: Deep Dives

#### Handling delivery failures

```python
# Worker pseudocode
async def process_notification(notification):
    try:
        result = await send_push(notification)
        await db.update_status(notification.id, "delivered")
    except TemporaryError as e:
        # Retry with exponential backoff
        retry_count = notification.retry_count + 1
        if retry_count < 5:
            delay = 2 ** retry_count  # 2, 4, 8, 16, 32 seconds
            await queue.requeue(notification, delay=delay, retry_count=retry_count)
        else:
            await db.update_status(notification.id, "failed")
            await fallback_channel(notification)  # try email if push failed
    except PermanentError:
        # Invalid device token — remove from registry
        await db.update_status(notification.id, "failed_permanent")
        await device_registry.remove(notification.device_token)
```

#### Template rendering

```python
# Template stored in DB:
# "Your order {order_id} has been confirmed! Total: ₹{amount}"

def render_template(template_id: str, data: dict, locale: str = "en") -> str:
    template = template_cache.get(f"{template_id}:{locale}")
    if not template:
        template = db.get_template(template_id, locale)
        template_cache.set(f"{template_id}:{locale}", template, ttl=3600)
    return template.format(**data)
```

#### Deduplication

```python
# Problem: message queue may deliver twice (at-least-once)
# Solution: idempotency key

def process_notification(notification):
    # Check if already processed
    idempotency_key = f"notif:{notification.id}"
    if redis.set(idempotency_key, 1, nx=True, ex=86400):
        # nx=True means "only set if not exists"
        # Successfully acquired lock — process
        send_and_track(notification)
    else:
        # Already processed — skip
        logger.info(f"Duplicate notification {notification.id}, skipping")
```

### Step 6: Bottlenecks and Solutions

| Bottleneck                          | At what scale    | Solution                                       |
| ----------------------------------- | ---------------- | ---------------------------------------------- |
| Single Notification API server      | 10K RPS          | Horizontal scaling + LB                        |
| Single Kafka partition              | 100K msg/s       | Partition by user_id (parallelism)             |
| Single worker pool                  | 10K deliveries/s | Auto-scaling worker pool (K8s HPA)             |
| Delivery DB writes                  | 10K writes/s     | Cassandra (designed for high write throughput) |
| Template cache misses               | At cold start    | Pre-warm cache on deploy                       |
| 3rd party rate limits (FCM, Twilio) | > their limits   | Multiple API keys, account rotation            |

### Step 7: Trade-offs

> This design prioritises throughput and availability over strict ordering. Marketing notifications may arrive slightly out of order — acceptable. Transactional notifications (OTP, order confirmation) go through a high-priority Kafka topic with fewer consumers to ensure fast delivery. We use eventual consistency for delivery tracking — there may be a few seconds' lag before the status dashboard updates. This is acceptable; users don't watch delivery logs in real time.

---

## The Complete System Design Checklist

Use this for every design problem:

### Requirements checklist

- [ ] Functional requirements — 3–5 core features
- [ ] Scale — DAU, peak RPS, data volume
- [ ] Latency — p99 targets per endpoint
- [ ] Availability — number of nines
- [ ] Consistency — strong or eventual, per data type
- [ ] Out of scope — explicitly stated

### Architecture checklist

- [ ] DNS → Load balancer → App servers (stateless)
- [ ] Cache layer (Redis) for hot data
- [ ] Database with replication
- [ ] CDN for static assets
- [ ] Message queue for async operations
- [ ] No single points of failure identified

### Reliability checklist

- [ ] Circuit breakers on downstream calls
- [ ] Retries with exponential backoff + jitter
- [ ] Timeouts on all external calls
- [ ] Graceful degradation for non-critical features
- [ ] Health checks (liveness + readiness)
- [ ] Monitoring — four golden signals

### Data checklist

- [ ] Primary key strategy (UUID or Snowflake)
- [ ] Indexes on frequently queried columns
- [ ] Soft deletes for important data
- [ ] Backups and retention policy
- [ ] Encryption at rest and in transit

---

## Flashcards

**Q: What is the difference between SLI, SLO, and SLA?**

> SLI = the measured metric. SLO = internal target. SLA = contractual commitment with customers. SLO stricter than SLA.

**Q: What is an error budget?**

> The allowed failure budget = (1 - SLO) × time period. When exhausted, freeze deployments and focus on reliability.

**Q: What is RPO vs RTO?**

> RPO = max acceptable data loss (time). RTO = max acceptable downtime after disaster. Both drive DR strategy and cost.

**Q: What is chaos engineering?**

> Deliberately injecting failures into production to verify fault tolerance. Netflix Chaos Monkey is the famous example.

**Q: What is the active-active DR strategy?**

> Full production runs in multiple regions simultaneously, both serving traffic. Zero RTO and RPO. Most expensive.

**Q: What four reliability metrics does Google SRE define as "golden signals"?**

> Latency, Traffic, Errors, Saturation.
