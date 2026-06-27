---
title: "Low-Level Design (LLD), OOAD & Design Patterns"
description: "Learn Low-Level Design (LLD), Object-Oriented Analysis and Design (OOAD), UML diagrams, class design, object relationships, design patterns, and interview-ready approaches for common LLD problems."
pubDate: 2026-06-27T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-lld.avif
tags:
    [
        "system-design",
        "low-level-design",
        "object-oriented-design",
        "design-patterns",
        "uml",
        "class-diagram",
        "sequence-diagram",
        "observer-pattern",
        "state-pattern",
        "solid-principles",
    ]
featured: false
draft: false
series:
    name: "System Design"
    part: 13
---

## The Story: Designing a Single Building

- High-Level Design (HLD) is city planning — where roads go, where buildings stand.
- Low-Level Design (LLD) is architectural blueprints — how many rooms, where the wiring runs, how the elevator works.

LLD is about **class design, object relationships, APIs, and algorithms** for a specific module. You're asked to design the internals of one component in enough detail that a developer can implement it without further clarification.

---

## What LLD Covers

| Concern              | Examples                                               |
| -------------------- | ------------------------------------------------------ |
| Class structure      | What classes exist? What are their fields and methods? |
| Object relationships | Inheritance, composition, aggregation                  |
| Design patterns      | How do components interact?                            |
| APIs                 | Method signatures, request/response contracts          |
| Algorithms           | How does the core logic work?                          |
| Database schema      | Table structure for this module                        |
| Sequence flows       | Request lifecycle step by step                         |

LLD interview prompt examples:

- "Design a parking lot system"
- "Design an elevator system"
- "Design a library management system"
- "Design a chess game"
- "Design a vending machine"

---

## Object-Oriented Analysis and Design (OOAD)

OOAD is the process of translating real-world requirements into classes and relationships.

### Step 1: Identify Entities (Nouns)

Read the requirements and extract nouns → potential classes.

**Requirements:** "Design a library system where members can borrow books. Books have authors. Members can reserve books that are currently borrowed. Librarians manage the catalog."

**Nouns extracted:** Library, Member, Book, Author, Reservation, Librarian, Catalog, BorrowRecord

### Step 2: Identify Behaviors (Verbs)

Verbs become methods on the most natural owner class.

| Verb                | Owner class | Method                    |
| ------------------- | ----------- | ------------------------- |
| borrow a book       | Member      | `member.borrow(book)`     |
| return a book       | Member      | `member.return(book)`     |
| reserve a book      | Member      | `member.reserve(book)`    |
| add book to catalog | Librarian   | `librarian.addBook(book)` |
| search catalog      | Library     | `library.search(query)`   |

### Step 3: Define Relationships

```
Relationship types:
IS-A      → Inheritance  (Librarian IS-A Member)
HAS-A     → Composition  (Library HAS-A Catalog)
USES-A    → Association  (Member USES-A Book via borrowing)
```

### Step 4: Design Classes

```python
from enum import Enum
from datetime import datetime, timedelta
from typing import Optional, List

class BookStatus(Enum):
    AVAILABLE = "available"
    BORROWED = "borrowed"
    RESERVED = "reserved"
    LOST = "lost"

class Book:
    def __init__(self, isbn: str, title: str, author: 'Author'):
        self.isbn = isbn
        self.title = title
        self.author = author
        self.status = BookStatus.AVAILABLE
        self.borrow_records: List['BorrowRecord'] = []

    def is_available(self) -> bool:
        return self.status == BookStatus.AVAILABLE

class Author:
    def __init__(self, name: str):
        self.name = name
        self.books: List[Book] = []

class Member:
    MAX_BORROW_LIMIT = 5
    BORROW_DURATION_DAYS = 14

    def __init__(self, member_id: str, name: str, email: str):
        self.member_id = member_id
        self.name = name
        self.email = email
        self.active_borrows: List['BorrowRecord'] = []
        self.reservations: List['Reservation'] = []

    def borrow(self, book: Book) -> 'BorrowRecord':
        if len(self.active_borrows) >= self.MAX_BORROW_LIMIT:
            raise Exception("Borrow limit reached")
        if not book.is_available():
            raise Exception("Book not available")

        record = BorrowRecord(
            member=self,
            book=book,
            due_date=datetime.now() + timedelta(days=self.BORROW_DURATION_DAYS)
        )
        book.status = BookStatus.BORROWED
        self.active_borrows.append(record)
        return record

    def return_book(self, book: Book) -> None:
        record = next((r for r in self.active_borrows if r.book == book), None)
        if not record:
            raise Exception("No active borrow for this book")
        record.return_date = datetime.now()
        self.active_borrows.remove(record)
        book.status = BookStatus.AVAILABLE
        # Notify first reservation holder if any
        self._fulfill_reservation(book)

    def _fulfill_reservation(self, book: Book) -> None:
        if book reservations exist:
            first_reservation = get_earliest_reservation(book)
            notify(first_reservation.member)
            book.status = BookStatus.RESERVED

class BorrowRecord:
    def __init__(self, member: Member, book: Book, due_date: datetime):
        self.member = member
        self.book = book
        self.borrow_date = datetime.now()
        self.due_date = due_date
        self.return_date: Optional[datetime] = None

    def is_overdue(self) -> bool:
        return self.return_date is None and datetime.now() > self.due_date

    def fine_amount(self) -> float:
        if not self.is_overdue():
            return 0.0
        overdue_days = (datetime.now() - self.due_date).days
        return overdue_days * 5.0  # ₹5 per day

class Reservation:
    def __init__(self, member: Member, book: Book):
        self.member = member
        self.book = book
        self.reserved_at = datetime.now()
        self.expires_at = datetime.now() + timedelta(days=3)

class Librarian(Member):  # IS-A Member with extra powers
    def add_book(self, catalog: 'Catalog', book: Book) -> None:
        catalog.add(book)

    def remove_book(self, catalog: 'Catalog', book: Book) -> None:
        if book.status == BookStatus.BORROWED:
            raise Exception("Cannot remove borrowed book")
        catalog.remove(book)

class Catalog:
    def __init__(self):
        self._books_by_isbn: dict[str, Book] = {}
        self._books_by_title: dict[str, List[Book]] = {}

    def add(self, book: Book) -> None:
        self._books_by_isbn[book.isbn] = book

    def search_by_title(self, title: str) -> List[Book]:
        return [b for b in self._books_by_isbn.values()
                if title.lower() in b.title.lower()]

    def search_by_author(self, author_name: str) -> List[Book]:
        return [b for b in self._books_by_isbn.values()
                if author_name.lower() in b.author.name.lower()]

    def get_by_isbn(self, isbn: str) -> Optional[Book]:
        return self._books_by_isbn.get(isbn)
```

---

## Common LLD Problems

### Pattern: State Machine (Vending Machine / Order System)

Many LLD problems are state machines. Identify states and transitions first.

```python
from enum import Enum

class VendingState(Enum):
    IDLE = "idle"
    HAS_MONEY = "has_money"
    DISPENSING = "dispensing"
    OUT_OF_STOCK = "out_of_stock"

class VendingMachine:
    def __init__(self):
        self.state = VendingState.IDLE
        self.balance = 0.0
        self.inventory: dict[str, int] = {}  # product_id → count
        self.prices: dict[str, float] = {}   # product_id → price

    def insert_money(self, amount: float) -> None:
        if self.state not in (VendingState.IDLE, VendingState.HAS_MONEY):
            raise Exception("Cannot insert money in current state")
        self.balance += amount
        self.state = VendingState.HAS_MONEY

    def select_product(self, product_id: str) -> None:
        if self.state != VendingState.HAS_MONEY:
            raise Exception("Insert money first")
        if self.inventory.get(product_id, 0) == 0:
            self.state = VendingState.OUT_OF_STOCK
            raise Exception("Out of stock")
        price = self.prices[product_id]
        if self.balance < price:
            raise Exception(f"Insufficient balance. Need {price - self.balance} more")

        self.state = VendingState.DISPENSING
        self._dispense(product_id, price)

    def _dispense(self, product_id: str, price: float) -> None:
        self.inventory[product_id] -= 1
        self.balance -= price
        change = self.balance
        self.balance = 0
        self.state = VendingState.IDLE
        print(f"Dispensing {product_id}. Change: {change}")
```

### Pattern: Observer (Notification System)

```python
from abc import ABC, abstractmethod

class EventObserver(ABC):
    @abstractmethod
    def update(self, event_type: str, data: dict) -> None:
        pass

class NotificationService(EventObserver):
    def update(self, event_type: str, data: dict) -> None:
        if event_type == "book_returned":
            self._send_email(data['member_email'], "Your reserved book is available")

class AuditLogService(EventObserver):
    def update(self, event_type: str, data: dict) -> None:
        print(f"AUDIT: {event_type} at {datetime.now()} — {data}")

class EventPublisher:
    def __init__(self):
        self._observers: dict[str, list[EventObserver]] = {}

    def subscribe(self, event_type: str, observer: EventObserver) -> None:
        self._observers.setdefault(event_type, []).append(observer)

    def publish(self, event_type: str, data: dict) -> None:
        for observer in self._observers.get(event_type, []):
            observer.update(event_type, data)
```

---

## UML Diagrams (The Language of LLD)

### Class Diagram

Shows classes, their attributes, methods, and relationships.

```
┌─────────────────────────┐
│ <<class>>               │
│ Member                  │
├─────────────────────────┤
│ - member_id: str        │  ← attributes (- private, + public, # protected)
│ - name: str             │
│ - email: str            │
│ - active_borrows: List  │
├─────────────────────────┤
│ + borrow(book): Record  │  ← methods
│ + return_book(book)     │
│ + reserve(book)         │
└─────────────────────────┘
        ↑
        │ (inheritance / IS-A)
┌───────────────────┐
│ Librarian         │
├───────────────────┤
│ + add_book()      │
│ + remove_book()   │
└───────────────────┘

Relationships in UML:
──────────▷   Inheritance (IS-A)
- - - - - ▷   Implements interface
──────────◆   Composition (strong HAS-A, child can't exist without parent)
──────────◇   Aggregation (weak HAS-A, child can exist independently)
──────────→   Association (USES-A)
```

### Sequence Diagram

Shows the order of interactions between objects for a specific use case.

```
User     :   Library  :  Catalog  :  Book  :  BorrowRecord
  |             |           |         |            |
  |──search()──→|           |         |            |
  |             |--search()→|         |            |
  |             |←─results──|         |            |
  |←──results───|           |         |            |
  |───borrow()-→|           |         |            |
  |             |────is_available?───→|            |
  |             |←───────true─────────|            |
  |             |─────set BORROWED───→|            |
  |             |───────────new Record────────────→|
  |             |←───────────record────────────────|
  |←──record────|           |         |            |
```

### Activity Diagram

Flowchart showing the flow of logic (if/else, loops).

```
[Start]
   ↓
[Member selects book]
   ↓
<Is book available?> ── No ──→ [Reserve book] → [Notify when available] → [End]
   │ Yes
   ↓
<Member at borrow limit?> ── Yes ──→ [Reject with message] → [End]
   │ No
   ↓
[Create BorrowRecord]
   ↓
[Mark book as BORROWED]
   ↓
[Send confirmation email]
   ↓
[End]
```

---

## LLD Interview Checklist

### Step-by-step approach (15–20 minutes)

1. **Clarify requirements** (2 min): "What are the core use cases? Any specific constraints?"

2. **Identify entities** (2 min): Nouns from requirements → class names.

3. **Sketch class diagram** (5 min): Classes, key attributes, key methods, relationships.

4. **Define key APIs** (3 min): Method signatures for core operations.

5. **Walk through a use case** (3 min): Sequence diagram or pseudocode for the most complex flow.

6. **Add design patterns** (2 min): Observer, Strategy, Factory, Singleton — where appropriate.

7. **Discuss extensibility** (2 min): "If we needed to add X, the design supports it because..."

### Questions to ask yourself

- What are the states in this system? (State machine)
- What changes frequently vs what is stable? (Strategy pattern)
- Who needs to be notified of events? (Observer pattern)
- Is there a family of algorithms? (Strategy/Template Method)
- Do I need to hide complex creation logic? (Factory/Builder)

---

## Flashcards

**Q: What is the difference between HLD and LLD?**

> HLD = system architecture (which components, how they connect). LLD = class design, method signatures, algorithms within a single component.

**Q: What is the difference between composition and aggregation?**

> Composition = strong ownership, child can't exist without parent (Library owns Catalog). Aggregation = weak ownership, child can exist independently (Library has Members, but Member can exist without Library).

**Q: What does a sequence diagram show?**

> The order of interactions between objects over time for a specific use case.

**Q: What is the Observer pattern?**

> An object (publisher) maintains a list of dependents (observers) and notifies them of events automatically. Used for event-driven decoupling.

**Q: How do you approach an LLD interview problem?**

> Clarify requirements → identify entities (nouns) → identify behaviors (verbs) → design classes with relationships → define APIs → walk through a use case → discuss patterns and extensibility.
