-- CreateTable
CREATE TABLE "DeletedUser" (
    "delted_user_id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "DeletedUser_pkey" PRIMARY KEY ("delted_user_id")
);
