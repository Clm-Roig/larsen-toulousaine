import { BandWithGenres } from "@/domain/Band/Band.type";
import { Genre, Place, Role, User, PlaceSize } from "@prisma/client";

export const allGenres: Genre[] = [
  {
    id: "cloevrdbg0000rmm07m7y9fex",
    name: "Black Metal",
    color: "#000000",
  },
  {
    id: "cloevrdbg0001rmm05de24q3u",
    name: "Deathcore",
    color: "#f58231",
  },
  {
    id: "cloevrdbg0002rmm0cv5qjc2z",
    name: "Death Metal",
    color: "#e6194B",
  },
  {
    id: "cloevrdbg0003rmm0d2ifrs15",
    name: "Doom Metal",
    color: "#000075",
  },
  {
    id: "cloevrdbg0004rmm0urjuhjyn",
    name: "Folk Metal",
    color: "#3cb44b",
  },
  {
    id: "cloevrdbg0005rmm0yv8ipucp",
    name: "Grindcore",
    color: "#9A6324",
  },
  {
    id: "cloevrdbg0006rmm0nndw8anb",
    name: "Hardcore",
    color: "#4363d8",
  },
  {
    id: "cloevrdbg0007rmm0n9lhopwb",
    name: "Heavy Metal",
    color: "#ffe119",
  },
  {
    id: "cloevrdbg0008rmm0lruqb588",
    name: "Metal",
    color: "#911eb4",
  },
  {
    id: "cloevrdbg0009rmm08dxq2krx",
    name: "Metalcore",
    color: "#f032e6",
  },
  {
    id: "cloevrdbg000armm0do5q5vtx",
    name: "Metal Industriel",
    color: "#a9a9a9",
  },
  {
    id: "cloevrdbg000brmm0l3hjydd5",
    name: "Metal Progressif",
    color: "#fffac8",
  },
  {
    id: "cloevrdbg000crmm0r9zwwlv3",
    name: "Néo Metal",
    color: "#dcbeff",
  },
  {
    id: "cloevrdbg000drmm0arjlvycg",
    name: "Post-Metal",
    color: "#ffd8b1",
  },
  {
    id: "cloevrdbg000ermm022gdf5of",
    name: "Power Metal",
    color: "#fabed4",
  },
  {
    id: "cloevrdbg000frmm0ay2c6m8j",
    name: "Punk",
    color: "#808000",
  },
  {
    id: "cloevrdbg000grmm0ujq7gx1t",
    name: "Stoner",
    color: "#aaffc3",
  },
  {
    id: "cloevrdbg000hrmm047l36o7t",
    name: "Sludge",
    color: "#800000",
  },
  {
    id: "cloevrdbg000irmm05rx4sipi",
    name: "Thrash Metal",
    color: "#bfef45",
  },
  {
    id: "clolmb2of000595m6opn38twlv",
    name: "Rock",
    color: null,
  },
  {
    id: "clolm95zof000485m6opn38twlv",
    name: "Rap",
    color: null,
  },
];

export const allBands: BandWithGenres[] = [
  {
    id: "cloevz6el0051rmukb32qe4r6",
    name: "Devolution",
    genres: [allGenres[2], allGenres[0]],
    createdAt: new Date(),
    updatedAt: new Date(),
    isATribute: false,
    isLocal: true,
    isSafe: true,
    city: "Toulouse",
    countryCode: "FR",
    regionCode: "OCC",
  },
  {
    id: "cloevz6el0051rmukb32qe59z",
    name: "Band 2",
    genres: [allGenres[8], allGenres[10]],
    createdAt: new Date(),
    updatedAt: new Date(),
    isATribute: false,
    isLocal: true,
    isSafe: true,
    countryCode: "FR",
    regionCode: "OCC",
    city: null,
  },
  {
    id: "cloevz8el0051rmukb32qe4r6",
    name: "Le Groupe 3 Cool",
    genres: [allGenres[1], allGenres[9], allGenres[14]],
    createdAt: new Date(),
    updatedAt: new Date(),
    isATribute: false,
    isLocal: false,
    isSafe: true,
    countryCode: null,
    regionCode: null,
    city: null,
  },
];

export const allPlaces: Place[] = [
  {
    id: "cloev8798l0051rmukb32qe4r6",
    name: "La Cave",
    address: "8 rue du hasard",
    city: "Toulouse",
    website: null,
    isClosed: false,
    isSafe: true,
    latitude: 43.5544818944,
    longitude: 1.3948878703,
    size: PlaceSize.VERY_SMALL,
  },
  {
    id: "cloevz6el0051rmukb32qzz54s",
    name: "L'Elixir",
    address: "78 avenue Chuck Schuldiner",
    city: "Labège",
    website: null,
    isClosed: false,
    isSafe: true,
    latitude: 43.561234658,
    longitude: 1.4298765432,
    size: PlaceSize.SMALL,
  },
  {
    id: "cloevz785z051rmukb32qe4r6",
    name: "Le Stadium très grand",
    address: "5 impasse Lenny",
    city: "Toulouse",
    website: null,
    isClosed: false,
    isSafe: true,
    latitude: 43.596666644,
    longitude: 1.438984894,
    size: PlaceSize.BIG,
  },
];

export const allUsers: User[] = [
  {
    id: "cloev879874051rrhyb32qe4r6",
    pseudo: "User1",
    email: "user1@email.com",
    password: " $2a$12$81kqB9DQzGOqQu6DM9rhzeenWCd.ltMu.JeuIzWcxY.BYRpaj51RK",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: Role.ADMIN,
  },
];
