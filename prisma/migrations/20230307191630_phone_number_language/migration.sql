-- AlterTable
ALTER TABLE "PhoneNumber" ADD COLUMN     "languageLanguage_key" TEXT NOT NULL DEFAULT 'en';

-- AddForeignKey
ALTER TABLE "PhoneNumber" ADD CONSTRAINT "PhoneNumber_languageLanguage_key_fkey" FOREIGN KEY ("languageLanguage_key") REFERENCES "Language"("language_key") ON DELETE RESTRICT ON UPDATE CASCADE;
