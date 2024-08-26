-- AlterTable
ALTER TABLE "AccessTokenBlackList" ALTER COLUMN "expiry_timestamp" SET DEFAULT (NOW() + '15 minutes'::interval);
