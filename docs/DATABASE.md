# ROOTYM Global Export Platform
# Database Documentation

Version: 1.0
Status: Living Document

---

# Purpose

This document defines the database architecture, design principles, conventions, and development standards used throughout the ROOTYM Global Export Platform.

The objective is to build a scalable, maintainable, and high-performance database that supports future growth without requiring major redesign.

---

# Database Philosophy

The database is the single source of truth for all business data.

It should be:

- Normalized
- Consistent
- Scalable
- Secure
- Extensible

Every table should represent a business entity.

Business logic should never exist inside the database.

---

# Technology Stack

ORM

Prisma ORM

Database

PostgreSQL

Application

Next.js

Language

TypeScript

---

# Database Architecture

```
React Components

        │

        ▼

API Routes

        │

        ▼

Service Layer

        │

        ▼

Prisma ORM

        │

        ▼

PostgreSQL Database
```

No component should access the database directly.

All database access must go through the Service Layer.

---

# Design Principles

The database should be:

- Modular
- Predictable
- Strongly typed
- Consistent
- Easy to extend

Avoid shortcuts that create long-term maintenance problems.

---

# Table Design

Each table should represent one business concept.

Examples:

- Product
- Buyer
- Inquiry
- Quote
- Order
- Shipment
- FollowUp
- Company
- User

Avoid combining unrelated concepts into a single table.

---

# Naming Conventions

Tables

Use singular PascalCase.

Examples

```
Product

Buyer

Inquiry

Quote

Order
```

Fields

Use camelCase.

Examples

```
createdAt

updatedAt

companyName

contactPerson
```

Foreign Keys

Append "Id".

Examples

```
buyerId

quoteId

productId
```

Boolean Fields

Use clear prefixes.

Examples

```
isActive

isDeleted

isVerified

isPublished
```

---

# Primary Keys

Every table should have

```
id
```

Type

```
String
```

Generated using

```
cuid()
```

Primary keys should never be reused.

---

# Audit Fields

Every table should include:

```
id

createdAt

updatedAt
```

Optional fields

```
createdBy

updatedBy

deletedAt
```

Maintain a consistent auditing strategy.

---

# Soft Delete Strategy

Prefer soft deletes where business history is important.

Example

```
deletedAt DateTime?
```

Avoid permanent deletion of important business data.

---

# Relationships

Use Prisma relations.

Examples

```
Buyer

↓

Inquiry

↓

Quote

↓

Order
```

Prefer explicit relationships over duplicated fields.

---

# Cascading Rules

Avoid accidental cascading deletes.

Use cascading only when appropriate.

Business records should generally be preserved.

---

# Enums

Use Prisma enums for fixed values.

Examples

```
InquiryStatus

QuoteStatus

OrderStatus

UserRole

PaymentStatus
```

Avoid storing constant values as free text.

---

# Lookup Tables

When values are expected to grow over time,

prefer dedicated lookup tables instead of enums.

Examples

- Countries
- Ports
- Currencies
- Shipping Lines

---

# Indexing

Create indexes for frequently queried fields.

Examples

```
email

phone

country

status

createdAt

buyerId
```

Avoid unnecessary indexes.

---

# Unique Constraints

Use unique constraints where appropriate.

Examples

```
email

IEC

GST

PAN

Company Registration Number
```

Avoid duplicate business records.

---

# Transactions

Use Prisma transactions for operations involving multiple tables.

Examples

- Create Quote
- Create Order
- Convert Inquiry to Buyer
- Shipment Processing

Maintain data consistency.

---

# Data Integrity

Validate all data before insertion.

Do not rely on database constraints alone.

Validation belongs in:

- API Layer
- Service Layer

---

# Prisma Guidelines

Use:

```
findUnique()

findMany()

create()

update()

delete()

upsert()

transaction()
```

Prefer Prisma APIs over raw SQL.

Only use raw SQL when absolutely necessary.

---

# Query Optimization

Avoid:

- N+1 queries
- Repeated database calls
- Loading unnecessary columns

Prefer:

- Select
- Include
- Pagination

---

# Pagination

Large datasets should always use pagination.

Example

```
skip

take
```

Never return thousands of records unnecessarily.

---

# Search Strategy

Search should support:

- Company Name
- Product Name
- Buyer
- Country
- Status

Use indexed fields where possible.

---

# File Storage

The database should store only metadata.

Examples

```
fileName

fileUrl

mimeType

fileSize
```

Actual files should be stored separately.

---

# AI Data

AI-generated content should be stored separately from user-entered data.

Examples

- AI WhatsApp Drafts
- AI Suggestions
- AI Summaries
- AI Recommendations

Maintain clear ownership of generated content.

---

# Multi-Tenant Readiness

The architecture should support future white-label deployments.

Where applicable,

business data should be associated with a company.

Example

```
companyId
```

Avoid hardcoding company-specific logic.

---

# Company Settings

Global company configuration should be centralized.

Examples

- Company Information
- Branding
- Contact Details
- Social Media
- Tax Information
- Export Registrations

Do not duplicate company data across tables.

---

# Historical Data

Business history should be preserved.

Examples

- Quote Revisions
- Status Changes
- Activity Logs
- AI Decisions
- Follow-Up History

Avoid overwriting important historical records.

---

# Security

Never store:

- Plain-text passwords
- API secrets
- JWT tokens

Sensitive information must always be encrypted or securely managed.

---

# Migration Strategy

Every schema change should be introduced through a Prisma migration.

Recommended workflow:

1. Update schema.prisma
2. Generate migration
3. Review migration
4. Apply migration
5. Test application

Never modify the production database manually unless absolutely necessary.

---

# Backup Strategy

Production databases should have:

- Scheduled backups
- Recovery testing
- Backup retention policy

Database recovery procedures should be documented separately.

---

# Performance

Monitor:

- Slow queries
- Missing indexes
- Query execution time
- Table growth

Optimize only after measuring.

---

# Future Modules

The database should support future modules including:

- Products
- Categories
- Buyers
- Suppliers
- Inquiries
- Quotations
- Orders
- Shipments
- Inventory
- Follow-Ups
- WhatsApp
- Email
- Notifications
- Analytics
- CMS
- Company Settings
- User Management
- AI Services
- R-CAPTAIN
- Buyer Intelligence
- Export Intelligence
- Workflow Automation

New modules should extend the schema without breaking existing relationships.

---

# Database Development Checklist

Before creating a new table:

✓ Does it represent a single business entity?

✓ Can an existing table be extended instead?

✓ Are relationships properly defined?

✓ Are indexes required?

✓ Are audit fields included?

✓ Are unique constraints needed?

✓ Is soft delete required?

✓ Will the schema remain scalable?

✓ Does it follow naming conventions?

✓ Has a Prisma migration been created?

---

# Golden Rules

- One business entity per table.
- Business logic belongs in services, not the database.
- Always use Prisma migrations.
- Preserve historical business data.
- Prefer explicit relationships.
- Avoid duplicate data.
- Optimize only after measuring.
- Design for future scalability.

---

# Long-Term Vision

The ROOTYM database is designed to evolve into the foundation of a complete AI-powered Export Operating System and White Label SaaS Platform.

Every schema change should improve the platform without compromising stability, consistency, or maintainability.