-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "useremail" TEXT NOT NULL,
    "userSignUpDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userpassword" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Pet" (
    "profile_id" SERIAL NOT NULL,
    "profile_creation_DateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pet_profile_username" TEXT NOT NULL,
    "pet_name" TEXT NOT NULL,
    "pet_gender" "Gender" NOT NULL,
    "pet_chip_id" TEXT NOT NULL,
    "pet_owner_name" TEXT NOT NULL,
    "pet_owner_email" TEXT NOT NULL,
    "pet_owner_living_place" TEXT NOT NULL,
    "pet_owner_facebook" TEXT NOT NULL,
    "pet_owner_instagram" TEXT NOT NULL,
    "pet_is_Lost" BOOLEAN NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "Description" (
    "description_id" SERIAL NOT NULL,
    "petProfile_id" INTEGER,

    CONSTRAINT "Description_pkey" PRIMARY KEY ("description_id")
);

-- CreateTable
CREATE TABLE "ImportantInformation" (
    "important_information_id" SERIAL NOT NULL,
    "petProfile_id" INTEGER,

    CONSTRAINT "ImportantInformation_pkey" PRIMARY KEY ("important_information_id")
);

-- CreateTable
CREATE TABLE "PhoneNumber" (
    "phone_number_id" SERIAL NOT NULL,
    "petProfile_id" INTEGER,
    "phone_number" TEXT NOT NULL,
    "phone_number_priority" INTEGER NOT NULL,

    CONSTRAINT "PhoneNumber_pkey" PRIMARY KEY ("phone_number_id")
);

-- CreateTable
CREATE TABLE "Document" (
    "document_id" SERIAL NOT NULL,
    "petProfile_id" INTEGER,
    "document_name" TEXT NOT NULL,
    "document_link" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "PetPicture" (
    "pet_picture_id" SERIAL NOT NULL,
    "petProfile_id" INTEGER,
    "pet_picture_link" TEXT NOT NULL,
    "pet_picture_priority" INTEGER NOT NULL,

    CONSTRAINT "PetPicture_pkey" PRIMARY KEY ("pet_picture_id")
);

-- CreateTable
CREATE TABLE "Scan" (
    "scan_id" SERIAL NOT NULL,
    "petProfile_id" INTEGER,
    "scan_DateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("scan_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_useremail_key" ON "User"("useremail");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_pet_profile_username_fkey" FOREIGN KEY ("pet_profile_username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Description" ADD CONSTRAINT "Description_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportantInformation" ADD CONSTRAINT "ImportantInformation_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneNumber" ADD CONSTRAINT "PhoneNumber_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetPicture" ADD CONSTRAINT "PetPicture_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE SET NULL ON UPDATE CASCADE;
