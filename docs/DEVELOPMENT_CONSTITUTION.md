# ============================================================
# ROOTYM Global Export Platform
# DEVELOPMENT CONSTITUTION
# ============================================================

Version: 1.0
Status: ACTIVE
Owner: ROOTYM Architecture Team

---

# Purpose

This document defines the engineering standards, architecture principles,
development workflow, and AI collaboration rules for the ROOTYM Global
Export Platform.

Every contributor (human or AI) MUST follow this document.

This document takes precedence over implementation convenience.

---

# Core Philosophy

The objective is NOT to write code quickly.

The objective is to build a scalable,
maintainable,
enterprise-grade software platform.

Architecture is always more important than implementation speed.

---

# Engineering Principles

1. Architecture First
2. Single Responsibility
3. Stable Interfaces
4. Predictable Data Flow
5. Incremental Development
6. Build Passing After Every Sprint
7. Git Checkpoint Before Major Refactors
8. No Breaking Changes Without Approval
9. Business Logic Never Lives in UI
10. Simplicity Over Cleverness

---

# Layered Architecture

ROOTYM follows strict layer separation.

Database
    ↓
Service
    ↓
Business Engine
    ↓
Presenter
    ↓
UI
    ↓
User

Each layer owns ONE responsibility.

---

# Layer Responsibilities

## Database

Responsible for:

- Data persistence
- Relationships
- Constraints

Must NEVER contain business logic.

---

## Service Layer

Responsible for:

- Orchestration
- Data fetching
- Calling engines
- Calling presenters
- Returning API models

Must NEVER:

- Format UI values
- Make business decisions

---

## Business Engine

Responsible for:

- Business rules
- AI calculations
- Recommendations
- Decision making
- Scoring

Must NEVER:

- Render UI
- Format strings
- Know about React

---

## Presenter

Responsible for:

- Formatting
- Display models
- Human-readable text
- UI mapping

Must NEVER:

- Calculate AI scores
- Make business decisions

---

## UI

Responsible for:

- Rendering
- User interaction

Must NEVER:

- Implement business rules
- Query database directly

---

# Dependency Direction

Allowed

Database
↓

Service
↓

Engine
↓

Presenter
↓

UI

Forbidden

UI → Database

Presenter → Service

Engine → UI

Database → Presenter

Circular dependencies

---

# Business Logic Rules

Business logic includes:

- AI Score
- Recommendation
- Confidence
- Pipeline Intelligence
- Sales Predictions
- Follow-up Logic

Business logic MUST live only inside Business Engines.

---

# Formatting Rules

Formatting includes:

- Currency
- Dates
- Labels
- Stage Names
- Display Strings

Formatting MUST live only inside Presenters.

---

# API Contracts

Public contracts are considered frozen unless explicitly approved.

Examples:

DashboardResponse

PriorityOpportunity

API response JSON

React Props

Changing public contracts requires architecture approval.

---

# Refactoring Rules

Before every major refactor:

1. Architecture Analysis
2. Blueprint
3. Git Checkpoint
4. Implementation
5. Build Verification
6. Architecture Review
7. Functional Testing
8. Git Commit

Never skip steps.

---

# Git Workflow

Feature Branch

↓

Architecture Review

↓

Checkpoint Commit

↓

Implementation

↓

Build Pass

↓

Testing

↓

Architecture Review

↓

Final Commit

↓

Merge

---

# Build Requirements

Every sprint MUST end with:

npm run build

Passing.

TypeScript only is NOT sufficient.

---

# AI Collaboration Model

ChatGPT

Role:

Technical Architect

Responsibilities:

- Architecture
- Design
- Planning
- Code Review
- Risk Analysis
- Business Logic Design
- Sprint Planning

Never used for large-scale implementation.

---

Gemini CLI

Role:

Implementation Engineer

Responsibilities:

- Coding
- Refactoring
- CRUD
- Prisma
- UI implementation
- Build verification

Never changes architecture without approval.

---

# AI Workflow

Business Requirement

↓

Architecture Review

↓

Blueprint

↓

Implementation

↓

Build

↓

Architecture Review

↓

Testing

↓

Git

---

# Sprint Rules

One sprint

=

One objective

Do not mix:

Architecture

Bug fixes

UI redesign

Database migration

Feature expansion

within the same sprint.

---

# Code Review Checklist

Every implementation must satisfy:

✓ Single Responsibility

✓ No duplicate logic

✓ No circular dependency

✓ Build passes

✓ UI unchanged unless approved

✓ API unchanged unless approved

✓ Layer responsibilities preserved

---

# Naming Conventions

Services

xxx.service.ts

Business Engines

xxx.engine.ts

Presenters

xxx.presenter.ts

Types

xxx.types.ts

Utilities

xxx.utils.ts

Constants

xxx.constants.ts

---

# File Modification Rules

Never modify unrelated files.

Touch the minimum number of files required.

Avoid cross-module refactoring during active sprints.

---

# Performance Rules

Do not optimize prematurely.

Correctness

↓

Maintainability

↓

Performance

Optimization requires measurable evidence.

---

# Error Handling

Errors should be handled:

Service Layer

↓

API Layer

↓

UI

Never silently ignore failures.

---

# Documentation

Every architecture change must include:

Purpose

Responsibility

Data Flow

Reasoning

Rollback Strategy

---

# Golden Rule

A working feature with poor architecture
is considered incomplete.

A clean architecture that enables
future development is always preferred
over short-term implementation speed.

---

END OF CONSTITUTION