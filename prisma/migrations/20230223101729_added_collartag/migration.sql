-- CreateEnum
CREATE TYPE "Color" AS ENUM ('PINK', 'BLUE', 'GREEN', 'YELLOW', 'RED', 'BLACK', 'WHITE');

-- CreateEnum
CREATE TYPE "LetterStyle" AS ENUM ('April1', 'April2', 'April3');

-- CreateTable
CREATE TABLE "CollarTag" (
    "collarTag_id" TEXT NOT NULL,
    "petProfile_id" INTEGER,
    "assignedUseremail" TEXT,
    "activationCode" TEXT NOT NULL,

    CONSTRAINT "CollarTag_pkey" PRIMARY KEY ("collarTag_id")
);

-- CreateTable
CREATE TABLE "CollarTagPersonalisation" (
    "collarTagPersonalisationId" SERIAL NOT NULL,
    "collarTag_id" TEXT NOT NULL,
    "primaryColor" "Color" NOT NULL,
    "secondaryColor" "Color" NOT NULL,
    "baseColor" "Color" NOT NULL,
    "letter" TEXT,
    "letterStyle" "LetterStyle",

    CONSTRAINT "CollarTagPersonalisation_pkey" PRIMARY KEY ("collarTagPersonalisationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollarTag_collarTag_id_key" ON "CollarTag"("collarTag_id");

-- CreateIndex
CREATE UNIQUE INDEX "CollarTag_activationCode_key" ON "CollarTag"("activationCode");

-- AddForeignKey
ALTER TABLE "CollarTag" ADD CONSTRAINT "CollarTag_petProfile_id_fkey" FOREIGN KEY ("petProfile_id") REFERENCES "Pet"("profile_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollarTag" ADD CONSTRAINT "CollarTag_assignedUseremail_fkey" FOREIGN KEY ("assignedUseremail") REFERENCES "User"("useremail") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollarTagPersonalisation" ADD CONSTRAINT "CollarTagPersonalisation_collarTag_id_fkey" FOREIGN KEY ("collarTag_id") REFERENCES "CollarTag"("collarTag_id") ON DELETE RESTRICT ON UPDATE CASCADE;
