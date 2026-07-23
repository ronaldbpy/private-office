-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('LEGAL_ENTITY', 'PERSONAL_PROFILE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'CONTADOR', 'ASISTENTE', 'GERENTE');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('SUPPLIER', 'CLIENT', 'EXTERNAL_PARTNER', 'ATTORNEY', 'BANK', 'FAMILY_MEMBER', 'OTHER');

-- CreateTable
CREATE TABLE "entities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EntityType" NOT NULL,
    "taxId" TEXT,
    "jurisdiction" TEXT,
    "baseCurrency" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_access" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_change_log" (
    "id" TEXT NOT NULL,
    "userAccessId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "beforeState" TEXT,
    "afterState" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_change_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parties" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "taxId" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "relationshipType" "RelationshipType" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "party_banking_details" (
    "id" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "accountType" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "party_banking_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "party_entity_links" (
    "id" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "party_entity_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obligations" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "activeSince" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "obligations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obligation_due_rules" (
    "id" TEXT NOT NULL,
    "obligationId" TEXT NOT NULL,
    "ruleText" TEXT,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "obligation_due_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_access_clerkUserId_entityId_key" ON "user_access"("clerkUserId", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "party_banking_details_partyId_key" ON "party_banking_details"("partyId");

-- CreateIndex
CREATE UNIQUE INDEX "party_entity_links_partyId_entityId_key" ON "party_entity_links"("partyId", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "obligations_entityId_code_key" ON "obligations"("entityId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "obligation_due_rules_obligationId_key" ON "obligation_due_rules"("obligationId");

-- AddForeignKey
ALTER TABLE "user_access" ADD CONSTRAINT "user_access_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_change_log" ADD CONSTRAINT "access_change_log_userAccessId_fkey" FOREIGN KEY ("userAccessId") REFERENCES "user_access"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "party_banking_details" ADD CONSTRAINT "party_banking_details_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "parties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "party_entity_links" ADD CONSTRAINT "party_entity_links_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "parties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "party_entity_links" ADD CONSTRAINT "party_entity_links_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obligations" ADD CONSTRAINT "obligations_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obligation_due_rules" ADD CONSTRAINT "obligation_due_rules_obligationId_fkey" FOREIGN KEY ("obligationId") REFERENCES "obligations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
