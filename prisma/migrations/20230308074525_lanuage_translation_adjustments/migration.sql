-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "language_isAvailableForAppTranslation" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "language_country" DROP DEFAULT,
ALTER COLUMN "language_country_prefix" DROP DEFAULT;
