import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Color palette source: https://sashamaps.net/docs/resources/20-colors/
const genres = [
  { name: "Black Metal", color: "#000000" },
  { name: "Deathcore", color: "#f58231" },
  { name: "Death Metal", color: "#e6194B" },
  { name: "Doom Metal", color: "#000075" },
  { name: "Folk Metal", color: "#3cb44b" },
  { name: "Grindcore", color: "#9A6324" },
  { name: "Hardcore", color: "#4363d8" },
  { name: "Heavy Metal", color: "#ffe119" },
  { name: "Metal", color: "#911eb4" },
  { name: "Metalcore", color: "#f032e6" },
  { name: "Metal Industriel", color: "#a9a9a9" },
  { name: "Metal Progressif", color: "#fffac8" },
  { name: "Néo Metal", color: "#dcbeff" },
  { name: "Post-Metal", color: "#ffd8b1" },
  { name: "Power Metal", color: "#fabed4" },
  { name: "Punk", color: "#808000" },
  { name: "Stoner", color: "#aaffc3" },
  { name: "Sludge", color: "#800000" },
  { name: "Thrash Metal", color: "#bfef45" },
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
      data: genres.map((genre) => ({ name: genre.name, color: genre.color })),
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
