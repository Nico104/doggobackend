-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "size_megabyte" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PetPicture" ADD COLUMN     "size_megabyte" DOUBLE PRECISION NOT NULL DEFAULT 0;
