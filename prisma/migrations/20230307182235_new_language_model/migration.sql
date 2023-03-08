-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "language_country" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "language_country_prefix" TEXT NOT NULL DEFAULT '';
