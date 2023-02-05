/*
  Warnings:

  - The primary key for the `Description` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description_id` on the `Description` table. All the data in the column will be lost.
  - The primary key for the `ImportantInformation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `important_information_id` on the `ImportantInformation` table. All the data in the column will be lost.
  - The primary key for the `PhoneNumber` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `phone_number_id` on the `PhoneNumber` table. All the data in the column will be lost.
  - Added the required column `description_language_key` to the `Description` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_text` to the `Description` table without a default value. This is not possible if the table is not empty.
  - Made the column `petProfile_id` on table `Description` required. This step will fail if there are existing NULL values in that column.
  - Made the column `petProfile_id` on table `Document` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `important_information_language_key` to the `ImportantInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `important_information_text` to the `ImportantInformation` table without a default value. This is not possible if the table is not empty.
  - Made the column `petProfile_id` on table `ImportantInformation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `petProfile_id` on table `PetPicture` required. This step will fail if there are existing NULL values in that column.
  - Made the column `petProfile_id` on table `PhoneNumber` required. This step will fail if there are existing NULL values in that column.
  - Made the column `petProfile_id` on table `Scan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Description" DROP CONSTRAINT "Description_petProfile_id_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_petProfile_id_fkey";

-- DropForeignKey
ALTER TABLE "ImportantInformation" DROP CONSTRAINT "ImportantInformation_petProfile_id_fkey";

-- DropForeignKey
ALTER TABLE "PetPicture" DROP CONSTRAINT "PetPicture_petProfile_id_fkey";

-- DropForeignKey
ALTER TABLE "PhoneNumber" DROP CONSTRAINT "PhoneNumber_petProfile_id_fkey";

-- DropForeignKey
ALTER TABLE "Scan" DROP CONSTRAINT "Scan_petProfile_id_fkey";

-- AlterTable
ALTER TABLE "Description" DROP CONSTRAINT "Description_pkey",
DROP COLUMN "description_id",
ADD COLUMN     "description_language_key" TEXT NOT NULL,
ADD COLUMN     "description_text" TEXT NOT NULL,
ALTER COLUMN "petProfile_id" SET NOT NULL,
ADD CONSTRAINT "Description_pkey" PRIMARY KEY ("petProfile_id", "description_language_key");

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "petProfile_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "ImportantInformation" DROP CONSTRAINT "ImportantInformation_pkey",
DROP COLUMN "important_information_id",
ADD COLUMN     "important_information_language_key" TEXT NOT NULL,
ADD COLUMN     "important_information_text" TEXT NOT NULL,
ALTER COLUMN "petProfile_id" SET NOT NULL,
ADD CONSTRAINT "ImportantInformation_pkey" PRIMARY KEY ("petProfile_id", "important_information_language_key");

-- AlterTable
ALTER TABLE "PetPicture" ALTER COLUMN "petProfile_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "PhoneNumber" DROP CONSTRAINT "PhoneNumber_pkey",
DROP COLUMN "phone_number_id",
ALTER COLUMN "petProfile_id" SET NOT NULL,
ADD CONSTRAINT "PhoneNumber_pkey" PRIMARY KEY ("petProfile_id", "phone_number");

-- AlterTable
ALTER TABLE "Scan" ALTER COLUMN "petProfile_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Description" ADD CONSTRAINT "Description_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportantInformation" ADD CONSTRAINT "ImportantInformation_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneNumber" ADD CONSTRAINT "PhoneNumber_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetPicture" ADD CONSTRAINT "PetPicture_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;
