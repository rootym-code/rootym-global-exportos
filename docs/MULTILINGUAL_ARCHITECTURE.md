# ROOTYM Global Export Platform

# Multilingual Architecture

**Document Version:** 1.0

**Status:** Approved

**Owner:** ROOTYM AI Team

**Branch:** feature/multilingual-platform

**Applies To:** Public Website Only

**Phase 1 Languages**
- English (en)
- Arabic (ar)
- Sinhala (si)

---

# Purpose

This document defines the architectural decisions for implementing multilingual support in the ROOTYM Global Export Platform.

It serves as the reference for routing, translations, RTL support, SEO, and future language expansion.

---

# Scope

## Included

- Public Website
- Home Page
- Products
- Product Details
- About
- Contact
- Inquiry Forms
- Navigation
- Footer
- Public SEO
- Public Metadata

## Excluded (Phase 1)

- Admin Dashboard
- Admin CMS
- Internal APIs
- Authentication
- ExportOS
- Internal Business Modules

---

# Architecture Decisions

## ADR-001 — Language Strategy

The platform shall support:

| Language | Code | Direction |
|-----------|------|-----------|
| English | en | LTR |
| Arabic | ar | RTL |
| Sinhala | si | LTR |

The architecture shall support unlimited future languages without structural changes.

---

## ADR-002 — URL Strategy

Every public route shall contain a language prefix.

Examples

```
/en
/en/products
/en/contact

/ar
/ar/products

/si
/si/products
```

Visitors accessing:

```
/
```

shall be redirected to

```
/en
```

English shall not receive special routing treatment.

---

## ADR-003 — Routing

Routing is responsible only for:

- Locale detection
- URL resolution
- Language persistence
- Navigation

Routing shall never contain:

- Business logic
- Translation content
- API logic
- Component logic

---

## ADR-004 — Translation Architecture

The application shall use a centralized translation system.

Components shall never contain hardcoded user-facing text.

All display text shall be retrieved through translation resources.

---

## ADR-005 — Component Design

Components shall remain language-agnostic.

Components shall never know:

- Current language
- Translation source
- RTL implementation

Components only render translated content supplied by the localization layer.

---

## ADR-006 — RTL Strategy

Arabic shall automatically enable RTL rendering.

English and Sinhala shall remain LTR.

RTL behavior shall be managed globally rather than individually inside components.

---

## ADR-007 — SEO

Every language shall have:

- Localized metadata
- hreflang tags
- Canonical URLs
- Sitemap entries
- Open Graph metadata

Each language version shall be independently indexable by search engines.

---

## ADR-008 — Navigation

Users shall remain in their selected language while navigating.

Example

```
/en/products

↓

/en/contact
```

Changing language shall keep users on the equivalent page whenever possible.

---

## ADR-009 — Product URLs

Product slugs shall remain in English during Phase 1.

Example

```
/en/products/frozen-french-fries

/ar/products/frozen-french-fries

/si/products/frozen-french-fries
```

Localized slugs may be introduced in future phases if required.

---

## ADR-010 — Future Expansion

Adding a new language shall require only:

- Registering the locale
- Adding translation resources
- Configuring language metadata

No routing redesign or component changes shall be required.

---

# Folder Ownership

The multilingual implementation will primarily affect:

```
app/
components/
messages/ (or locales/)
lib/i18n/
middleware
```

The following remain unaffected:

```
app/admin/
app/api/
prisma/
services/
engine/
presenters/
```

---

# Development Workflow

Each multilingual implementation packet shall follow:

1. Analyze
2. Implement
3. Build
4. Test
5. Review
6. Commit
7. Push

Only one packet shall be developed at a time.

---

# Success Criteria

The multilingual implementation is considered complete when:

- English, Arabic, and Sinhala are fully functional.
- RTL works correctly.
- Navigation preserves language.
- SEO is localized.
- No duplicated pages exist.
- Components remain reusable.
- New languages can be added without architectural changes.

---

# Future Languages

Examples:

- Hindi
- French
- German
- Spanish
- Japanese
- Chinese

The architecture shall support future languages without redesign.

---

# End of Document