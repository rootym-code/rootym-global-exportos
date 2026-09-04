-- CreateTable
CREATE TABLE "WorkspaceInvitation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInvitation_tokenHash_key" ON "WorkspaceInvitation"("tokenHash");

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_tenantId_idx" ON "WorkspaceInvitation"("tenantId");

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_invitedById_idx" ON "WorkspaceInvitation"("invitedById");

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_email_idx" ON "WorkspaceInvitation"("email");

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_expiresAt_idx" ON "WorkspaceInvitation"("expiresAt");

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_acceptedAt_idx" ON "WorkspaceInvitation"("acceptedAt");

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_revokedAt_idx" ON "WorkspaceInvitation"("revokedAt");

-- AddForeignKey
ALTER TABLE "WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
