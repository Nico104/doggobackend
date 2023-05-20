-- AlterTable
ALTER TABLE "ChangeEmailVerificationCode" ADD COLUMN     "userUseremail" TEXT;

-- AddForeignKey
ALTER TABLE "ChangeEmailVerificationCode" ADD CONSTRAINT "ChangeEmailVerificationCode_userUseremail_fkey" FOREIGN KEY ("userUseremail") REFERENCES "User"("useremail") ON DELETE SET NULL ON UPDATE CASCADE;
