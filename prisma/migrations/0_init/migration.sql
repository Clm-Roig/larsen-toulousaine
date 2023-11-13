-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MODERATOR', 'ADMIN');

-- CreateTable
CREATE TABLE "Band" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "Band_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gig" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "authorId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "placeId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "ticketReservationLink" TEXT,
    "slug" TEXT NOT NULL,
    "isCanceled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Gig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MODERATOR',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BandToGenre" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BandToGig" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Gig_slug_key" ON "Gig"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_color_key" ON "Genre"("color");

-- CreateIndex
CREATE UNIQUE INDEX "Place_name_key" ON "Place"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_BandToGenre_AB_unique" ON "_BandToGenre"("A", "B");

-- CreateIndex
CREATE INDEX "_BandToGenre_B_index" ON "_BandToGenre"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BandToGig_AB_unique" ON "_BandToGig"("A", "B");

-- CreateIndex
CREATE INDEX "_BandToGig_B_index" ON "_BandToGig"("B");

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BandToGenre" ADD CONSTRAINT "_BandToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "Band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BandToGenre" ADD CONSTRAINT "_BandToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BandToGig" ADD CONSTRAINT "_BandToGig_A_fkey" FOREIGN KEY ("A") REFERENCES "Band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BandToGig" ADD CONSTRAINT "_BandToGig_B_fkey" FOREIGN KEY ("B") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

