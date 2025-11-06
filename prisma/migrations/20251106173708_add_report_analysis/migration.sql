-- CreateTable
CREATE TABLE "report_analyses" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "summary" TEXT,
    "details" TEXT NOT NULL,
    "actions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "report_analyses_reportId_key" ON "report_analyses"("reportId");

-- AddForeignKey
ALTER TABLE "report_analyses" ADD CONSTRAINT "report_analyses_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
