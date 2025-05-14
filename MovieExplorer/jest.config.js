module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage',
  testMatch: ['**/__tests__/**/*.test.{js,jsx,ts,tsx}'],
};
