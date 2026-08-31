# Adventure Book Application

A full‑stack interactive book‑game platform where users can explore stories, make choices, and experience branching narratives.

## Technologies

- **Backend**: Spring Boot, MongoDB, Java 21
- **Frontend**: Angular 19, TypeScript, SCSS
- **Container**: Docker, Docker Compose

## Features

- Browse books with search and filter
- Start a game session
- Make choices and see consequences (health changes)
- Game over / victory detection
- Save/load progress (localStorage + MongoDB)

## Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local frontend development)
- Java 21 (for local backend development)

## Running with Docker (production mode)

1. Clone the repository.
2. From the root directory, run:
   ```bash
   docker-compose up -d