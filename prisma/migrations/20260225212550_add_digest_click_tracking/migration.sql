-- CreateTable
CREATE TABLE "DigestClick" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "digestId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DigestClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DigestClick_email_idx" ON "DigestClick"("email");

-- CreateIndex
CREATE INDEX "DigestClick_digestId_idx" ON "DigestClick"("digestId");
