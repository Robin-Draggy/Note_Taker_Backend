# Secure Note-Taking API

A REST API for a note-taking platform with JWT authentication, role-based
access control (User / Admin), MongoDB-backed persistence, and optimized
indexing. Built as a technical assessment.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Setup & Run](#setup--run)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Roles & Permissions](#roles--permissions)
- [API Reference](#api-reference)
- [Database Index Strategy](#database-index-strategy)
- [Aggregation Scenarios](#aggregation-scenarios)
- [Scope Decisions](#scope-decisions)
- [Manual Testing](#manual-testing)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express 5 |
| Database | MongoDB Atlas + Mongoose |
| Auth | JSON Web Tokens (`jsonwebtoken`) |
| Password Hashing | bcrypt (12 rounds) |
| Validation | Zod |
| Security | Helmet, CORS |
| Logging | pino / pino-http |
| Testing | Vitest + Supertest |

---

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (see next section)
cp .env.example .env
# Fill in .env with your values

# 3. Start development server
npm run dev

# Production mode
npm start

# Run tests (once written)
npm test