-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "hide_contacts" BOOLEAN NOT NULL DEFAULT false;

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

-- AddForeignKey
ALTER TABLE "ContactUs" ADD CONSTRAINT "ContactUs_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
