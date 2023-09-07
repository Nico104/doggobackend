/*
  Warnings:

  - You are about to drop the column `health_issue_text` on the `HealthIssue` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "HealthIssue" DROP CONSTRAINT "HealthIssue_documentDocument_id_fkey";

-- AlterTable
ALTER TABLE "HealthIssue" DROP COLUMN "health_issue_text",
ALTER COLUMN "documentDocument_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "HealthIssue" ADD CONSTRAINT "HealthIssue_documentDocument_id_fkey" FOREIGN KEY ("documentDocument_id") REFERENCES "Document"("document_id") ON DELETE SET NULL ON UPDATE CASCADE;
