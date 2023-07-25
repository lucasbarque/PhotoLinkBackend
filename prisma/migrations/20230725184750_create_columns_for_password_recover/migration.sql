-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reset_password_expiration" TIMESTAMP(3),
ADD COLUMN     "reset_password_token" TEXT;
