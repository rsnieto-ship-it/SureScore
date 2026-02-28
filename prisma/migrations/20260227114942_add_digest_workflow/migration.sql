-- CreateEnum
CREATE TYPE "DigestStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'SENDING_BATCH_1', 'SENT_BATCH_1', 'SENDING_BATCH_2', 'SENT_COMPLETE');

-- CreateTable
CREATE TABLE "Digest" (
    "id" TEXT NOT NULL,
    "weekOf" TIMESTAMP(3) NOT NULL,
    "status" "DigestStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "subject" TEXT,
    "htmlContent" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Digest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigestCandidate" (
    "id" TEXT NOT NULL,
    "digestId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "published" TIMESTAMP(3) NOT NULL,
    "isTexas" BOOLEAN NOT NULL DEFAULT false,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "take" TEXT,

    CONSTRAINT "DigestCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigestSend" (
    "id" TEXT NOT NULL,
    "digestId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "batch" INTEGER NOT NULL,

    CONSTRAINT "DigestSend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DigestCandidate_digestId_idx" ON "DigestCandidate"("digestId");

-- CreateIndex
CREATE UNIQUE INDEX "DigestCandidate_digestId_position_key" ON "DigestCandidate"("digestId", "position");

-- CreateIndex
CREATE INDEX "DigestSend_digestId_idx" ON "DigestSend"("digestId");

-- CreateIndex
CREATE INDEX "DigestSend_email_idx" ON "DigestSend"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DigestSend_digestId_email_key" ON "DigestSend"("digestId", "email");

-- AddForeignKey
ALTER TABLE "DigestCandidate" ADD CONSTRAINT "DigestCandidate_digestId_fkey" FOREIGN KEY ("digestId") REFERENCES "Digest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigestSend" ADD CONSTRAINT "DigestSend_digestId_fkey" FOREIGN KEY ("digestId") REFERENCES "Digest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
