/*
  Warnings:

  - You are about to drop the column `picturePath` on the `CollarTag` table. All the data in the column will be lost.
  - Added the required column `picturePath` to the `TagModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CollarTag" DROP COLUMN "picturePath";

-- AlterTable
ALTER TABLE "TagModel" ADD COLUMN     "picturePath" TEXT NOT NULL;
