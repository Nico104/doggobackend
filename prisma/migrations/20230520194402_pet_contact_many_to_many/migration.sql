/*
  Warnings:

  - You are about to drop the column `petProfile_id` on the `Contact` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_petProfile_id_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "petProfile_id";

-- CreateTable
CREATE TABLE "_ContactToPet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContactToPet_AB_unique" ON "_ContactToPet"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactToPet_B_index" ON "_ContactToPet"("B");

-- AddForeignKey
ALTER TABLE "_ContactToPet" ADD CONSTRAINT "_ContactToPet_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("contact_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToPet" ADD CONSTRAINT "_ContactToPet_B_fkey" FOREIGN KEY ("B") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;
