/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_pet_profile_username_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "username",
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("useremail");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_pet_profile_username_fkey" FOREIGN KEY ("pet_profile_username") REFERENCES "User"("useremail") ON DELETE RESTRICT ON UPDATE CASCADE;
