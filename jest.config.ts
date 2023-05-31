/** @type {import('ts-jest').JestConfigWithTsJest} */

const jestConfig = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: true,
};

export default jestConfig;
