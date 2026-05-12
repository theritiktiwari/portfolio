---
title: "Message Queues & Async Architecture"
description: "Learn asynchronous systems, message queues, Kafka, RabbitMQ, event-driven architecture, retries, dead letter queues, and distributed workflows."
pubDate: 2026-05-15T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-queue.avif
tags: ["system-design", "backend", "kafka", "rabbitmq", "microservices", "distributed-systems"]
featured: false
draft: false
series:
    name: "System Design"
    part: 5
---

## The Story: The City Post Office

You need to send 10,000 birthday cards. You don't stand at the post box and hand-deliver each one personally. You drop them at the post office. Postal workers process them at their own pace. You go home. You and the postal workers are **decoupled** — you don't wait for them, and they don't need you present to do their work.

That post office is a **message queue**.

---

## Synchronous vs Asynchronous

**Synchronous (the phone call)**

```
[User: "Signup"] → [Server] → creates account
                            → sends welcome email          ← waits...
                            → generates avatar             ← waits...
                            → logs to analytics            ← waits...
                            → charges trial credit         ← waits...
                            ← "Success!" (after 3 seconds)
```

Problems:

- User waits for ALL operations — slow experience
- Any step fails → entire signup fails
- Email server slow? Your signup is slow.

**Asynchronous (the post office)**

```
[User: "Signup"] → [Server] → creates account → "Success!" (50ms)
                            → Queue: { send_email, gen_avatar, log_analytics, charge_trial }
                                      ↓
                                [Workers process independently in background]
```

User gets fast response. Background work happens decoupled from user flow.

---

## What is a Message Queue?

A **message queue** is a durable buffer between producers (who create work) and consumers (who do the work).

```
Producer → [Message Queue] → Consumer(s)
```

**Three properties:**

1. **Decoupling:** Producer and consumer don't need to be running simultaneously
2. **Durability:** Messages survive crashes (persisted to disk)
3. **Load levelling:** Burst of 10,000 requests → queue absorbs spike → consumers process at steady rate

**Message lifecycle**

```
1. Producer publishes message → Queue stores it
2. Consumer polls or receives message
3. Consumer processes message
4. Consumer ACKs (acknowledges) success → Queue deletes message
5. If consumer dies before ACK → message becomes visible again → another consumer picks it up
```

This at-least-once delivery guarantee is fundamental.

---

## Messaging Patterns

### Point-to-Point (Work Queue)

One producer. One or more competing consumers. Each message processed by exactly one consumer.

```
Producer → [Queue] → Consumer A (processes msg 1)
                   → Consumer B (processes msg 2)
                   → Consumer C (processes msg 3)
```

**Use when:** Distributing work — resize images, process payments, send emails.

---

### Publish-Subscribe (Pub/Sub)

One producer. Many subscribers. Each subscriber receives a copy of every message.

```
[Order Service] publishes "order_placed" event
       ↓
[Email Service]      ← receives copy →  sends confirmation email
[Inventory Service]  ← receives copy →  decrements stock
[Analytics Service]  ← receives copy →  records conversion
[Shipping Service]   ← receives copy →  creates shipping label
```

**Use when:** Event-driven architecture — one event triggers many independent actions.

---

### Dead Letter Queue (DLQ)

Messages that fail processing after N retries go to a DLQ for inspection.

```
[Queue] → Consumer fails 3 times → [Dead Letter Queue]
                                         ↓
                                   Developer inspects, fixes, replays
```

**Critical for production systems** — without DLQ, you lose visibility into what failed.

---

### Request-Reply (RPC over Queue)

```
[Service A] → [Request Queue] → [Service B] processes
                                      ↓
[Service A] ← [Reply Queue]   ← [Service B] replies

Service A includes "reply_to" and "correlation_id" in message header
```

Used for async RPC where the caller eventually needs the result.

---

## RabbitMQ vs Apache Kafka

The two dominant players. Fundamentally different philosophies.

### RabbitMQ — The Smart Router

**Mental model:** A postal sorting facility. Messages arrive, get routed to the right destination, processed, and deleted when consumed.

- **Push model:** Broker pushes messages to consumers
- **Message lifecycle:** Message deleted after consumer ACKs
- **Routing:** Sophisticated exchange types (direct, topic, fanout, headers)
- **Use when:** Task queues, RPC, complex routing logic, per-message processing

**When message is consumed, it's gone** — you can't replay history.

### Apache Kafka — The Append-Only Log

**Mental model:** A city newspaper archive. Issues are published, stored permanently (or for a configurable period), and any reader can start reading from any point in history.

- **Pull model:** Consumers poll the log at their own pace
- **Message lifecycle:** Messages retained for configurable period (default 7 days)
- **Ordering:** Guaranteed within a partition
- **Use when:** Event streaming, audit logs, data pipelines, event sourcing, multi-consumer replay

**Consumers track their own "offset" (position in the log)** — Kafka doesn't track which messages have been consumed per-consumer. This enables replay and multiple independent consumer groups.

|                   | RabbitMQ                   | Apache Kafka                      |
| ----------------- | -------------------------- | --------------------------------- |
| Mental model      | Message queue (push)       | Distributed log (pull)            |
| Throughput        | High (50k+ msg/s per node) | Very high (1M+ msg/s)             |
| Message retention | Until consumed             | Configurable (days, forever)      |
| Replay history    | No                         | Yes (from any offset)             |
| Ordering          | Per-queue                  | Per-partition                     |
| Routing           | Sophisticated (exchanges)  | By topic/partition only           |
| Consumer model    | Push                       | Pull                              |
| Best for          | Task queues, RPC           | Event streaming, audit, analytics |

---

## Kafka Deep Dive

Kafka is at the core of modern data infrastructure. Worth understanding deeply.

**Core concepts**

```
Topic: a named stream of messages (like "order_placed", "user_signup")

Partition: a topic is split into N partitions (for parallelism)
           each partition is an ordered, immutable log

Offset: the position of a message within a partition (sequential integer)

Consumer Group: a set of consumers that collectively consume a topic
                each partition assigned to exactly one consumer in the group
                → horizontal scaling of consumers
```

**How partitioning enables parallelism**

```
Topic: "orders" with 4 partitions

Partition 0: msg@offset0, msg@offset1, msg@offset2...
Partition 1: msg@offset0, msg@offset1...
Partition 2: msg@offset0...
Partition 3: msg@offset0...

Consumer Group A (4 consumers):
  Consumer A0 → reads Partition 0
  Consumer A1 → reads Partition 1
  Consumer A2 → reads Partition 2
  Consumer A3 → reads Partition 3
```

**Rule:** Max parallelism = number of partitions. Adding more consumers than partitions = some consumers idle.

**Message ordering in Kafka**

Ordering is guaranteed only within a partition.

```python
# To ensure all messages for order_id 12345 go to same partition:
producer.send(
    topic="orders",
    key=str(order_id),  # same key → same partition → guaranteed order
    value=order_data
)
```

Use a meaningful partition key: `user_id`, `order_id`, `device_id`. Messages with the same key always go to the same partition → ordering preserved for that entity.

**Kafka consumer offset management**

```python
from confluent_kafka import Consumer

consumer = Consumer({'group.id': 'order-processor', 'auto.offset.reset': 'earliest'})
consumer.subscribe(['orders'])

while True:
    msg = consumer.poll(timeout=1.0)
    if msg:
        process_order(msg.value())
        consumer.commit()  # commit offset — marks this message as processed
        # If you crash before commit → message reprocessed → at-least-once delivery
        # Enable idempotent processing to handle duplicates
```

---

## Exactly-Once, At-Least-Once, At-Most-Once

This is a critical concept for interviews.

### At-Most-Once (fire and forget)

```
Producer sends → Consumer receives → ACK before processing
                                   → Consumer crashes
                                   → Message lost forever
```

**Guarantee:** Message delivered 0 or 1 time. No duplicates. Data loss possible.  
**Use when:** Metrics, logs where occasional loss is acceptable.

### At-Least-Once (the safe default)

```
Producer sends → Consumer receives → processes → crashes before ACK
                                   → Broker redelivers
                                   → Consumer processes AGAIN (duplicate!)
```

**Guarantee:** Message delivered 1 or more times. No data loss. Duplicates possible.  
**Use when:** Most scenarios. Handle duplicates with idempotency.

**Idempotency:** Processing the same message twice produces the same result as processing it once.

```python
def process_payment(payment_id, amount):
    # Check if already processed
    if db.exists("processed_payment", payment_id):
        return  # idempotent — safe to ignore duplicate

    charge_customer(amount)
    db.insert("processed_payment", payment_id)
```

### Exactly-Once

**Guarantee:** Message delivered exactly once. No loss, no duplicates.  
**Cost:** Significant performance overhead. Requires distributed transaction coordination.

Kafka supports exactly-once semantics (EOS) with `transactional.id` and idempotent producers. Use sparingly — only when business logic demands it (financial transactions, inventory deduction).

---

## Event-Driven Architecture

Events are the backbone of modern microservices.

### Event vs Command

|           | Command                        | Event                                   |
| --------- | ------------------------------ | --------------------------------------- |
| Intent    | "Do this"                      | "This happened"                         |
| Direction | Sent to specific service       | Broadcast to anyone interested          |
| Response  | Expected                       | Not required                            |
| Example   | `SendEmail(user_id, template)` | `UserRegistered(user_id, timestamp)`    |
| Coupling  | Tight (sender knows receiver)  | Loose (sender doesn't know who listens) |

**Events are the right model for microservices** — services emit events about what happened, not instructions about what others should do.

---

### Event sourcing

Instead of storing current state, store the sequence of events that led to that state.

```
Traditional (stores current state):
| user_id | balance |
|---------|---------|
| 42      | 1500    |

Event sourced (stores all events):
| event_id | user_id | type       | amount | timestamp  |
|----------|---------|------------|--------|------------|
| 1        | 42      | deposit    | 2000   | 2024-01-01 |
| 2        | 42      | withdrawal | 300    | 2024-01-05 |
| 3        | 42      | withdrawal | 200    | 2024-01-10 |

Current balance = sum of events = 1500
```

**Benefits:**

- Complete audit trail — you can reconstruct any past state
- Replay events to rebuild projections/views
- Debug production issues by replaying what happened

**Costs:**

- More storage
- Querying current state requires replaying events (mitigated by snapshots)

---

### CQRS (Command Query Responsibility Segregation)

Separate the read model from the write model.

```
Write side:                          Read side:
[Commands] → [Domain Model]          [Queries] → [Read Model (optimized views)]
                ↓                                     ↑
           [Event Store] ─────────────────────────────┘
                                    (events update read models)
```

**Why:** Write model optimized for consistency and business logic. Read model optimized for query patterns (pre-aggregated, denormalized).

**Common with event sourcing** — events from the write side populate read-side projections.

---

## Message Queue Implementation Patterns

### Fan-out pattern

One message → multiple queues → multiple consumers.

```
          [SNS Topic: order_placed]
      ↓               ↓               ↓
[SQS: emails]  [SQS: inventory]   [SQS: analytics]
      ↓               ↓               ↓
[Email Worker] [Inventory Worker] [Analytics Worker]
```

AWS: SNS (pub/sub) + SQS (queue per subscriber) — the standard fan-out pattern.

### Competing consumers pattern

Multiple consumers on one queue. First to pick up a message processes it.

```
  [Queue: resize_images]
    ↓        ↓        ↓
[Worker1][Worker2][Worker3]   ←   scales horizontally
```

Add more workers → more throughput. Remove workers → queue builds up.

### Saga pattern (distributed transactions)

Replaces ACID transactions across services with a sequence of compensating actions.

```
Order saga:
Step 1: Reserve inventory    → success
Step 2: Process payment      → success
Step 3: Create shipment      → FAILS

Compensating actions (run backwards):
Cancel shipment               (no-op, it didn't create)
Refund payment                → run
Release inventory reservation → run
```

Each step publishes an event. On failure, compensating transactions undo previous steps.

Two implementations:

- **Choreography:** Services listen to each other's events (decentralized)
- **Orchestration:** A central saga orchestrator tells each service what to do (centralized)

---

## Flashcards

**Q: When would you use a message queue?**

> Message queues solve three problems: decoupling (producer and consumer evolve independently), load levelling (absorb traffic spikes), and resilience (work not lost if consumer crashes). I'd introduce a queue when: an operation is slow and user doesn't need to wait for it (email sending, image processing), when I need fan-out (one event → multiple services react), or when I need to smooth out write spikes.

**Q: Kafka or RabbitMQ?**

> It depends on the use case. If I need event streaming with replay, audit logs, or multiple independent consumer groups reading the same events at their own pace → Kafka. If I need task queues with complex routing, RPC, or message-level acknowledgment → RabbitMQ. For most microservice event buses in 2024, Kafka is the default choice.

**Q: What is at-least-once delivery and how do you handle it?**

> At-least-once means a message is guaranteed to be delivered but may be delivered more than once if the consumer crashes before acknowledging. I handle this by making consumers idempotent — processing the same message twice produces the same result. Common technique: store processed message IDs and skip duplicates.

**Q: What are the three superpowers of a message queue?**

> Decoupling, load levelling, resilience (messages survive consumer crashes).

**Q: What is the difference between point-to-point and pub/sub?**

> Point-to-point: each message consumed by exactly one consumer. Pub/sub: each subscriber gets a copy of every message.

**Q: What is at-least-once delivery?**

> Message is guaranteed to be delivered but may be delivered more than once. Handle with idempotent consumers.

**Q: What is a Kafka partition and why does it matter?**

> A partition is an ordered, immutable sub-log within a topic. Parallelism = number of partitions. Messages with the same key always go to the same partition, preserving order for that key.

**Q: What is a Dead Letter Queue?**

> A queue where messages go after failing N retries. Enables visibility into failures without losing messages.

**Q: What is the Saga pattern?**

> A way to implement distributed transactions across services using a sequence of local transactions with compensating actions on failure.

**Q: What is CQRS?**

> Command Query Responsibility Segregation — separate the write model (commands) from the read model (queries), each optimized for its purpose.
