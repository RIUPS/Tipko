module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  // run tests serially to avoid port/db race in CI/local
  maxWorkers: 1
};
