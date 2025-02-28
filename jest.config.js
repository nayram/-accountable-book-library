module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@resources/(.*)$': '<rootDir>/src/resources/$1',
  },
}
