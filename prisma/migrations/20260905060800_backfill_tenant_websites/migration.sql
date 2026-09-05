/*
  ============================================================
  ROOTYM Global ExportOS
  ============================================================
  Author: Prem Singh
  Purpose: Backfills the tenant-owned Website record for
           existing SaaS customer workspaces created before
           automatic Website provisioning was introduced.
  ============================================================
*/

INSERT INTO "Website" (
  "id",
  "tenantId",
  "name",
  "slug",
  "isActive",
  "createdAt",
  "updatedAt"
)
SELECT
  'website_' || t."id",
  t."id",
  t."name" || ' Website',
  t."slug",
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Tenant" AS t
WHERE NOT EXISTS (
  SELECT 1
  FROM "Website" AS w
  WHERE w."tenantId" = t."id"
);