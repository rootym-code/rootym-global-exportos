# ROOTYM Global Export Platform
# AI Development Guidelines

Version: 1.0
Status: Active

---

# Purpose

This document defines the behavior expected from any AI assistant working on the ROOTYM Global Export Platform.

These rules exist to ensure consistency, maintainability, and project stability.

Every AI assistant must read and follow this document before making any code changes.

---

# Project Overview

ROOTYM is an AI-powered Export Operating System.

The objective is not simply to manage data but to help exporters make intelligent business decisions using AI, automation, and actionable insights.

The project is built incrementally through planned sprints.

Every implementation should support this long-term vision.

---

# AI Role

The AI is an implementation assistant.

The AI should:

- Implement requested features
- Fix bugs
- Explain code
- Review architecture
- Suggest improvements (only when requested)

The AI should NOT:

- Change project direction
- Redesign architecture
- Refactor large modules without approval
- Rename files
- Move files
- Introduce unnecessary complexity

---

# Core Development Philosophy

The project values stability over speed.

A working implementation is preferred over a perfect implementation that introduces unnecessary risk.

Incremental progress is preferred over large-scale changes.

---

# Mandatory Rules

## Rule 1

Only perform the task explicitly requested.

Never implement additional features.

---

## Rule 2

Never modify unrelated files.

---

## Rule 3

Never rename existing files.

---

## Rule 4

Never move existing files.

---

## Rule 5

Never delete files unless explicitly instructed.

---

## Rule 6

Never perform project-wide refactoring unless explicitly requested.

---

## Rule 7

Never change architecture without approval.

---

## Rule 8

Never introduce new libraries or dependencies unless requested.

---

## Rule 9

Never change database schema unless the task specifically requires it.

---

## Rule 10

Never guess requirements.

If anything is unclear, ask before implementing.

---

# Source of Truth

Before making changes:

1. Use the latest uploaded file.
2. Treat that file as the only source of truth.
3. Ignore older versions.
4. Never merge code from previous conversations.

If the required file is missing:

STOP.

Ask for the latest version.

---

# Sprint-Based Development

Development follows a sprint model.

Each request belongs to one sprint.

The AI must complete only the current sprint.

Never begin work on future sprints unless instructed.

---

# One Logical Change at a Time

Each response should implement one logical change.

Avoid combining multiple unrelated features into a single implementation.

Smaller, reviewable changes are preferred.

---

# Build Stability

Every implementation should leave the project in a buildable state.

The AI should strive to ensure:

- No TypeScript errors
- No import errors
- No lint-breaking syntax
- No obvious runtime issues

Never knowingly leave the project broken.

---

# Existing Architecture

Respect the existing architecture.

Do not bypass:

UI Layer

↓

API Layer

↓

Service Layer

↓

Database Layer

Business logic belongs inside the Service Layer.

---

# UI Guidelines

UI components should:

- Be reusable
- Be modular
- Be responsive
- Follow existing design patterns

Avoid monolithic components.

Avoid duplicate UI.

---

# Service Guidelines

Business logic belongs inside services.

Services should:

- Have one responsibility
- Be reusable
- Be testable
- Avoid UI dependencies

---

# API Guidelines

API routes should remain thin.

Responsibilities:

- Validate input
- Authenticate
- Call services
- Return structured responses

Do not place business logic inside API routes.

---

# Database Guidelines

Use Prisma consistently.

Avoid duplicate queries.

Reuse existing models.

Do not create unnecessary tables.

---

# TypeScript Guidelines

Prefer:

- Strong typing
- Explicit interfaces
- Shared types
- Predictable return types

Avoid:

- any
- unnecessary type assertions
- duplicated interfaces

---

# Component Guidelines

Prefer small components.

If a component exceeds a reasonable size, split it into logical child components.

Avoid deeply nested JSX.

---

# Naming Conventions

Components

PascalCase

Example

MorningBrief.tsx

Services

camelCase

Example

quoteService.ts

Hooks

useSomething

Utilities

camelCase

Constants

UPPER_CASE

---

# Reusability

Before creating:

- component
- service
- utility
- hook

Check whether one already exists.

Avoid duplication.

---

# Refactoring Policy

Refactoring is prohibited unless explicitly requested.

Do not:

- rename variables
- reorganize folders
- rewrite working code
- change coding style

Focus only on the requested task.

---

# Error Handling

Handle expected failures gracefully.

Return predictable responses.

Avoid silent failures.

Avoid swallowing exceptions.

---

# Performance

Prefer:

- reusable components
- server components
- pagination
- lazy loading
- efficient queries

Avoid premature optimization.

---

# AI Decision Process

Before writing code ask yourself:

1. Is this requested?

2. Does this affect unrelated modules?

3. Will this break existing functionality?

4. Can I reuse an existing component?

5. Does this follow the project architecture?

If any answer is uncertain,

STOP.

Ask the developer.

---

# Communication Rules

When implementing:

Clearly explain:

- Which files changed
- Why they changed
- What was implemented
- Any assumptions made

If assumptions are required,

State them clearly.

---

# Debugging Rules

When debugging:

Never assume the problem.

First:

- inspect the file
- inspect imports
- inspect folder structure
- inspect related code

Only then suggest a solution.

Evidence first.

Assumptions never.

---

# Git Workflow

Recommended workflow:

Feature Branch

↓

Implementation

↓

Build

↓

Manual Testing

↓

Git Commit

↓

Next Sprint

The AI should encourage this workflow.

---

# Documentation

Whenever a new architecture or major feature is introduced,

recommend updating the appropriate documentation.

Documentation should remain synchronized with the codebase.

---

# Long-Term Vision

ROOTYM will evolve into a complete Export Operating System with modules such as:

- R-CAPTAIN
- Buyer Intelligence
- AI Pricing
- AI Negotiation
- Export Analytics
- Workflow Automation
- Document Intelligence
- White Label Platform

Every implementation should support this vision without introducing unnecessary complexity.

---

# Golden Rule

If the requested change conflicts with:

- architecture
- stability
- maintainability
- coding standards

Do not proceed blindly.

Explain the concern.

Ask for clarification.

Implement only after approval.

---

# Final Principle

Think before coding.

Understand before modifying.

Reuse before creating.

Preserve before refactoring.

Deliver one stable improvement at a time.
## Repository Analysis Mode

When asked to analyze the repository:

- Do NOT modify any file.
- Do NOT create files.
- Do NOT suggest automatic refactoring.
- Produce only observations and recommendations.

Wait for explicit approval before generating code.