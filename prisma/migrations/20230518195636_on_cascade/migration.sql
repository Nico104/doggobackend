-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_petProfile_id_fkey";

-- DropForeignKey
ALTER TABLE "Description" DROP CONSTRAINT "Description_petProfile_id_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_petProfile_id_fkey";

-- DropForeignKey
ALTER TABLE "ImportantInformation" DROP CONSTRAINT "ImportantInformation_petProfile_id_fkey";

-- DropForeignKey
ALTER TABLE "PetPicture" DROP CONSTRAINT "PetPicture_petProfile_id_fkey";

-- DropForeignKey
ALTER TABLE "PhoneNumber" DROP CONSTRAINT "PhoneNumber_contactContact_id_fkey";

-- DropForeignKey
ALTER TABLE "Scan" DROP CONSTRAINT "Scan_petProfile_id_fkey";

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Description" ADD CONSTRAINT "Description_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportantInformation" ADD CONSTRAINT "ImportantInformation_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneNumber" ADD CONSTRAINT "PhoneNumber_contactContact_id_fkey" FOREIGN KEY ("contactContact_id") REFERENCES "Contact"("contact_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetPicture" ADD CONSTRAINT "PetPicture_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;
