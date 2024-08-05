/*
  Warnings:

  - You are about to drop the column `countryLanguage_key` on the `PhoneNumber` table. All the data in the column will be lost.
  - You are about to drop the `Country` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Country" DROP CONSTRAINT "Country_language_key_fkey";

-- DropForeignKey
ALTER TABLE "PhoneNumber" DROP CONSTRAINT "PhoneNumber_countryLanguage_key_fkey";

-- AlterTable
ALTER TABLE "PhoneNumber" DROP COLUMN "countryLanguage_key";

-- DropTable
DROP TABLE "Country";
