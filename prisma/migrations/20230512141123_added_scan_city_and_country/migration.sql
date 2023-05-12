/*
  Warnings:

  - Added the required column `scan_city` to the `Scan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scan_country` to the `Scan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scan" ADD COLUMN     "scan_city" TEXT NOT NULL,
ADD COLUMN     "scan_country" TEXT NOT NULL;
