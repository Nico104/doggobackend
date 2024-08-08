-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "scan_hide_contacts" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scan_hide_description" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scan_hide_documents" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scan_hide_information" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scan_hide_medical" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "scan_hide_pictures" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "hide_contacts" SET DEFAULT true,
ALTER COLUMN "hide_documents" SET DEFAULT true;
