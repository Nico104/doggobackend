/*
  Warnings:

  - You are about to drop the column `pet_owner_email` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `pet_owner_facebook` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `pet_owner_instagram` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `pet_owner_living_place` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `pet_owner_name` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `petProfile_id` on the `PhoneNumber` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PhoneNumber" DROP CONSTRAINT "PhoneNumber_petProfile_id_fkey";

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "pet_owner_email",
DROP COLUMN "pet_owner_facebook",
DROP COLUMN "pet_owner_instagram",
DROP COLUMN "pet_owner_living_place",
DROP COLUMN "pet_owner_name";

-- AlterTable
ALTER TABLE "PhoneNumber" DROP COLUMN "petProfile_id",
ADD COLUMN     "contactContact_id" INTEGER;

-- CreateTable
CREATE TABLE "Contact" (
    "contact_id" SERIAL NOT NULL,
    "contact_name" TEXT,
    "contact_description" TEXT NOT NULL DEFAULT 'other',
    "contact_email" TEXT,
    "contact_living_place" TEXT,
    "contact_facebook" TEXT,
    "contact_instagram" TEXT,
    "petProfile_id" INTEGER NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("contact_id")
);

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneNumber" ADD CONSTRAINT "PhoneNumber_contactContact_id_fkey" FOREIGN KEY ("contactContact_id") REFERENCES "Contact"("contact_id") ON DELETE SET NULL ON UPDATE CASCADE;
