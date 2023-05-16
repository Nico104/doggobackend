/*
  Warnings:

  - You are about to drop the column `contact_living_place` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "contact_living_place",
ADD COLUMN     "contact_address" TEXT;
