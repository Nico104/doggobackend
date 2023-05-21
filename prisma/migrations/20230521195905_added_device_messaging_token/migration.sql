-- CreateTable
CREATE TABLE "DeviceMessagingToken" (
    "token" TEXT NOT NULL,
    "createdDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignDateTime" TIMESTAMP(3) NOT NULL,
    "userUseremail" TEXT NOT NULL,

    CONSTRAINT "DeviceMessagingToken_pkey" PRIMARY KEY ("token")
);

-- AddForeignKey
ALTER TABLE "DeviceMessagingToken" ADD CONSTRAINT "DeviceMessagingToken_userUseremail_fkey" FOREIGN KEY ("userUseremail") REFERENCES "User"("useremail") ON DELETE RESTRICT ON UPDATE CASCADE;
