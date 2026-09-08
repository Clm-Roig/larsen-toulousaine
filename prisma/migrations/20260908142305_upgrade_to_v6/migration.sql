-- AlterTable
ALTER TABLE "_BandToGenre" ADD CONSTRAINT "_BandToGenre_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_BandToGenre_AB_unique";