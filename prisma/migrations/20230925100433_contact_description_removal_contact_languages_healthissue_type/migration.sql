/*
  Warnings:

  - You are about to drop the column `contactDescriptionContact_description_id` on the `Contact` table. All the data in the column will be lost.
  - The `health_issue_type` column on the `HealthIssue` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ContactDescription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_contactDescriptionContact_description_id_fkey";

-- DropForeignKey
ALTER TABLE "ContactDescription" DROP CONSTRAINT "ContactDescription_uid_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "contactDescriptionContact_description_id",
ADD COLUMN     "contact_description" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "HealthIssue" DROP COLUMN "health_issue_type",
ADD COLUMN     "health_issue_type" TEXT NOT NULL DEFAULT 'Allergies';

-- DropTable
DROP TABLE "ContactDescription";

-- DropEnum
DROP TYPE "HealthIssueType";

-- CreateTable
CREATE TABLE "_ContactToLanguage" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContactToLanguage_AB_unique" ON "_ContactToLanguage"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactToLanguage_B_index" ON "_ContactToLanguage"("B");

-- AddForeignKey
ALTER TABLE "_ContactToLanguage" ADD CONSTRAINT "_ContactToLanguage_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("contact_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToLanguage" ADD CONSTRAINT "_ContactToLanguage_B_fkey" FOREIGN KEY ("B") REFERENCES "Language"("language_key") ON DELETE CASCADE ON UPDATE CASCADE;
