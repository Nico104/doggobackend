/*
  Warnings:

  - Added the required column `scan_ip_address` to the `Scan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scan" ADD COLUMN     "scan_ip_address" TEXT NOT NULL;
