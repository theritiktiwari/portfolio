---
title: "Design Patterns Every Engineer Should Know"
description: "Master essential software design patterns including Singleton, Factory, Builder, Strategy, Observer, Decorator, Adapter, Proxy, Command, and Template Method with practical examples and interview insights."
pubDate: 2026-07-11T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-patterns.avif
tags: ["system-design", "design-patterns", "low-level-design", "software-engineering"]
featured: false
draft: false
series:
    name: "System Design"
    part: 15
---

## The Story: Proven City Blueprints

City architects don't reinvent the concept of a roundabout every time they design an intersection. They apply proven patterns — patterns that solve known problems reliably.

Design patterns are proven solutions to recurring software design problems. They're not code to copy — they're templates for thinking. Gang of Four (GoF) published 23 patterns in 1994. You need ~10 cold in your head for interviews.

---

## Creational Patterns — How Objects Are Created

### Singleton

**Ensure only one instance of a class exists.**

```python
class DatabaseConnectionPool:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:  # Thread-safe
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._connections = []
                    cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        for _ in range(10):
            self._connections.append(create_db_connection())

    def get_connection(self):
        return self._connections.pop()

    def return_connection(self, conn):
        self._connections.append(conn)

# Usage — always the same instance:
pool1 = DatabaseConnectionPool()
pool2 = DatabaseConnectionPool()
assert pool1 is pool2  # True
```

**Use when:** Shared resource (config, connection pool, logger, thread pool).  
**Interview warning:** Singleton = global state. Makes testing hard. Prefer dependency injection in modern code. But know the pattern cold — it appears in every LLD interview.

---

### Factory Method

**Create objects without specifying the exact class.**

```python
from abc import ABC, abstractmethod

class Notification(ABC):
    @abstractmethod
    def send(self, message: str, recipient: str) -> None: pass

class EmailNotification(Notification):
    def send(self, message, recipient):
        print(f"Email to {recipient}: {message}")

class SMSNotification(Notification):
    def send(self, message, recipient):
        print(f"SMS to {recipient}: {message}")

class PushNotification(Notification):
    def send(self, message, recipient):
        print(f"Push to device {recipient}: {message}")

class NotificationFactory:
    @staticmethod
    def create(notification_type: str) -> Notification:
        types = {
            "email": EmailNotification,
            "sms": SMSNotification,
            "push": PushNotification,
        }
        cls = types.get(notification_type)
        if not cls:
            raise ValueError(f"Unknown notification type: {notification_type}")
        return cls()

# Usage:
factory = NotificationFactory()
notifier = factory.create("email")
notifier.send("Your order shipped!", "contact@ritiktiwari.com")
```

**Use when:** You don't know at compile time which exact class to instantiate. Runtime configuration determines the type.

---

### Builder

**Construct complex objects step by step.**

```python
from dataclasses import dataclass, field
from typing import Optional, List

@dataclass
class QueryBuilder:
    _table: str = ""
    _conditions: List[str] = field(default_factory=list)
    _columns: List[str] = field(default_factory=list)
    _limit: Optional[int] = None
    _offset: Optional[int] = None
    _order_by: Optional[str] = None

    def select(self, *columns: str) -> 'QueryBuilder':
        self._columns = list(columns)
        return self  # returns self for chaining

    def from_table(self, table: str) -> 'QueryBuilder':
        self._table = table
        return self

    def where(self, condition: str) -> 'QueryBuilder':
        self._conditions.append(condition)
        return self

    def limit(self, n: int) -> 'QueryBuilder':
        self._limit = n
        return self

    def order_by(self, column: str) -> 'QueryBuilder':
        self._order_by = column
        return self

    def build(self) -> str:
        cols = ", ".join(self._columns) if self._columns else "*"
        sql = f"SELECT {cols} FROM {self._table}"
        if self._conditions:
            sql += " WHERE " + " AND ".join(self._conditions)
        if self._order_by:
            sql += f" ORDER BY {self._order_by}"
        if self._limit:
            sql += f" LIMIT {self._limit}"
        return sql

# Usage — readable, fluent API:
query = (QueryBuilder()
    .select("id", "name", "email")
    .from_table("users")
    .where("created_at > '2024-01-01'")
    .where("status = 'active'")
    .order_by("created_at DESC")
    .limit(20)
    .build())
# SELECT id, name, email FROM users WHERE created_at > '2024-01-01'
#   AND status = 'active' ORDER BY created_at DESC LIMIT 20
```

**Use when:** Object has many optional parameters. Avoids constructor with 12 arguments. Enables readable, fluent APIs.

---

## Structural Patterns — How Objects Are Composed

### Adapter

**Make incompatible interfaces work together.**

```python
# Third-party payment library with its own interface
class StripeAPI:
    def charge_card(self, card_number: str, amount_cents: int, currency: str) -> dict:
        return {"status": "success", "charge_id": "ch_abc123"}

# Your application expects this interface:
class PaymentGateway(ABC):
    @abstractmethod
    def process_payment(self, amount: float, card: str) -> bool: pass

# Adapter bridges the two:
class StripeAdapter(PaymentGateway):
    def __init__(self):
        self._stripe = StripeAPI()

    def process_payment(self, amount: float, card: str) -> bool:
        result = self._stripe.charge_card(
            card_number=card,
            amount_cents=int(amount * 100),  # adapter converts float → cents
            currency="INR"
        )
        return result["status"] == "success"

# Your code works with the interface it knows:
def checkout(gateway: PaymentGateway, amount: float, card: str) -> bool:
    return gateway.process_payment(amount, card)

checkout(StripeAdapter(), 599.0, "4111111111111111")
```

**Use when:** Integrating with third-party libraries, legacy code, or external services that have incompatible interfaces.

---

### Decorator

**Add behavior to objects dynamically without modifying the class.**

```python
from functools import wraps
import time, logging

# Base component
class DataService:
    def fetch_user(self, user_id: int) -> dict:
        return {"id": user_id, "name": "Ritik"}

# Decorator adds caching:
class CachedDataService:
    def __init__(self, service: DataService, cache):
        self._service = service
        self._cache = cache

    def fetch_user(self, user_id: int) -> dict:
        cached = self._cache.get(f"user:{user_id}")
        if cached:
            return cached
        result = self._service.fetch_user(user_id)
        self._cache.set(f"user:{user_id}", result, ttl=300)
        return result

# Decorator adds logging:
class LoggedDataService:
    def __init__(self, service):
        self._service = service

    def fetch_user(self, user_id: int) -> dict:
        logger.info(f"Fetching user {user_id}")
        start = time.time()
        result = self._service.fetch_user(user_id)
        logger.info(f"Fetched in {time.time()-start:.3f}s")
        return result

# Stack decorators — order matters:
service = LoggedDataService(
    CachedDataService(
        DataService(),
        cache=redis_cache
    )
)
service.fetch_user(42)  # logs → checks cache → fetches if miss → logs duration
```

**Use when:** Cross-cutting concerns (logging, caching, auth) that shouldn't pollute the core class. Python's `@decorator` syntax is this pattern.

---

### Proxy

**Provide a placeholder that controls access to another object.**

```python
class ExpensiveImageLoader:
    def __init__(self, url: str):
        self.url = url
        self._data = self._load()  # loads immediately — expensive

    def _load(self) -> bytes:
        print(f"Loading image from {self.url}...")  # simulate expensive I/O
        return b"image_data"

    def display(self) -> None:
        print(f"Displaying image: {len(self._data)} bytes")

# Lazy proxy — only loads when needed:
class LazyImageProxy:
    def __init__(self, url: str):
        self.url = url
        self._loader = None  # not loaded yet

    def display(self) -> None:
        if self._loader is None:
            self._loader = ExpensiveImageLoader(self.url)  # load on demand
        self._loader.display()

# Images are only loaded when display() is called:
images = [LazyImageProxy(url) for url in image_urls]  # no loading yet
images[0].display()  # only this one loads
```

**Types:** Lazy (defer creation), Protection (access control), Remote (local facade for remote service), Cache (cache results).

---

## Behavioral Patterns — How Objects Interact

### Strategy

**Define a family of algorithms and make them interchangeable.**

```python
from abc import ABC, abstractmethod

class SortStrategy(ABC):
    @abstractmethod
    def sort(self, data: list) -> list: pass

class QuickSort(SortStrategy):
    def sort(self, data: list) -> list:
        # quicksort implementation
        return sorted(data)

class MergeSort(SortStrategy):
    def sort(self, data: list) -> list:
        # mergesort implementation
        return sorted(data)

class BubbleSort(SortStrategy):
    def sort(self, data: list) -> list:
        # bubblesort — for small lists or educational use
        return sorted(data)

class Sorter:
    def __init__(self, strategy: SortStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: SortStrategy) -> None:
        self._strategy = strategy  # swap at runtime

    def sort(self, data: list) -> list:
        return self._strategy.sort(data)

# Usage:
sorter = Sorter(QuickSort())
result = sorter.sort([3, 1, 4, 1, 5])

# Switch strategy at runtime based on data size:
if len(data) < 10:
    sorter.set_strategy(BubbleSort())
else:
    sorter.set_strategy(QuickSort())
```

**Use when:** Multiple algorithms for the same problem. Algorithm selection happens at runtime.  
**Real-world:** Payment strategies, discount strategies, routing algorithms, compression algorithms.

---

### Observer

**Objects subscribe to events and are notified automatically.**

```python
from abc import ABC, abstractmethod
from typing import List

class Event:
    def __init__(self, event_type: str, data: dict):
        self.event_type = event_type
        self.data = data

class EventListener(ABC):
    @abstractmethod
    def on_event(self, event: Event) -> None: pass

class EventBus:
    def __init__(self):
        self._listeners: dict[str, List[EventListener]] = {}

    def subscribe(self, event_type: str, listener: EventListener) -> None:
        self._listeners.setdefault(event_type, []).append(listener)

    def unsubscribe(self, event_type: str, listener: EventListener) -> None:
        self._listeners.get(event_type, []).remove(listener)

    def publish(self, event: Event) -> None:
        for listener in self._listeners.get(event.event_type, []):
            listener.on_event(event)

class EmailNotifier(EventListener):
    def on_event(self, event: Event) -> None:
        if event.event_type == "order_placed":
            send_email(event.data['user_email'], "Order confirmed!")

class InventoryUpdater(EventListener):
    def on_event(self, event: Event) -> None:
        if event.event_type == "order_placed":
            decrement_stock(event.data['product_id'], event.data['quantity'])

class AnalyticsTracker(EventListener):
    def on_event(self, event: Event) -> None:
        track(event.event_type, event.data)

# Wire up:
bus = EventBus()
bus.subscribe("order_placed", EmailNotifier())
bus.subscribe("order_placed", InventoryUpdater())
bus.subscribe("order_placed", AnalyticsTracker())

# When order is placed:
bus.publish(Event("order_placed", {
    "user_email": "contact@ritiktiwari.com",
    "product_id": "SKU-001",
    "quantity": 2
}))
# All three listeners notified automatically
```

---

### Command

**Encapsulate a request as an object — enabling undo, queuing, logging.**

```python
from abc import ABC, abstractmethod

class Command(ABC):
    @abstractmethod
    def execute(self) -> None: pass

    @abstractmethod
    def undo(self) -> None: pass

class TypeCommand(Command):
    def __init__(self, editor, text):
        self.editor = editor
        self.text = text

    def execute(self):
        self.editor.insert(self.text)

    def undo(self):
        self.editor.delete(len(self.text))

class CommandHistory:
    def __init__(self):
        self._history: List[Command] = []

    def execute(self, command: Command) -> None:
        command.execute()
        self._history.append(command)

    def undo(self) -> None:
        if self._history:
            command = self._history.pop()
            command.undo()
```

**Use when:** Undo/redo, transaction logs, job queues, macro recording.

---

### Template Method

**Define the skeleton of an algorithm; subclasses fill in specific steps.**

```python
from abc import ABC, abstractmethod

class DataProcessor(ABC):
    # Template method — fixed algorithm structure
    def process(self, filename: str) -> None:
        data = self.read_data(filename)      # step 1
        cleaned = self.clean_data(data)      # step 2
        result = self.process_data(cleaned)  # step 3
        self.save_result(result)             # step 4

    @abstractmethod
    def read_data(self, filename: str): pass

    def clean_data(self, data):  # default implementation — may be overridden
        return [row for row in data if row]

    @abstractmethod
    def process_data(self, data): pass

    def save_result(self, result):  # default — saves to file
        with open("output.json", "w") as f:
            json.dump(result, f)

class CSVProcessor(DataProcessor):
    def read_data(self, filename):
        return csv.read(filename)

    def process_data(self, data):
        return {"count": len(data), "rows": data}

class JSONProcessor(DataProcessor):
    def read_data(self, filename):
        return json.load(open(filename))

    def process_data(self, data):
        return {"keys": list(data.keys())}
```

---

## Pattern Selection Guide

| Situation                                   | Pattern         |
| ------------------------------------------- | --------------- |
| "Only one instance should exist"            | Singleton       |
| "Create objects without knowing exact type" | Factory Method  |
| "Build complex objects step by step"        | Builder         |
| "Make incompatible interfaces work"         | Adapter         |
| "Add behavior without modifying class"      | Decorator       |
| "Family of interchangeable algorithms"      | Strategy        |
| "Notify multiple objects of events"         | Observer        |
| "Undo/redo, command history"                | Command         |
| "Algorithm skeleton, customisable steps"    | Template Method |
| "Control access to an object"               | Proxy           |

---

## Flashcards

**Q: What is the Factory Method pattern?**

> Creates objects without specifying the exact class. A factory decides which subclass to instantiate based on runtime parameters.

**Q: What is the Strategy pattern?**

> Define a family of algorithms, encapsulate each, and make them interchangeable. The algorithm can vary independently from the client.

**Q: What is the difference between Decorator and Proxy?**

> Decorator adds behavior (logging, caching). Proxy controls access (lazy loading, protection, remote). Both wrap an object.

**Q: What is the Builder pattern used for?**

> Constructing complex objects step by step with a fluent API. Avoids constructors with many parameters.

**Q: When is the Observer pattern most useful?**

> When one event should trigger multiple independent reactions — without the publisher knowing who the subscribers are.

**Q: What does the Command pattern enable beyond simple method calls?**

> Undo/redo, logging, queueing, and macro recording — because the request is encapsulated as an object.
