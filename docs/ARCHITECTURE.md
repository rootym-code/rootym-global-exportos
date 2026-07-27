# ROOTYM Global Export Platform
# Architecture Documentation

Version: 1.0
Status: Living Document

---

# Vision

ROOTYM is an AI-powered Export Operating System.

The platform is designed to help exporters make better business decisions through intelligent workflows, AI assistance, automation, and a modular architecture.

The primary goal is not to build another CRM.

The goal is to build an AI Sales & Export Platform.

---

# Core Principles

The architecture must always remain:

- Modular
- Scalable
- Maintainable
- Extensible
- Strongly Typed
- Service-Oriented

Every feature should integrate into the existing architecture.

Avoid duplicate logic.

Avoid tightly coupled modules.

---

# Architecture Layers

ROOTYM follows a layered architecture.

```
UI Layer
    │
    ▼
API Layer
    │
    ▼
Service Layer
    │
    ▼
Database Layer (Prisma)
```

No layer should bypass another.

---

# UI Layer

Technology

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

Responsibilities

- Rendering UI
- User interaction
- Form validation
- Calling APIs
- Displaying results

Never place business logic inside React components.

---

# API Layer

Location

```
app/api/
```

Responsibilities

- Request validation
- Authentication
- Authorization
- Calling Services
- Returning JSON

API routes should remain thin.

Business logic belongs inside Services.

---

# Service Layer

Location

```
lib/services/
```

Responsibilities

- Business logic
- Database operations
- AI orchestration
- Integrations
- Validation
- Domain rules

Services are the heart of the application.

The UI must never directly access Prisma.

---

# Database Layer

Technology

Prisma ORM

Database

PostgreSQL

Responsibilities

- Persistence
- Transactions
- Relationships

All database access must happen through the Service Layer.

---

# Project Structure

```
app/
components/
lib/
prisma/
public/
styles/
types/
```

Each folder has a dedicated responsibility.

---

# Components

Components must remain reusable.

Large pages should be composed of smaller components.

Example

```
components/

admin/
cms/
products/
buyers/
quotes/
followups/
rcaptain/
shared/
animations/
```

Avoid monolithic components.

---

# Services

Organize services by business domain.

Example

```
services/

buyers/
products/
quotes/
followups/
cms/
whatsapp/
ai/
rcaptain/
```

Never mix unrelated business domains.

---

# API Organization

Organize APIs by feature.

Example

```
api/

admin/
products/
quotes/
buyers/
cms/
followups/
r-captain/
```

Avoid generic endpoints.

---

# Naming Conventions

Components

PascalCase

Example

```
BuyerCard.tsx
MorningBrief.tsx
```

Functions

camelCase

```
createBuyer()
generateQuote()
calculateOpportunity()
```

Constants

UPPER_CASE

Interfaces

PascalCase

Types

PascalCase

Enums

PascalCase

---

# State Management

Prefer local state whenever possible.

Lift state only when necessary.

Avoid unnecessary global state.

---

# Styling

Tailwind CSS

Rules

- Utility first
- Consistent spacing
- Reusable UI
- Responsive by default

Avoid inline styles.

---

# Forms

Validation

Zod

UI

React Components

Server validation is mandatory.

Never trust client validation alone.

---

# Authentication

JWT Authentication

Authentication is handled centrally.

Protected routes must never duplicate authentication logic.

---

# Error Handling

Every Service returns predictable results.

Avoid throwing unexpected errors.

Log internal errors.

Return user-friendly API responses.

---

# Logging

Future direction

Central logging service

Examples

- API failures
- AI failures
- Integration failures
- Database failures

---

# AI Architecture

AI belongs inside dedicated Services.

Example

```
services/

ai/

whatsapp/
captain/
pricing/
buyers/
```

Never call AI providers directly from UI components.

---

# R-CAPTAIN Architecture

R-CAPTAIN is an Intelligence Layer.

It consumes data from existing modules.

It does not own those modules.

Example

```
Inquiry
      │
Quote
      │
Follow-up
      │
WhatsApp
      │
Buyer
      │
Activity
      ▼

R-CAPTAIN

      ▼

Insights

Recommendations

Actions
```

R-CAPTAIN must never duplicate business data.

---

# Design Philosophy

Every screen must answer:

"What should the exporter do next?"

Not

"What happened?"

ROOTYM is action-oriented.

---

# Performance

Prefer

- Server Components
- Lazy loading
- Pagination
- Incremental rendering

Avoid unnecessary client-side rendering.

---

# Reusability

Before creating

- Component
- Service
- Utility

Check whether one already exists.

Avoid duplication.

---

# Scalability

Every new module should plug into the existing architecture.

No future feature should require major architectural changes.

---

# White Label Vision

ROOTYM is designed to become a White Label Export Platform.

Therefore

- No company-specific business logic
- Configurable branding
- Configurable integrations
- Modular feature architecture

---

# Future Modules

- R-CAPTAIN
- Buyer Intelligence
- Export Intelligence
- Analytics
- AI Pricing
- AI Negotiation
- Document Intelligence
- Workflow Automation

These modules should extend the architecture.

They must never break it.

---

# Golden Rule

Whenever implementing a new feature:

Ask:

1. Does it fit the architecture?
2. Can it be reused?
3. Is business logic inside Services?
4. Is UI free from business logic?
5. Will this require refactoring later?

If the answer to the last question is YES,

Stop.

Redesign before implementing.