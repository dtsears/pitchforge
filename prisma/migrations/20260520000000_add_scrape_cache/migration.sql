-- CreateTable
CREATE TABLE "ScrapeCache" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "extractedData" JSONB NOT NULL,
    "rawHtml" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrapeCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScrapeCache_url_key" ON "ScrapeCache"("url");
