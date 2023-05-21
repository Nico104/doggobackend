/*
  Warnings:

  - You are about to drop the column `assignDateTime` on the `DeviceMessagingToken` table. All the data in the column will be lost.
  - You are about to drop the column `createdDateTime` on the `DeviceMessagingToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DeviceMessagingToken" DROP COLUMN "assignDateTime",
DROP COLUMN "createdDateTime";
