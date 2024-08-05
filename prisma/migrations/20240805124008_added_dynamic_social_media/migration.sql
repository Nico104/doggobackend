-- CreateTable
CREATE TABLE "ContactOnSocialMedia" (
    "contact_id" INTEGER NOT NULL,
    "social_media_Id" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "social_media_account_name" TEXT NOT NULL,

    CONSTRAINT "ContactOnSocialMedia_pkey" PRIMARY KEY ("contact_id","social_media_Id")
);

-- CreateTable
CREATE TABLE "SocialMedia" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imagepath" TEXT NOT NULL,

    CONSTRAINT "SocialMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContactOnSocialMedia" ADD CONSTRAINT "ContactOnSocialMedia_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "Contact"("contact_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactOnSocialMedia" ADD CONSTRAINT "ContactOnSocialMedia_social_media_Id_fkey" FOREIGN KEY ("social_media_Id") REFERENCES "SocialMedia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
