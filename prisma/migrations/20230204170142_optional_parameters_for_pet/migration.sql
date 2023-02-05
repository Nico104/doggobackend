-- AlterTable
ALTER TABLE "Pet" ALTER COLUMN "pet_chip_id" DROP NOT NULL,
ALTER COLUMN "pet_owner_name" DROP NOT NULL,
ALTER COLUMN "pet_owner_email" DROP NOT NULL,
ALTER COLUMN "pet_owner_living_place" DROP NOT NULL,
ALTER COLUMN "pet_owner_facebook" DROP NOT NULL,
ALTER COLUMN "pet_owner_instagram" DROP NOT NULL;
