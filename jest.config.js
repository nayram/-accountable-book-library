module.exports = {
  preset: 'ts-jest',
  globalSetup: '<rootDir>/__tests__/config/global-setup.ts',
  globalTeardown: '<rootDir>/__tests__/config/global-teardown.ts',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/config/setup-file.ts'],
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { isolatedModules: true }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@resources/(.*)$': '<rootDir>/src/resources/$1',
    '^@api/(.*)$': '<rootDir>/src/apps/api/$1',
  },
};
