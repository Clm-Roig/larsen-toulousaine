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

  { name: "Metal Expérimental" },
  { name: "Metal Symphonique" },

  { name: "Blues" },
  { name: "Électro" },
  { name: "Folk" },
  { name: "Jazz" },
  { name: "Rap" },
  { name: "Rock" },
];

const places = [
  { name: "Axis Musique", address: "7 impasse Boudeville", city: "Toulouse" },
  {
    name: "Bikini",
    address: "Rue Théodore Monod, Parc Technologique du Canal",
    city: "Ramonville-Saint-Agne",
  },
  { name: "Connexion Live", address: "8 rue Gabriel Péri", city: "Toulouse" },
  { name: "Engrenage", address: "14 rue Louis Renault", city: "Balma" },
  {
    name: "Espace Claude Ducert",
    address: "1 avenue Paul Riquet",
    city: "Labège",
  },
  { name: "Loupiote", address: "39 rue Reclusane", city: "Toulouse" },
  {
    name: "Metronum",
    address: "2 rond-point Madame de Mondonville",
    city: "Toulouse",
  },
  { name: "Rex", address: "15 avenue Honoré Serres", city: "Toulouse" },
  { name: "Usine à Musique", address: "Rue Louis Bonin", city: "Toulouse" },
  { name: "Zénith", address: "11 avenue Raymond Badiou", city: "Toulouse" },
];

async function main() {
  await prisma.$transaction(
    genres.map((genre) =>
      prisma.genre.upsert({
        where: { name: genre.name },
        update: {},
        create: genre,
      }),
    ),
  );

  await prisma.$transaction(
    places.map((place) =>
      prisma.place.upsert({
        where: { name: place.name },
        update: {},
        create: place,
      }),
    ),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
