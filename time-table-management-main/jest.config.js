/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@database/(.*)$": "<rootDir>/src/database/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@middlewares/(.*)$": "<rootDir>/src/shared/middlewares/$1",
    "^@constants/(.*)$": "<rootDir>/src/shared/constants/$1",
  },
  testTimeout: 30 * 1000, // 30 seconds
  testMatch: ["**/test/**/**.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
