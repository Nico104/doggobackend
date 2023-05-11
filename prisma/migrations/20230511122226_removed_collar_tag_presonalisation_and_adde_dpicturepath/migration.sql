/*
  Warnings:

  - You are about to drop the `CollarTagPersonalisation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `picturePath` to the `CollarTag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CollarTagPersonalisation" DROP CONSTRAINT "CollarTagPersonalisation_collarTag_id_fkey";

-- AlterTable
ALTER TABLE "CollarTag" ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "picturePath" TEXT NOT NULL;

-- DropTable
DROP TABLE "CollarTagPersonalisation";
