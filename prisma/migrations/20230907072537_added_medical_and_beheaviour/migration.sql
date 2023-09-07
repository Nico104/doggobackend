-- CreateEnum
CREATE TYPE "HealthIssueType" AS ENUM ('Allergies', 'Medication');

-- CreateTable
CREATE TABLE "HealthIssue" (
    "health_issue_id" SERIAL NOT NULL,
    "health_issue_name" TEXT NOT NULL,
    "health_issue_type" "HealthIssueType" NOT NULL,
    "documentDocument_id" INTEGER NOT NULL,
    "health_issue_text" TEXT NOT NULL,
    "medicalInformationMedical_information_id" INTEGER NOT NULL,

    CONSTRAINT "HealthIssue_pkey" PRIMARY KEY ("health_issue_id")
);

-- CreateTable
CREATE TABLE "MedicalInformation" (
    "medical_information_id" SERIAL NOT NULL,
    "petProfile_id" INTEGER NOT NULL,
    "sterilized" BOOLEAN,

    CONSTRAINT "MedicalInformation_pkey" PRIMARY KEY ("medical_information_id")
);

-- CreateTable
CREATE TABLE "BehaviourInformation" (
    "behaviour_information_id" SERIAL NOT NULL,
    "petProfile_id" INTEGER NOT NULL,
    "good_with_kids" BOOLEAN,
    "good_with_cats" BOOLEAN,
    "good_with_dogs" BOOLEAN,

    CONSTRAINT "BehaviourInformation_pkey" PRIMARY KEY ("behaviour_information_id")
);

-- AddForeignKey
ALTER TABLE "HealthIssue" ADD CONSTRAINT "HealthIssue_documentDocument_id_fkey" FOREIGN KEY ("documentDocument_id") REFERENCES "Document"("document_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthIssue" ADD CONSTRAINT "HealthIssue_medicalInformationMedical_information_id_fkey" FOREIGN KEY ("medicalInformationMedical_information_id") REFERENCES "MedicalInformation"("medical_information_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalInformation" ADD CONSTRAINT "MedicalInformation_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehaviourInformation" ADD CONSTRAINT "BehaviourInformation_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;
