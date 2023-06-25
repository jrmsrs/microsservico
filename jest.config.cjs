module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/**/*.d.ts', '!<rootDir>/src/**/*.spec.ts', '!<rootDir>/src/**/*.test.ts', '!<rootDir>/src/server.ts'],
  coverageDirectory: 'coverage',
  modulePathIgnorePatterns: ['ignore'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
