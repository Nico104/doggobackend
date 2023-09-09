/*
  Warnings:

  - The primary key for the `ImportantInformation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `important_information_language_key` on the `ImportantInformation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ImportantInformation" DROP CONSTRAINT "ImportantInformation_important_information_language_key_fkey";

-- AlterTable
ALTER TABLE "ImportantInformation" DROP CONSTRAINT "ImportantInformation_pkey",
DROP COLUMN "important_information_language_key",
ADD COLUMN     "important_information_id" SERIAL NOT NULL,
ADD CONSTRAINT "ImportantInformation_pkey" PRIMARY KEY ("important_information_id");
