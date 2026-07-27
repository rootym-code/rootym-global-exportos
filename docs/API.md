# ROOTYM Global Export Platform
# API Documentation

Version: 1.0
Status: Living Document

---

# Purpose

This document defines the API architecture, conventions, and development standards used throughout the ROOTYM Global Export Platform.

Every API endpoint should follow these guidelines to ensure consistency, maintainability, security, and scalability.

---

# API Philosophy

The API layer acts as the communication bridge between:

- Frontend
- Services
- Database
- AI Services
- External Integrations

The API layer should remain thin.

Business logic must never be implemented inside API routes.

---

# Architecture

```
Client
    │
    ▼
API Route
    │
    ▼
Authentication
    │
    ▼
Validation
    │
    ▼
Service Layer
    │
    ▼
Prisma
    │
    ▼
PostgreSQL
```

Each layer has a single responsibility.

---

# API Folder Structure

```
app/
└── api/
    ├── admin/
    ├── auth/
    ├── buyers/
    ├── cms/
    ├── company/
    ├── dashboard/
    ├── inquiries/
    ├── products/
    ├── quotes/
    ├── followups/
    ├── whatsapp/
    ├── notifications/
    ├── analytics/
    ├── ai/
    └── rcaptain/
```

Group APIs by business domain.

Never create generic folders such as:

```
misc
temp
utils
new
```

---

# REST Conventions

Use resource-oriented endpoints.

Examples

```
GET    /api/products
GET    /api/products/:id

POST   /api/products

PUT    /api/products/:id

PATCH  /api/products/:id

DELETE /api/products/:id
```

Avoid action-oriented naming.

Avoid:

```
/api/getProducts

/api/saveProduct

/api/deleteProduct
```

---

# HTTP Methods

GET

Retrieve data.

Must never modify data.

---

POST

Create new resources.

---

PUT

Replace an entire resource.

---

PATCH

Update specific fields.

---

DELETE

Delete resources.

---

# Request Lifecycle

```
Incoming Request

↓

Authentication

↓

Authorization

↓

Validation

↓

Service Layer

↓

Database

↓

Response
```

Never bypass validation.

Never bypass services.

---

# Responsibilities

## API Route

Responsible for:

- Receiving requests
- Authenticating users
- Authorizing access
- Validating input
- Calling services
- Returning responses

Should NOT:

- Write business logic
- Perform complex calculations
- Execute large database queries
- Call AI providers directly

---

## Service Layer

Responsible for:

- Business rules
- Database interaction
- AI orchestration
- Integrations
- Transactions
- Calculations

---

# Authentication

Protected endpoints require authentication.

Typical flow:

```
Request

↓

JWT Validation

↓

Authenticated User

↓

API Logic
```

Unauthorized users receive:

```
401 Unauthorized
```

---

# Authorization

Authentication answers:

"Who is the user?"

Authorization answers:

"What can the user do?"

Future versions may include:

- Super Admin
- Admin
- Sales Executive
- Operations
- Buyer
- Customer

Always verify permissions before modifying protected resources.

---

# Validation

Every input must be validated.

Recommended:

- Zod

Validate:

- Request body
- Query parameters
- Route parameters

Never trust client-side validation.

---

# Response Format

Successful response

```json
{
  "success": true,
  "message": "Product created successfully.",
  "data": {}
}
```

---

Validation error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

---

Server error

```json
{
  "success": false,
  "message": "Internal server error."
}
```

Use a consistent response format across all APIs.

---

# Error Handling

Expected errors:

- Validation errors
- Authentication failures
- Authorization failures
- Resource not found

Unexpected errors:

- Database failures
- Network failures
- External service failures

Never expose stack traces to clients.

Log internal errors securely.

---

# Pagination

Large datasets should support pagination.

Example query:

```
?page=1
&pageSize=20
```

Example response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}
```

---

# Filtering

Example

```
GET /api/inquiries

?status=OPEN

&country=India

&priority=HIGH
```

Support filtering through query parameters.

---

# Sorting

Example

```
?sortBy=createdAt

&order=desc
```

---

# Searching

Example

```
?search=Rice
```

Search should be implemented through query parameters.

---

# File Uploads

Future upload endpoints:

```
/api/uploads
```

Supported examples:

- Product Images
- Company Logo
- Buyer Documents
- Certificates
- Invoices
- Packing Lists

Validate:

- File size
- MIME type
- Permissions

---

# AI APIs

AI endpoints should only coordinate requests.

Example

```
POST

/api/ai/whatsapp-reply
```

Workflow

```
Request

↓

Validation

↓

AI Service

↓

Provider

↓

Response
```

Never call AI providers directly from React components.

---

# R-CAPTAIN APIs

Future examples

```
GET

/api/rcaptain/morning-brief

GET

/api/rcaptain/opportunities

GET

/api/rcaptain/priorities

GET

/api/rcaptain/insights
```

R-CAPTAIN consumes information from multiple modules.

It should not duplicate business data.

---

# Performance

Prefer:

- Pagination
- Filtering
- Indexed queries
- Efficient Prisma queries
- Server-side processing

Avoid:

- Returning entire tables
- N+1 queries
- Duplicate queries

---

# Versioning

Future-proof APIs using versioning.

Example

```
/api/v1/products
```

Current version:

```
v1
```

---

# Logging

Log:

- Authentication failures
- API errors
- External integration failures
- AI provider failures

Do not log:

- Passwords
- JWT tokens
- Sensitive customer information

---

# Security

Always:

- Validate input
- Authenticate users
- Authorize actions
- Sanitize user input
- Protect sensitive endpoints

Never:

- Trust client data
- Return internal errors
- Expose secrets
- Hardcode credentials

---

# Documentation

Every API should document:

- Purpose
- Request method
- Route
- Authentication requirement
- Request parameters
- Request body
- Success response
- Error responses

---

# Future API Modules

The platform is expected to include APIs for:

- Products
- Buyers
- Suppliers
- Quotes
- Inquiries
- Orders
- Shipments
- Follow-ups
- WhatsApp
- Email
- Notifications
- Analytics
- CMS
- Company Settings
- AI Services
- R-CAPTAIN
- Buyer Intelligence
- Export Intelligence
- Workflow Automation

Each module should follow the standards defined in this document.

---

# API Development Checklist

Before creating a new API:

✓ Is the endpoint grouped under the correct module?

✓ Does it use the correct HTTP method?

✓ Is authentication implemented?

✓ Is authorization required?

✓ Is input validated?

✓ Is business logic inside the Service Layer?

✓ Does it return the standard response format?

✓ Are errors handled properly?

✓ Is the endpoint documented?

✓ Does it follow the existing project architecture?

---

# Golden Rule

An API route should coordinate the request—not perform the work.

Keep API routes simple.

Keep business logic in services.

Keep responses consistent.

Build APIs that are secure, predictable, and easy to maintain.