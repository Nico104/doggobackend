-- CreateTable
CREATE TABLE "ChangeEmailVerificationCode" (
    "changeEmailVerificationCodeId" SERIAL NOT NULL,
    "verificationCode" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "createdDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedDateTime" TIMESTAMP(3),
    "unvalidifiedDateTime" TIMESTAMP(3),

    CONSTRAINT "ChangeEmailVerificationCode_pkey" PRIMARY KEY ("changeEmailVerificationCodeId")
);
