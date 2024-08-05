-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NONE');

-- CreateTable
CREATE TABLE "Country" (
    "country_key" TEXT NOT NULL,
    "country_flag_image_path" TEXT NOT NULL,
    "country_phone_prefix" TEXT NOT NULL,
    "language_key" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("country_key")
);

-- CreateTable
CREATE TABLE "Language" (
    "language_key" TEXT NOT NULL,
    "language_key_translate" TEXT NOT NULL DEFAULT 'EN',
    "language_label" TEXT NOT NULL,
    "language_isAvailableForAppTranslation" BOOLEAN NOT NULL DEFAULT false,
    "langauge_flag_image_path" TEXT NOT NULL DEFAULT 'flags/langauge/english_flag.png',

    CONSTRAINT "Language_pkey" PRIMARY KEY ("language_key")
);

-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "displayName" TEXT,
    "email" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL,
    "userSignUpDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "DeviceMessagingToken" (
    "token" TEXT NOT NULL,
    "uid" TEXT NOT NULL,

    CONSTRAINT "DeviceMessagingToken_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notificationId" SERIAL NOT NULL,
    "notificationType" TEXT NOT NULL,
    "notificationTitle" TEXT NOT NULL,
    "notificationBody" TEXT NOT NULL,
    "creationDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "uid" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationId")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "uid" TEXT NOT NULL,
    "userAppLanguageKey" TEXT NOT NULL DEFAULT 'en',

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "uid" TEXT NOT NULL,
    "notification1" BOOLEAN NOT NULL DEFAULT true,
    "notification2" BOOLEAN NOT NULL DEFAULT true,
    "notification3" BOOLEAN NOT NULL DEFAULT true,
    "notification4" BOOLEAN NOT NULL DEFAULT true,
    "notification5" BOOLEAN NOT NULL DEFAULT true,
    "email1" BOOLEAN NOT NULL DEFAULT true,
    "email2" BOOLEAN NOT NULL DEFAULT true,
    "email3" BOOLEAN NOT NULL DEFAULT true,
    "email4" BOOLEAN NOT NULL DEFAULT true,
    "email5" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "UserLogins" (
    "userLgoin_id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "ipAddress" TEXT,
    "loginDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLogins_pkey" PRIMARY KEY ("userLgoin_id")
);

-- CreateTable
CREATE TABLE "CollarTag" (
    "collarTag_id" TEXT NOT NULL,
    "petProfile_id" INTEGER,
    "uid" TEXT,
    "assignedDate" TIMESTAMP(3),
    "activationCode" TEXT NOT NULL,
    "picturePath" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollarTag_pkey" PRIMARY KEY ("collarTag_id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "profile_id" SERIAL NOT NULL,
    "profile_creation_DateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uid" TEXT NOT NULL,
    "pet_name" TEXT NOT NULL,
    "pet_gender" "Gender",
    "pet_chip_id" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "pet_is_Lost" BOOLEAN NOT NULL,
    "pet_is_lost_text" TEXT NOT NULL DEFAULT '',
    "hide_contacts" BOOLEAN NOT NULL DEFAULT false,
    "hide_information" BOOLEAN NOT NULL DEFAULT false,
    "hide_medical" BOOLEAN NOT NULL DEFAULT true,
    "hide_pictures" BOOLEAN NOT NULL DEFAULT false,
    "hide_documents" BOOLEAN NOT NULL DEFAULT false,
    "hide_description" BOOLEAN NOT NULL DEFAULT false,
    "pet_tattooID" TEXT,
    "pet_licenceID" TEXT,
    "pet_favorite_toys" TEXT,
    "pet_favorite_activities" TEXT,
    "pet_behavioral_notes" TEXT,
    "pet_special_needs" TEXT,
    "pet_diet_preferences" TEXT,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "contact_id" SERIAL NOT NULL,
    "contact_creation_DateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contact_name" TEXT NOT NULL,
    "contact_picture_link" TEXT,
    "contact_description" TEXT NOT NULL DEFAULT '',
    "contact_email" TEXT,
    "contact_address" TEXT,
    "contact_facebook" TEXT,
    "contact_instagram" TEXT,
    "uid" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("contact_id")
);

-- CreateTable
CREATE TABLE "Description" (
    "petProfile_id" INTEGER NOT NULL,
    "description_text" TEXT NOT NULL,
    "description_language_key" TEXT NOT NULL,

    CONSTRAINT "Description_pkey" PRIMARY KEY ("petProfile_id","description_language_key")
);

-- CreateTable
CREATE TABLE "PhoneNumber" (
    "phone_number_id" SERIAL NOT NULL,
    "phone_number" TEXT NOT NULL,
    "phone_number_priority" INTEGER NOT NULL DEFAULT 0,
    "countryLanguage_key" TEXT,
    "contactContact_id" INTEGER,

    CONSTRAINT "PhoneNumber_pkey" PRIMARY KEY ("phone_number_id")
);

-- CreateTable
CREATE TABLE "HealthIssue" (
    "health_issue_id" SERIAL NOT NULL,
    "health_issue_name" TEXT NOT NULL,
    "health_issue_type" TEXT NOT NULL DEFAULT 'Allergies',
    "documentDocument_id" INTEGER,
    "medicalInformationMedical_information_id" INTEGER NOT NULL,

    CONSTRAINT "HealthIssue_pkey" PRIMARY KEY ("health_issue_id")
);

-- CreateTable
CREATE TABLE "MedicalInformation" (
    "medical_information_id" SERIAL NOT NULL,
    "petProfile_id" INTEGER NOT NULL,
    "sterilized" BOOLEAN,
    "breed" TEXT,
    "age" TEXT,
    "vaccinations" TEXT,
    "allergies" TEXT,
    "medications" TEXT,
    "chronicConditions" TEXT,

    CONSTRAINT "MedicalInformation_pkey" PRIMARY KEY ("medical_information_id")
);

-- CreateTable
CREATE TABLE "BehaviourInformation" (
    "behaviour_information_id" SERIAL NOT NULL,
    "petProfile_id" INTEGER NOT NULL,
    "good_with_kids" BOOLEAN,
    "good_with_cats" BOOLEAN,
    "good_with_dogs" BOOLEAN,
    "good_with_cars" BOOLEAN,
    "good_with_strangers" BOOLEAN,

    CONSTRAINT "BehaviourInformation_pkey" PRIMARY KEY ("behaviour_information_id")
);

-- CreateTable
CREATE TABLE "Document" (
    "document_id" SERIAL NOT NULL,
    "petProfile_id" INTEGER NOT NULL,
    "document_name" TEXT NOT NULL,
    "document_link" TEXT NOT NULL,
    "content_type" TEXT NOT NULL DEFAULT 'udf',
    "size_megabyte" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "PetPicture" (
    "pet_picture_id" SERIAL NOT NULL,
    "petProfile_id" INTEGER NOT NULL,
    "pet_picture_link" TEXT NOT NULL,
    "pet_picture_priority" INTEGER NOT NULL,
    "size_megabyte" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "PetPicture_pkey" PRIMARY KEY ("pet_picture_id")
);

-- CreateTable
CREATE TABLE "Scan" (
    "scan_id" SERIAL NOT NULL,
    "petProfile_id" INTEGER NOT NULL,
    "scan_DateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scan_ip_address" TEXT NOT NULL,
    "scan_city" TEXT NOT NULL,
    "scan_country" TEXT NOT NULL,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("scan_id")
);

-- CreateTable
CREATE TABLE "ContactUs" (
    "contact_us_id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "declared_name" TEXT NOT NULL,
    "declared_email" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ContactUs_pkey" PRIMARY KEY ("contact_us_id")
);

-- CreateTable
CREATE TABLE "DeletedUser" (
    "delted_user_id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "DeletedUser_pkey" PRIMARY KEY ("delted_user_id")
);

-- CreateTable
CREATE TABLE "_ContactToPet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ContactToLanguage" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_country_key_key" ON "Country"("country_key");

-- CreateIndex
CREATE UNIQUE INDEX "Language_language_key_key" ON "Language"("language_key");

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CollarTag_collarTag_id_key" ON "CollarTag"("collarTag_id");

-- CreateIndex
CREATE UNIQUE INDEX "CollarTag_activationCode_key" ON "CollarTag"("activationCode");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalInformation_petProfile_id_key" ON "MedicalInformation"("petProfile_id");

-- CreateIndex
CREATE UNIQUE INDEX "BehaviourInformation_petProfile_id_key" ON "BehaviourInformation"("petProfile_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ContactToPet_AB_unique" ON "_ContactToPet"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactToPet_B_index" ON "_ContactToPet"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContactToLanguage_AB_unique" ON "_ContactToLanguage"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactToLanguage_B_index" ON "_ContactToLanguage"("B");

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_language_key_fkey" FOREIGN KEY ("language_key") REFERENCES "Language"("language_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceMessagingToken" ADD CONSTRAINT "DeviceMessagingToken_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userAppLanguageKey_fkey" FOREIGN KEY ("userAppLanguageKey") REFERENCES "Language"("language_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLogins" ADD CONSTRAINT "UserLogins_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollarTag" ADD CONSTRAINT "CollarTag_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollarTag" ADD CONSTRAINT "CollarTag_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Description" ADD CONSTRAINT "Description_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Description" ADD CONSTRAINT "Description_description_language_key_fkey" FOREIGN KEY ("description_language_key") REFERENCES "Language"("language_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneNumber" ADD CONSTRAINT "PhoneNumber_countryLanguage_key_fkey" FOREIGN KEY ("countryLanguage_key") REFERENCES "Country"("country_key") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneNumber" ADD CONSTRAINT "PhoneNumber_contactContact_id_fkey" FOREIGN KEY ("contactContact_id") REFERENCES "Contact"("contact_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthIssue" ADD CONSTRAINT "HealthIssue_documentDocument_id_fkey" FOREIGN KEY ("documentDocument_id") REFERENCES "Document"("document_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthIssue" ADD CONSTRAINT "HealthIssue_medicalInformationMedical_information_id_fkey" FOREIGN KEY ("medicalInformationMedical_information_id") REFERENCES "MedicalInformation"("medical_information_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalInformation" ADD CONSTRAINT "MedicalInformation_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehaviourInformation" ADD CONSTRAINT "BehaviourInformation_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetPicture" ADD CONSTRAINT "PetPicture_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactUs" ADD CONSTRAINT "ContactUs_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToPet" ADD CONSTRAINT "_ContactToPet_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("contact_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToPet" ADD CONSTRAINT "_ContactToPet_B_fkey" FOREIGN KEY ("B") REFERENCES "Pet"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToLanguage" ADD CONSTRAINT "_ContactToLanguage_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("contact_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToLanguage" ADD CONSTRAINT "_ContactToLanguage_B_fkey" FOREIGN KEY ("B") REFERENCES "Language"("language_key") ON DELETE CASCADE ON UPDATE CASCADE;
