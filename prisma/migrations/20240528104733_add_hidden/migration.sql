-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "hide_description" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hide_documents" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hide_information" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hide_medical" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "hide_pictures" BOOLEAN NOT NULL DEFAULT false;
