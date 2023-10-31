import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const genres = [
  "Black Metal",
  "Deathcore",
  "Death Metal",
  "Doom Metal",
  "Folk Metal",
  "Grindcore",
  "Hardcore",
  "Heavy Metal",
  "Metal",
  "Metalcore",
  "Metal Industriel",
  "Metal Progressif",
  "Néo Metal",
  "Post-Metal",
  "Power Metal",
  "Punk",
  "Stoner",
  "Sludge",
  "Thrash Metal",
];

const places = [
  "Axis Musique",
  "Le Bikini",
  "Le Connexion Live",
  "Le Rex",
  "L'Engrenage",
];

async function main() {
  try {
    await prisma.genre.createMany({
      data: genres.map((genreName) => ({ name: genreName })),
    });
  } catch (e) {
    console.error("Error when seeding genress");
    console.error(e);
  }
  try {
    await prisma.place.createMany({
      data: places.map((placeName) => ({ name: placeName })),
    });
  } catch (e) {
    console.error("Error when seeding places");
    console.error(e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
