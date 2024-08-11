/*
  Warnings:

  - Added the required column `tagModelTagModel` to the `CollarTag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CollarTag" ADD COLUMN     "tagModelTagModel" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TagModel" (
    "tagModel" SERIAL NOT NULL,
    "tagModel_shortName" TEXT NOT NULL,
    "tagModel_Description" TEXT NOT NULL,
    "tagModel_Label" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagModel_pkey" PRIMARY KEY ("tagModel")
);

-- CreateIndex
CREATE UNIQUE INDEX "TagModel_tagModel_shortName_key" ON "TagModel"("tagModel_shortName");

-- CreateIndex
CREATE UNIQUE INDEX "TagModel_tagModel_Description_key" ON "TagModel"("tagModel_Description");

-- AddForeignKey
ALTER TABLE "CollarTag" ADD CONSTRAINT "CollarTag_tagModelTagModel_fkey" FOREIGN KEY ("tagModelTagModel") REFERENCES "TagModel"("tagModel") ON DELETE RESTRICT ON UPDATE CASCADE;
