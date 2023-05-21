-- DropForeignKey
ALTER TABLE "DeviceMessagingToken" DROP CONSTRAINT "DeviceMessagingToken_userUseremail_fkey";

-- CreateTable
CREATE TABLE "Notification" (
    "notificationId" SERIAL NOT NULL,
    "notificationType" TEXT NOT NULL,
    "notificationTitle" TEXT NOT NULL,
    "notificationBody" TEXT NOT NULL,
    "creationDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "userUseremail" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationId")
);

-- AddForeignKey
ALTER TABLE "DeviceMessagingToken" ADD CONSTRAINT "DeviceMessagingToken_userUseremail_fkey" FOREIGN KEY ("userUseremail") REFERENCES "User"("useremail") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userUseremail_fkey" FOREIGN KEY ("userUseremail") REFERENCES "User"("useremail") ON DELETE RESTRICT ON UPDATE CASCADE;
