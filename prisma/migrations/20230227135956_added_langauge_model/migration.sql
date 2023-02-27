-- CreateTable
CREATE TABLE "Language" (
    "language_key" TEXT NOT NULL,
    "language_label" TEXT NOT NULL,
    "language_image_path" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("language_key")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_language_key_key" ON "Language"("language_key");

-- AddForeignKey
ALTER TABLE "Description" ADD CONSTRAINT "Description_description_language_key_fkey" FOREIGN KEY ("description_language_key") REFERENCES "Language"("language_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportantInformation" ADD CONSTRAINT "ImportantInformation_important_information_language_key_fkey" FOREIGN KEY ("important_information_language_key") REFERENCES "Language"("language_key") ON DELETE RESTRICT ON UPDATE CASCADE;
