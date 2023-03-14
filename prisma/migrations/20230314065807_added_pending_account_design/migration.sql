-- CreateTable
CREATE TABLE "PendingAccount" (
    "pendingAccountId" SERIAL NOT NULL,
    "pendingEmail" TEXT NOT NULL,
    "verificationCode" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingAccount_pkey" PRIMARY KEY ("pendingAccountId")
);

-- CreateTable
CREATE TABLE "UserLogins" (
    "userLgoin_id" SERIAL NOT NULL,
    "userUseremail" TEXT NOT NULL,
    "ipAddress" TEXT,
    "loginDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLogins_pkey" PRIMARY KEY ("userLgoin_id")
);

-- AddForeignKey
ALTER TABLE "UserLogins" ADD CONSTRAINT "UserLogins_userUseremail_fkey" FOREIGN KEY ("userUseremail") REFERENCES "User"("useremail") ON DELETE RESTRICT ON UPDATE CASCADE;
