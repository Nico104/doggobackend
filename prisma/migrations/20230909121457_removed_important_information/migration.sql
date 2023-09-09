/*
  Warnings:

  - You are about to drop the `ImportantInformation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ImportantInformation" DROP CONSTRAINT "ImportantInformation_petProfile_id_fkey";

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "pet_is_lost_text" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "ImportantInformation";
