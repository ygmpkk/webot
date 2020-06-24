module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 20000,
  testPathIgnorePatterns: ['/node_modules/', '/dist/', 'config/test.js'],
};
