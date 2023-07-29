-- CreateEnum
CREATE TYPE "GalleryStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "galleries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "GalleryStatus" NOT NULL DEFAULT 'DRAFT',
    "slug" TEXT,
    "photos_data" JSONB,
    "photos_count" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "galleries_slug_key" ON "galleries"("slug");

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
