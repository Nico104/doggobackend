/*
  Warnings:

  - Added the required column `appBackgroundColorHex` to the `CollarTagPersonalisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appPetTagPrimaryColor` to the `CollarTagPersonalisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appPetTagSecundaryColor` to the `CollarTagPersonalisation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CollarTagPersonalisation" ADD COLUMN     "appBackgroundColorHex" TEXT NOT NULL,
ADD COLUMN     "appPetTagPrimaryColor" TEXT NOT NULL,
ADD COLUMN     "appPetTagSecundaryColor" TEXT NOT NULL;
