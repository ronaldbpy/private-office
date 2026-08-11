-- CreateTable health_weights
CREATE TABLE "health_weights" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "sourceRecordId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "health_weights_pkey" PRIMARY KEY ("id")
);

-- CreateTable medications
CREATE TABLE "medications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "doseMg" DOUBLE PRECISION,
    "unit" TEXT NOT NULL DEFAULT 'mg',
    "category" TEXT,
    "prescribedBy" TEXT,
    "prescribedDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "frequency" TEXT NOT NULL,
    "timesPerDay" INTEGER NOT NULL DEFAULT 1,
    "scheduledTimes" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "autoNotify" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable medication_doses
CREATE TABLE "medication_doses" (
    "id" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "doseDate" TIMESTAMP(3) NOT NULL,
    "taken" BOOLEAN NOT NULL DEFAULT false,
    "takenAt" TIMESTAMP(3),
    "reminderSentAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medication_doses_pkey" PRIMARY KEY ("id")
);

-- CreateTable apple_health_import_logs
CREATE TABLE "apple_health_import_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recordsProcessed" INTEGER NOT NULL,
    "recordsImported" INTEGER NOT NULL,
    "recordsSkipped" INTEGER NOT NULL,
    "sourceFile" TEXT,
    "errors" TEXT,

    CONSTRAINT "apple_health_import_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "health_weights_userId_idx" ON "health_weights"("userId");

-- CreateIndex
CREATE INDEX "health_weights_date_idx" ON "health_weights"("date");

-- CreateUniqueIndex
CREATE UNIQUE INDEX "health_weights_userId_date_weightKg_key" ON "health_weights"("userId", "date", "weightKg");

-- CreateIndex
CREATE INDEX "medications_userId_idx" ON "medications"("userId");

-- CreateIndex
CREATE INDEX "medications_isActive_idx" ON "medications"("isActive");

-- CreateIndex
CREATE INDEX "medication_doses_userId_idx" ON "medication_doses"("userId");

-- CreateIndex
CREATE INDEX "medication_doses_medicationId_idx" ON "medication_doses"("medicationId");

-- CreateIndex
CREATE INDEX "medication_doses_doseDate_idx" ON "medication_doses"("doseDate");

-- CreateUniqueIndex
CREATE UNIQUE INDEX "medication_doses_medicationId_doseDate_key" ON "medication_doses"("medicationId", "doseDate");

-- CreateIndex
CREATE INDEX "apple_health_import_logs_userId_idx" ON "apple_health_import_logs"("userId");

-- AddForeignKey
ALTER TABLE "medication_doses" ADD CONSTRAINT "medication_doses_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
