/*
  Warnings:

  - You are about to drop the column `contact_description` on the `Contact` table. All the data in the column will be lost.
  - Made the column `contact_name` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "contact_description",
ADD COLUMN     "contactDescriptionContact_description_id" INTEGER,
ALTER COLUMN "contact_name" SET NOT NULL;

-- CreateTable
CREATE TABLE "ContactDescription" (
    "contact_description_id" SERIAL NOT NULL,
    "contact_description_label" TEXT NOT NULL,
    "contact_description_hex" TEXT NOT NULL,
    "userUseremail" TEXT NOT NULL,
    "contact_description_creation_DateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contact_description_updated_DateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactDescription_pkey" PRIMARY KEY ("contact_description_id")
);

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_contactDescriptionContact_description_id_fkey" FOREIGN KEY ("contactDescriptionContact_description_id") REFERENCES "ContactDescription"("contact_description_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactDescription" ADD CONSTRAINT "ContactDescription_userUseremail_fkey" FOREIGN KEY ("userUseremail") REFERENCES "User"("useremail") ON DELETE RESTRICT ON UPDATE CASCADE;
