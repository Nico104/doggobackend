/*
  Warnings:

  - You are about to drop the column `language_country` on the `Language` table. All the data in the column will be lost.
  - You are about to drop the column `language_country_prefix` on the `Language` table. All the data in the column will be lost.
  - You are about to drop the column `language_image_path` on the `Language` table. All the data in the column will be lost.
  - You are about to drop the column `languageLanguage_key` on the `PhoneNumber` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PhoneNumber" DROP CONSTRAINT "PhoneNumber_languageLanguage_key_fkey";

-- AlterTable
ALTER TABLE "Language" DROP COLUMN "language_country",
DROP COLUMN "language_country_prefix",
DROP COLUMN "language_image_path";

-- AlterTable
ALTER TABLE "PhoneNumber" DROP COLUMN "languageLanguage_key",
ADD COLUMN     "countryLanguage_key" TEXT;

-- CreateTable
CREATE TABLE "Country" (
    "country_key" TEXT NOT NULL,
    "country_flag_image_path" TEXT NOT NULL,
    "country_phone_prefix" TEXT NOT NULL,
    "language_key" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("country_key")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_country_key_key" ON "Country"("country_key");

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_language_key_fkey" FOREIGN KEY ("language_key") REFERENCES "Language"("language_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneNumber" ADD CONSTRAINT "PhoneNumber_countryLanguage_key_fkey" FOREIGN KEY ("countryLanguage_key") REFERENCES "Country"("country_key") ON DELETE SET NULL ON UPDATE CASCADE;
