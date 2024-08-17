-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;

-- CreateTable
CREATE TABLE "AccessTokenBlackList" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiry_timestamp" TIMESTAMP(3) NOT NULL DEFAULT (NOW() + '15 minutes'::interval),

    CONSTRAINT "AccessTokenBlackList_pkey" PRIMARY KEY ("id")
);
