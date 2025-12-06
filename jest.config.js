// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: ["<rootDir>/**/*.{js,jsx,ts,tsx}"],
  coveragePathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "\\.type\\.ts$",
    "constants\\.ts$",
    "__tests__",
  ],
  testEnvironment: "jest-environment-jsdom",
  setupFiles: ["<rootDir>/tests/data.ts"],
  testPathIgnorePatterns: ["__tests__/data.ts"],
};


module.exports = createJestConfig(config);
