/*
  Warnings:

  - You are about to drop the column `baseColor` on the `CollarTagPersonalisation` table. All the data in the column will be lost.
  - You are about to drop the column `primaryColor` on the `CollarTagPersonalisation` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryColor` on the `CollarTagPersonalisation` table. All the data in the column will be lost.
  - Added the required column `baseColorName` to the `CollarTagPersonalisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryColorName` to the `CollarTagPersonalisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondaryColorName` to the `CollarTagPersonalisation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CollarTagPersonalisation" DROP COLUMN "baseColor",
DROP COLUMN "primaryColor",
DROP COLUMN "secondaryColor",
ADD COLUMN     "baseColorName" TEXT NOT NULL,
ADD COLUMN     "primaryColorName" TEXT NOT NULL,
ADD COLUMN     "secondaryColorName" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Color";

-- CreateTable
CREATE TABLE "AppPetPageBackgroundColor" (
    "color" TEXT NOT NULL,
    "colorHex" TEXT NOT NULL,

    CONSTRAINT "AppPetPageBackgroundColor_pkey" PRIMARY KEY ("color")
);

-- CreateTable
CREATE TABLE "AppPetTagColor" (
    "color" TEXT NOT NULL,
    "colorHex" TEXT NOT NULL,

    CONSTRAINT "AppPetTagColor_pkey" PRIMARY KEY ("color")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppPetPageBackgroundColor_color_key" ON "AppPetPageBackgroundColor"("color");

-- CreateIndex
CREATE UNIQUE INDEX "AppPetTagColor_color_key" ON "AppPetTagColor"("color");
