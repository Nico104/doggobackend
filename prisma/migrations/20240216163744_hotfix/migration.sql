-- CreateTable
CREATE TABLE "UserSettings" (
    "uid" TEXT NOT NULL,
    "userAppLanguageKey" TEXT NOT NULL DEFAULT 'en',

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "uid" TEXT NOT NULL,
    "notification1" BOOLEAN NOT NULL DEFAULT true,
    "notification2" BOOLEAN NOT NULL DEFAULT true,
    "notification3" BOOLEAN NOT NULL DEFAULT true,
    "notification4" BOOLEAN NOT NULL DEFAULT true,
    "notification5" BOOLEAN NOT NULL DEFAULT true,
    "email1" BOOLEAN NOT NULL DEFAULT true,
    "email2" BOOLEAN NOT NULL DEFAULT true,
    "email3" BOOLEAN NOT NULL DEFAULT true,
    "email4" BOOLEAN NOT NULL DEFAULT true,
    "email5" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("uid")
);

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userAppLanguageKey_fkey" FOREIGN KEY ("userAppLanguageKey") REFERENCES "Language"("language_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
