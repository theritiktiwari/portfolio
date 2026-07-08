---
title: "SOLID Principles — Writing Maintainable Object-Oriented Software"
description: "Master the SOLID principles with practical examples. Learn Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion to build scalable, maintainable, and testable software systems."
pubDate: 2026-07-08T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../../assets/blog/system-design-principles.avif
tags:
    [
        "system-design",
        "solid-principles",
        "software-engineering",
        "object-oriented-programming",
        "design-patterns",
    ]
featured: false
draft: false
series:
    name: "System Design"
    part: 14
---

## The Story: Building Codes for Software

A city has building codes — rules that ensure every building is structurally sound, safe, and maintainable. SOLID principles are the building codes for software. Violate them and your codebase becomes a crumbling structure that's expensive to repair.

SOLID is five principles for writing maintainable, scalable, and flexible object-oriented code. Every principle solves a specific kind of rot.

---

## S — Single Responsibility Principle (SRP)

> **A class should have only one reason to change.**

**City analogy:** A hospital should treat patients. It should not also handle city planning, run a restaurant, and manage parking — those are separate concerns with separate reasons to change.

### The Violation

```python
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    def get_user_details(self):
        return f"{self.name} <{self.email}>"

    def save_to_database(self):         # ← DB concern in User class
        db.execute("INSERT INTO users ...", self.name, self.email)

    def send_welcome_email(self):       # ← Email concern in User class
        smtp.send(self.email, "Welcome!")

    def generate_pdf_report(self):      # ← PDF generation in User class
        pdf.create(f"User Report: {self.name}")
```

`User` now has 4 reasons to change: if business logic changes, if DB schema changes, if email template changes, if PDF format changes. They're all coupled.

### The Fix

```python
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    def get_user_details(self) -> str:
        return f"{self.name} <{self.email}>"

class UserRepository:       # DB concern
    def save(self, user: User) -> None:
        db.execute("INSERT INTO users ...", user.name, user.email)

    def find_by_id(self, user_id: int) -> User:
        row = db.query("SELECT * FROM users WHERE id = ?", user_id)
        return User(row['name'], row['email'])

class EmailService:         # Email concern
    def send_welcome(self, user: User) -> None:
        smtp.send(user.email, "Welcome!")

class UserReportGenerator:  # Report concern
    def generate_pdf(self, user: User) -> bytes:
        return pdf.create(f"User Report: {user.name}")
```

Each class has one reason to change. Change the email template → only `EmailService` changes.

---

## O — Open/Closed Principle (OCP)

> **Classes should be open for extension, closed for modification.**

**City analogy:** A city's power grid is designed to accept new buildings (extension) without rewiring the entire grid (modification). New buildings plug in; the grid doesn't change.

### The Violation

```python
class DiscountCalculator:
    def calculate(self, order, customer_type):
        if customer_type == "regular":
            return order.total * 0.0
        elif customer_type == "premium":
            return order.total * 0.1
        elif customer_type == "vip":
            return order.total * 0.2
        # Adding new type requires modifying this method ← VIOLATION
        elif customer_type == "employee":
            return order.total * 0.3
```

Every new customer type requires modifying `DiscountCalculator`. You break existing code to extend.

### The Fix

```python
from abc import ABC, abstractmethod

class DiscountStrategy(ABC):
    @abstractmethod
    def calculate(self, order_total: float) -> float:
        pass

class RegularDiscount(DiscountStrategy):
    def calculate(self, order_total: float) -> float:
        return 0.0

class PremiumDiscount(DiscountStrategy):
    def calculate(self, order_total: float) -> float:
        return order_total * 0.1

class VIPDiscount(DiscountStrategy):
    def calculate(self, order_total: float) -> float:
        return order_total * 0.2

# Adding new type = new class, no modification of existing code
class EmployeeDiscount(DiscountStrategy):
    def calculate(self, order_total: float) -> float:
        return order_total * 0.3

class DiscountCalculator:  # Never changes
    def __init__(self, strategy: DiscountStrategy):
        self.strategy = strategy

    def calculate(self, order_total: float) -> float:
        return self.strategy.calculate(order_total)
```

New discount type → new class. `DiscountCalculator` never changes.

---

## L — Liskov Substitution Principle (LSP)

> **Subtypes must be substitutable for their base types.**

**City analogy:** If you book "a vehicle" for transportation, any vehicle (car, van, motorcycle) should fulfill the contract. A vehicle that explodes when you accelerate violates the substitution principle.

### The Violation

```python
class Rectangle:
    def set_width(self, width):
        self.width = width

    def set_height(self, height):
        self.height = height

    def area(self):
        return self.width * self.height

class Square(Rectangle):      # IS-A Rectangle? Mathematically yes. In code? Problem.
    def set_width(self, width):
        self.width = width
        self.height = width   # Square must keep sides equal — side effect!

    def set_height(self, height):
        self.width = height   # ← changes width too — SURPRISE BEHAVIOR
        self.height = height

# Consumer code breaks when Square substituted for Rectangle:
def process_shape(rect: Rectangle):
    rect.set_width(5)
    rect.set_height(10)
    assert rect.area() == 50  # FAILS for Square (area = 100, not 50)
```

### The Fix

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

class Square(Shape):
    def __init__(self, side: float):
        self.side = side

    def area(self) -> float:
        return self.side ** 2

# Both substitutable for Shape:
def print_area(shape: Shape):
    print(shape.area())  # works correctly for any Shape subtype
```

**LSP rule:** If subclass overrides a method, it must behave consistently with what callers expect of the parent.

---

## I — Interface Segregation Principle (ISP)

> **Clients should not be forced to depend on interfaces they don't use.**

**City analogy:** A receptionist shouldn't have to learn how to fix elevators, perform surgery, and cook food just because they work in a hospital. Give them only the interfaces relevant to their role.

### The Violation

```python
from abc import ABC, abstractmethod

class Worker(ABC):  # Fat interface — forces all implementors to implement everything
    @abstractmethod
    def work(self): pass

    @abstractmethod
    def eat(self): pass      # Robots don't eat

    @abstractmethod
    def sleep(self): pass    # Robots don't sleep

class HumanWorker(Worker):
    def work(self): print("Working...")
    def eat(self): print("Eating...")
    def sleep(self): print("Sleeping...")

class RobotWorker(Worker):
    def work(self): print("Working (robot)...")
    def eat(self): raise NotImplementedError("Robots don't eat!")   # FORCED
    def sleep(self): raise NotImplementedError("Robots don't sleep!") # FORCED
```

### The Fix

```python
from abc import ABC, abstractmethod

class Workable(ABC):
    @abstractmethod
    def work(self) -> None: pass

class Eatable(ABC):
    @abstractmethod
    def eat(self) -> None: pass

class Sleepable(ABC):
    @abstractmethod
    def sleep(self) -> None: pass

class HumanWorker(Workable, Eatable, Sleepable):
    def work(self): print("Human working...")
    def eat(self): print("Eating lunch...")
    def sleep(self): print("Sleeping 8 hours...")

class RobotWorker(Workable):  # Only implements what makes sense
    def work(self): print("Robot working...")

# Consumers depend only on what they need:
def manage_break(worker: Eatable) -> None:  # only asks for eating capability
    worker.eat()
```

---

## D — Dependency Inversion Principle (DIP)

> **High-level modules should not depend on low-level modules. Both should depend on abstractions.**

**City analogy:** A business (high-level) shouldn't depend on a specific courier company (low-level). It should depend on the concept of "a delivery service" (abstraction). Swap Fedex for DHL — the business doesn't change.

### The Violation

```python
class MySQLDatabase:  # Concrete low-level class
    def query(self, sql: str):
        return mysql.execute(sql)

class UserService:  # High-level class depends directly on MySQL
    def __init__(self):
        self.db = MySQLDatabase()  # ← direct dependency on concrete class

    def get_user(self, user_id: int):
        return self.db.query(f"SELECT * FROM users WHERE id = {user_id}")

# Now switching to PostgreSQL requires changing UserService
```

### The Fix

```python
from abc import ABC, abstractmethod

class DatabaseInterface(ABC):  # The abstraction
    @abstractmethod
    def query(self, sql: str, params: tuple = ()) -> list: pass

    @abstractmethod
    def execute(self, sql: str, params: tuple = ()) -> None: pass

class MySQLDatabase(DatabaseInterface):  # Low-level depends on abstraction
    def query(self, sql, params=()):
        return mysql_client.execute(sql, params)

    def execute(self, sql, params=()):
        mysql_client.execute(sql, params)

class PostgreSQLDatabase(DatabaseInterface):  # Another low-level implementation
    def query(self, sql, params=()):
        return pg_client.execute(sql, params)

    def execute(self, sql, params=()):
        pg_client.execute(sql, params)

class UserService:  # High-level depends on abstraction, not concrete class
    def __init__(self, db: DatabaseInterface):  # Injected dependency
        self.db = db

    def get_user(self, user_id: int):
        return self.db.query("SELECT * FROM users WHERE id = ?", (user_id,))

# Usage — swap DB without changing UserService:
service_mysql = UserService(db=MySQLDatabase())
service_pg    = UserService(db=PostgreSQLDatabase())
service_test  = UserService(db=MockDatabase())  # testing is easy
```

**This is Dependency Injection (DI)** — the concrete dependency is injected from outside, not created inside. DI containers (Spring in Java, FastAPI's Depends, etc.) automate this.

---

## SOLID Summary Table

| Principle                     | Violation smell                          | Solution                                 |
| ----------------------------- | ---------------------------------------- | ---------------------------------------- |
| **S** — Single Responsibility | Class changes for multiple reasons       | Split into focused classes               |
| **O** — Open/Closed           | Adding feature = modifying existing code | Use inheritance/composition + interfaces |
| **L** — Liskov Substitution   | Subclass breaks parent's contract        | Rethink inheritance hierarchy            |
| **I** — Interface Segregation | Class implements unused methods          | Split fat interfaces into focused ones   |
| **D** — Dependency Inversion  | High-level imports low-level directly    | Inject abstractions, not concretions     |

---

## Real-World Application in System Design

### SOLID in microservices

**SRP:** Each microservice has one responsibility domain.  
**OCP:** Add new event handlers without changing the event bus.  
**LSP:** All implementations of a service interface (gRPC contract) are substitutable.  
**ISP:** Keep gRPC/REST contracts focused; don't add unrelated endpoints to one service.  
**DIP:** Services depend on message contracts (Protobuf/JSON schema), not concrete implementations.

### SOLID in database access

```python
# DIP in action — repository pattern
class UserRepository(ABC):
    @abstractmethod
    def find_by_id(self, user_id: int) -> Optional[User]: pass

    @abstractmethod
    def save(self, user: User) -> None: pass

class PostgresUserRepository(UserRepository):
    def find_by_id(self, user_id):
        # PostgreSQL implementation
        ...

class MongoUserRepository(UserRepository):
    def find_by_id(self, user_id):
        # MongoDB implementation
        ...

class InMemoryUserRepository(UserRepository):  # for tests
    def __init__(self):
        self._store: dict = {}

    def find_by_id(self, user_id):
        return self._store.get(user_id)

    def save(self, user):
        self._store[user.id] = user
```

---

## Flashcards

**Q: What does SRP stand for and what does it mean?**

> Single Responsibility Principle — a class should have only one reason to change. Each class has one job.

**Q: What does OCP stand for and what does it mean?**

> Open/Closed Principle — open for extension (add new behavior), closed for modification (don't change existing code).

**Q: What does LSP stand for and what does it mean?**

> Liskov Substitution Principle — subclasses must be usable wherever the parent class is expected, without breaking behavior.

**Q: What does ISP stand for and what does it mean?**

> Interface Segregation Principle — don't force clients to implement methods they don't use. Split fat interfaces.

**Q: What does DIP stand for and what does it mean?**

> Dependency Inversion Principle — depend on abstractions, not concretions. High-level modules shouldn't import low-level modules directly.

**Q: What is Dependency Injection?**

> A technique implementing DIP — dependencies are passed in (injected) from outside rather than created inside the class.
