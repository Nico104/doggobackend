-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "contact_creation_DateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "contact_description" DROP NOT NULL,
ALTER COLUMN "contact_description" DROP DEFAULT;
