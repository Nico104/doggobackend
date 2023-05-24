/*
  Warnings:

  - You are about to drop the column `assignedUseremail` on the `CollarTag` table. All the data in the column will be lost.
  - You are about to drop the column `userUseremail` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `userUseremail` on the `ContactDescription` table. All the data in the column will be lost.
  - You are about to drop the column `userUseremail` on the `DeviceMessagingToken` table. All the data in the column will be lost.
  - You are about to drop the column `userUseremail` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `pet_profile_username` on the `Pet` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `useremail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userpassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userUseremail` on the `UserLogins` table. All the data in the column will be lost.
  - You are about to drop the `ChangeEmailVerificationCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PendingAccount` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[uid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uid` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `ContactDescription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `DeviceMessagingToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `UserLogins` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChangeEmailVerificationCode" DROP CONSTRAINT "ChangeEmailVerificationCode_userUseremail_fkey";

-- DropForeignKey
ALTER TABLE "CollarTag" DROP CONSTRAINT "CollarTag_assignedUseremail_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_userUseremail_fkey";

-- DropForeignKey
ALTER TABLE "ContactDescription" DROP CONSTRAINT "ContactDescription_userUseremail_fkey";

-- DropForeignKey
ALTER TABLE "DeviceMessagingToken" DROP CONSTRAINT "DeviceMessagingToken_userUseremail_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userUseremail_fkey";

-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_pet_profile_username_fkey";

-- DropForeignKey
ALTER TABLE "UserLogins" DROP CONSTRAINT "UserLogins_userUseremail_fkey";

-- DropIndex
DROP INDEX "User_useremail_key";

-- AlterTable
ALTER TABLE "CollarTag" DROP COLUMN "assignedUseremail",
ADD COLUMN     "uid" TEXT;

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "userUseremail",
ADD COLUMN     "uid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ContactDescription" DROP COLUMN "userUseremail",
ADD COLUMN     "uid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DeviceMessagingToken" DROP COLUMN "userUseremail",
ADD COLUMN     "uid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "userUseremail",
ADD COLUMN     "uid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "pet_profile_username",
ADD COLUMN     "uid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "name",
DROP COLUMN "useremail",
DROP COLUMN "userpassword",
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "providerId" TEXT NOT NULL,
ADD COLUMN     "uid" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "UserLogins" DROP COLUMN "userUseremail",
ADD COLUMN     "uid" TEXT NOT NULL;

-- DropTable
DROP TABLE "ChangeEmailVerificationCode";

-- DropTable
DROP TABLE "PendingAccount";

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- AddForeignKey
ALTER TABLE "DeviceMessagingToken" ADD CONSTRAINT "DeviceMessagingToken_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLogins" ADD CONSTRAINT "UserLogins_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollarTag" ADD CONSTRAINT "CollarTag_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactDescription" ADD CONSTRAINT "ContactDescription_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
