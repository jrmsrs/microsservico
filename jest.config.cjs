module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/**/*.d.ts', '!<rootDir>/src/**/*.spec.ts', '!<rootDir>/src/**/*.test.ts', '!<rootDir>/src/app.ts', '!<rootDir>/src/server.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
