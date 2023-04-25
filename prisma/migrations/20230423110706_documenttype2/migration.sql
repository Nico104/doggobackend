/*
  Warnings:

  - Added the required column `document_type` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "document_type" "DocumentType" NOT NULL;
