-- AlterTable
ALTER TABLE "MedicalInformation" ADD COLUMN     "age" TEXT,
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "breed" TEXT,
ADD COLUMN     "chronicConditions" TEXT,
ADD COLUMN     "medications" TEXT,
ADD COLUMN     "vaccinations" TEXT;

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "pet_behavioral_notes" TEXT,
ADD COLUMN     "pet_diet_preferences" TEXT,
ADD COLUMN     "pet_favorite_activities" TEXT,
ADD COLUMN     "pet_favorite_toys" TEXT,
ADD COLUMN     "pet_licenceID" TEXT,
ADD COLUMN     "pet_special_needs" TEXT,
ADD COLUMN     "pet_tattooID" TEXT;
