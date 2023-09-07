/*
  Warnings:

  - A unique constraint covering the columns `[petProfile_id]` on the table `BehaviourInformation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[petProfile_id]` on the table `MedicalInformation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BehaviourInformation_petProfile_id_key" ON "BehaviourInformation"("petProfile_id");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalInformation_petProfile_id_key" ON "MedicalInformation"("petProfile_id");
