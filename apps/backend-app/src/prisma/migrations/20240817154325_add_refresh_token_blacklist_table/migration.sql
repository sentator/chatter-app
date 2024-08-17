-- AlterTable
ALTER TABLE "AccessTokenBlackList" ALTER COLUMN "expiry_timestamp" SET DEFAULT (NOW() + '15 minutes'::interval);

-- CreateTable
CREATE TABLE "RefreshTokenBlackList" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiry_timestamp" TIMESTAMP(3) NOT NULL DEFAULT (NOW() + '7 days'::interval),

    CONSTRAINT "RefreshTokenBlackList_pkey" PRIMARY KEY ("id")
);
