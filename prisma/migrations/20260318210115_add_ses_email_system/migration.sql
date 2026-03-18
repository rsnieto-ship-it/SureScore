-- CreateEnum
CREATE TYPE "ClientEmailStatus" AS ENUM ('DRAFT', 'SENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "Unsubscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "list" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Unsubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "htmlBody" TEXT NOT NULL,
    "senderAlias" TEXT NOT NULL DEFAULT 'info',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientEmail" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "htmlBody" TEXT NOT NULL,
    "plainBody" TEXT,
    "senderAlias" TEXT NOT NULL DEFAULT 'info',
    "list" TEXT NOT NULL DEFAULT 'product-updates',
    "templateId" TEXT,
    "status" "ClientEmailStatus" NOT NULL DEFAULT 'DRAFT',
    "targetTags" TEXT[],
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "failCount" INTEGER NOT NULL DEFAULT 0,
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientEmailSend" (
    "id" TEXT NOT NULL,
    "clientEmailId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientEmailSend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientEmailOpen" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clientEmailId" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientEmailOpen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientEmailClick" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clientEmailId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientEmailClick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InboundEmail" (
    "id" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "fromName" TEXT,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyText" TEXT,
    "bodyHtml" TEXT,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "actions" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "InboundEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Unsubscription_email_idx" ON "Unsubscription"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Unsubscription_email_list_key" ON "Unsubscription"("email", "list");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_name_key" ON "EmailTemplate"("name");

-- CreateIndex
CREATE INDEX "ClientEmailSend_clientEmailId_idx" ON "ClientEmailSend"("clientEmailId");

-- CreateIndex
CREATE INDEX "ClientEmailSend_email_idx" ON "ClientEmailSend"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientEmailSend_clientEmailId_email_key" ON "ClientEmailSend"("clientEmailId", "email");

-- CreateIndex
CREATE INDEX "ClientEmailOpen_email_idx" ON "ClientEmailOpen"("email");

-- CreateIndex
CREATE INDEX "ClientEmailOpen_clientEmailId_idx" ON "ClientEmailOpen"("clientEmailId");

-- CreateIndex
CREATE INDEX "ClientEmailClick_email_idx" ON "ClientEmailClick"("email");

-- CreateIndex
CREATE INDEX "ClientEmailClick_clientEmailId_idx" ON "ClientEmailClick"("clientEmailId");

-- CreateIndex
CREATE INDEX "InboundEmail_fromEmail_idx" ON "InboundEmail"("fromEmail");

-- CreateIndex
CREATE INDEX "InboundEmail_toEmail_idx" ON "InboundEmail"("toEmail");

-- CreateIndex
CREATE INDEX "InboundEmail_category_idx" ON "InboundEmail"("category");

-- CreateIndex
CREATE INDEX "InboundEmail_status_idx" ON "InboundEmail"("status");

-- AddForeignKey
ALTER TABLE "ClientEmailSend" ADD CONSTRAINT "ClientEmailSend_clientEmailId_fkey" FOREIGN KEY ("clientEmailId") REFERENCES "ClientEmail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
