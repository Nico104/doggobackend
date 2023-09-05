/*
  Warnings:

  - You are about to drop the column `document_type` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "document_type";

-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "langauge_flag_image_path" TEXT NOT NULL DEFAULT 'flags/langauge/english_flag.png',
ADD COLUMN     "language_key_translate" TEXT NOT NULL DEFAULT 'EN';

-- DropEnum
DROP TYPE "DocumentType";
