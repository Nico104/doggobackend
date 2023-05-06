/*
  Warnings:

  - The primary key for the `PhoneNumber` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "PhoneNumber" DROP CONSTRAINT "PhoneNumber_pkey",
ADD COLUMN     "phone_number_id" SERIAL NOT NULL,
ALTER COLUMN "phone_number_priority" SET DEFAULT 0,
ADD CONSTRAINT "PhoneNumber_pkey" PRIMARY KEY ("phone_number_id");
