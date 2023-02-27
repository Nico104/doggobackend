/*
  Warnings:

  - A unique constraint covering the columns `[collarTag_id]` on the table `CollarTagPersonalisation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CollarTagPersonalisation_collarTag_id_key" ON "CollarTagPersonalisation"("collarTag_id");
