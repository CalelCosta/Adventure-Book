# Adventure Book Engine (Backend API)

An interactive adventure book engine built with Java 21 and Spring Boot 3. This application processes interactive branching stories, validates story structure integrity, manages player game sessions, and applies choice consequences dynamically.

## 🏛️ Architectural Overview

The backend is built adhering to **Clean Architecture** and **Hexagonal Architecture (Ports and Adapters)** principles:

- **Core Domain (`domain`)**: 100% framework-free Java code. Contains domain models, value objects, and business state invariants (e.g., Player health points, game progression logic).
- **Application Layer (`application`)**: Contains use-case orchestrators and an extensible **Book Validation Engine** built on the **Open/Closed Principle (OCP)**.
- **Infrastructure Layer (`infrastructure`)**: Adapters for Spring Boot, Jackson JSON deserialization, in-memory concurrency repositories, and REST controllers.

### Modern Java 21 Features Utilized
- **Virtual Threads (Project Loom)**: Enabled for high-throughput concurrency during async I/O and state persistence tasks.
- **Records**: Used for immutable Data Transfer Objects (DTOs), domain Value Objects, and JSON file mappings.
- **Sealed Interfaces & Pattern Matching**: Used in `Consequence` handling to guarantee compile-time exhaustive switch checks for player consequences.

---

## 🔍 Validation Engine Rules

Every book loaded from JSON or uploaded via API passes through a chain of validation rules before becoming available in the library:
1. **Single Beginning Rule**: A book must have exactly one section with `type = "BEGIN"`.
2. **Has Ending Rule**: A book must contain at least one section with `type = "END"`.
3. **Non-Ending Options Rule**: All non-ending sections (`BEGIN` and `NODE`) must present at least one navigation option.
4. **Valid Next Section Rule**: All option destination IDs (`gotoId`) must point to existing section IDs within the book.

---

## 🛠️ Tech Stack & Dependencies

- **Java 21**
- **Spring Boot 3.x** (Web, Validation)
- **Springdoc OpenAPI 2.x** (Swagger UI documentation)
- **Lombok** (Boilerplate reduction for mutable entities)
- **JUnit 5 & Mockito** (Unit and integration testing)
- **Maven** (Build management)

---

## 🚀 Getting Started

### Prerequisites
- JDK 21+
- Apache Maven 3.9+
- Docker & Docker Compose (Optional for containerized run)

### Building and Running Locally

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd adventure-book-app/adventure-book-engine