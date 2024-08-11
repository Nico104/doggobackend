/*
  Warnings:

  - A unique constraint covering the columns `[publicCode]` on the table `CollarTag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicCode` to the `CollarTag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CollarTag" ADD COLUMN     "publicCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CollarTag_publicCode_key" ON "CollarTag"("publicCode");
