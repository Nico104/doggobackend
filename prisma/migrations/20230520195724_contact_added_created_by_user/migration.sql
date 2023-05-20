/*
  Warnings:

  - Added the required column `userUseremail` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "userUseremail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userUseremail_fkey" FOREIGN KEY ("userUseremail") REFERENCES "User"("useremail") ON DELETE RESTRICT ON UPDATE CASCADE;
