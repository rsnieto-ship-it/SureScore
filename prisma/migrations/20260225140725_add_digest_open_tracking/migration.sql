-- CreateTable
CREATE TABLE "DigestOpen" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "digestId" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DigestOpen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DigestOpen_email_idx" ON "DigestOpen"("email");

-- CreateIndex
CREATE INDEX "DigestOpen_digestId_idx" ON "DigestOpen"("digestId");
