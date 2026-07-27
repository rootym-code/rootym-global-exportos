# ROOTYM Global Export Platform
# Development Rules

Version: 1.0
Status: Active

---

# Purpose

This document defines the development workflow and engineering rules for the ROOTYM Global Export Platform.

The goal is to ensure that every change is predictable, reviewable, maintainable, and does not compromise project stability.

All contributors, including AI assistants, should follow these rules.

---

# Development Philosophy

ROOTYM is developed incrementally.

The project prioritizes:

- Stability over speed
- Maintainability over shortcuts
- Consistency over personal preference
- Small improvements over large rewrites

Every completed sprint should leave the project in a better state than before.

---

# Sprint-Based Development

Development is organized into independent sprints.

Each sprint must have:

- A clear objective
- A defined scope
- A completion checkpoint
- A successful build
- Manual verification

Do not work on multiple sprints simultaneously.

Complete the current sprint before beginning the next.

---

# One Logical Change at a Time

Each implementation should solve one logical problem.

Avoid combining unrelated changes.

Examples:

✅ Add Buyer Notes feature

✅ Improve Quote Preview

❌ Add Buyer Notes + Refactor Dashboard + Update Sidebar

Small, focused changes are easier to review and debug.

---

# Latest File is the Source of Truth

When modifying code:

- Always use the latest version of the file.
- Never rely on older copies.
- Never merge code from previous conversations.
- If the latest file is unavailable, stop and request it.

Never assume a file's contents.

---

# Build First Policy

Before considering a sprint complete:

1. Build the project.
2. Resolve build errors.
3. Test the implemented feature.
4. Commit the changes.

A feature is not complete until the project builds successfully.

---

# Git Workflow

Every sprint follows this workflow:

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

Do not commit broken code.

Do not continue development if the current build is failing.

---

# Branch Strategy

main

- Production-ready code only

Feature Branches

- Active development
- One branch per feature or sprint

Examples:

- rcaptain-development
- cms-foundation
- buyer-module
- ai-pricing

Merge into main only after successful testing.

---

# Commit Guidelines

Commit after completing a meaningful unit of work.

Use clear commit messages.

Examples:

RC-1.1: Add R-CAPTAIN dashboard foundation

CMS-2.0: Implement company settings

Buyer-3.2: Add buyer activity timeline

Avoid vague messages such as:

- Update
- Fix
- Changes
- Work in progress

---

# Architecture Compliance

All new features must follow the documented architecture.

UI

↓

API

↓

Service

↓

Database

Do not bypass layers.

Business logic belongs in the Service Layer.

---

# Refactoring Policy

Refactoring is not part of normal development.

Refactor only when:

- Explicitly requested
- Planned as a dedicated sprint
- Reviewed before implementation

Avoid "drive-by refactoring" while implementing unrelated features.

---

# File Management Rules

Do not:

- Rename files without approval
- Move files without approval
- Delete files without approval

Maintain a stable project structure.

---

# Component Rules

Components should:

- Have a single responsibility
- Be reusable
- Remain reasonably small
- Follow existing design patterns

Avoid duplicated UI.

---

# Service Rules

Services should:

- Encapsulate business logic
- Be reusable
- Be independent of the UI
- Have clear responsibilities

Do not place business logic inside React components.

---

# API Rules

API routes should:

- Validate requests
- Authenticate users
- Call services
- Return structured responses

Avoid placing business logic in API routes.

---

# Database Rules

All database access must go through Prisma.

Avoid duplicate queries.

Reuse existing models whenever possible.

Database schema changes require planning and review.

---

# Code Quality

Every change should:

- Compile successfully
- Use TypeScript correctly
- Avoid duplicated code
- Follow project naming conventions
- Match the existing coding style

Do not introduce warnings or obvious technical debt.

---

# Error Handling

Handle expected errors gracefully.

Provide meaningful error messages.

Avoid silent failures.

Log unexpected errors when appropriate.

---

# Performance Guidelines

Prefer:

- Reusable components
- Efficient database queries
- Server Components where appropriate
- Pagination for large datasets
- Lazy loading when beneficial

Do not optimize prematurely.

Focus on correctness first.

---

# Documentation

Update documentation whenever:

- Architecture changes
- New modules are introduced
- Development workflow changes
- Public APIs change

Documentation should evolve with the project.

---

# Code Review Checklist

Before completing a sprint, verify:

- Feature works as expected
- Build passes successfully
- No unrelated files were modified
- Existing functionality remains intact
- Code follows project conventions
- Documentation is updated if required

---

# Debugging Rules

When debugging:

- Verify the problem first.
- Inspect the relevant files.
- Check imports.
- Check project structure.
- Check build output.

Never diagnose based on assumptions.

Always work from evidence.

---

# AI Collaboration

AI is a development assistant, not the decision maker.

AI should:

- Follow the requested scope
- Preserve architecture
- Avoid unrelated changes
- Explain modifications clearly

Final implementation decisions remain with the project owner.

---

# Long-Term Goals

Every completed sprint should move ROOTYM closer to becoming:

- AI Export Operating System
- White Label Export Platform
- Intelligent Sales Platform
- Modular SaaS Solution

Development decisions should support these goals without sacrificing current stability.

---

# Golden Rules

Before writing code, ask:

1. Does this belong in the current sprint?
2. Does it follow the architecture?
3. Does it affect unrelated modules?
4. Can an existing component or service be reused?
5. Will the project still build successfully after this change?

If the answer to any question is uncertain:

Stop.

Review the requirement.

Clarify before implementing.

---

# Final Principle

Plan carefully.

Build incrementally.

Test thoroughly.

Commit confidently.

Repeat consistently.