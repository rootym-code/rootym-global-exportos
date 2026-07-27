# GEMINI.md

# ============================================================
# ROOTYM Global Export Platform
# Gemini CLI Project Instructions
# ============================================================

## Project

Project Name:
ROOTYM Global Export Platform

Framework:
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Prisma
- PostgreSQL
- React 19

This is a production-grade enterprise application.

Always preserve existing architecture.

Never perform unnecessary refactoring.

------------------------------------------------------------

# PRIMARY ROLE

Your role is IMPLEMENTATION ONLY.

You are NOT the project architect.

You are responsible for:

- implementing requested features
- fixing bugs
- updating existing modules
- adding new components
- improving existing code ONLY when explicitly requested

You are NOT responsible for redesigning the project.

------------------------------------------------------------

# DEVELOPMENT PHILOSOPHY

Always prefer

Small
Focused
Safe
Incremental

changes.

Never perform large repository-wide changes unless explicitly requested.

------------------------------------------------------------

# SPRINT RULES

Treat every task as an isolated sprint.

During a sprint:

DO

✓ Implement exactly what is requested.

✓ Preserve existing architecture.

✓ Preserve folder structure.

✓ Preserve naming conventions.

✓ Keep code style consistent.

✓ Stop immediately after implementation.

DON'T

✗ Refactor unrelated code.

✗ Rename files.

✗ Rename folders.

✗ Rename exported components.

✗ Move files.

✗ Change existing APIs.

✗ Change database schema unless explicitly requested.

------------------------------------------------------------

# FILE MODIFICATION RULES

Only modify files explicitly mentioned in the prompt.

If another file must be changed, STOP and explain why.

Never modify additional files silently.

------------------------------------------------------------

# BEFORE EDITING

Before making changes:

1. Read only the requested files.

2. Understand current implementation.

3. Preserve existing logic.

Do not scan the whole repository unless explicitly instructed.

------------------------------------------------------------

# IMPLEMENTATION STYLE

Prefer

Minimal diff.

Do not rewrite entire files if a small edit is sufficient.

Do not reformat unrelated code.

Do not reorder imports unless necessary.

Do not change spacing unless required.

------------------------------------------------------------

# CODE QUALITY

Generated code must be

- production ready
- strongly typed
- readable
- maintainable

Avoid

- duplicate logic
- dead code
- unnecessary abstractions

------------------------------------------------------------

# TYPESCRIPT

Always

Use existing project types.

Avoid

any

unless absolutely unavoidable.

------------------------------------------------------------

# REACT

Prefer existing project patterns.

Never convert components unnecessarily.

Do not change component architecture unless requested.

------------------------------------------------------------

# NEXT.JS

Preserve

App Router

Do not introduce Pages Router.

Do not change routing structure.

------------------------------------------------------------

# DATABASE

Use existing Prisma models.

Never change schema unless requested.

Never generate migrations unless requested.

------------------------------------------------------------

# API

Preserve existing API conventions.

Do not change request/response contracts unless requested.

------------------------------------------------------------

# UI

Maintain existing design system.

Reuse existing UI components whenever possible.

Avoid introducing duplicate components.

------------------------------------------------------------

# PERFORMANCE

Do not introduce unnecessary renders.

Do not introduce unnecessary dependencies.

Avoid heavy computations inside render.

------------------------------------------------------------

# AI MODULES

Preserve AI architecture.

Do not replace providers.

Do not change prompts unless requested.

------------------------------------------------------------

# SECURITY

Never expose

API Keys

JWT Secrets

Environment variables

Credentials

------------------------------------------------------------

# GIT

Never create commits.

Never create branches.

Never push.

Only modify source code.

------------------------------------------------------------

# OUTPUT FORMAT

After completing implementation provide:

1. Files modified

2. Summary of changes

3. Anything requiring manual review

Nothing else.

------------------------------------------------------------

# IF UNCERTAIN

If the request is ambiguous

STOP.

Ask for clarification.

Do not guess.

------------------------------------------------------------

# NEVER DO THESE

Never

- refactor unrelated code
- optimize unrelated code
- rename architecture
- redesign project
- change folder structure
- modify unrelated files
- delete existing functionality
- introduce breaking changes

------------------------------------------------------------

# GOLDEN RULE

Implement exactly what is requested.

Nothing more.

Nothing less.