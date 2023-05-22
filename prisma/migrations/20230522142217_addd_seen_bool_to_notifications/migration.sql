-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userUseremail_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "seen" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userUseremail_fkey" FOREIGN KEY ("userUseremail") REFERENCES "User"("useremail") ON DELETE CASCADE ON UPDATE CASCADE;
