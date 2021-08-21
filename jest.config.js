// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/views/',
    '/public/',
    '/models/',
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // A path to a module which exports an async function that is triggered once before all test suites
  globalSetup: './tests/setup.js',

  // A path to a module which exports an async function that is triggered once after all test suites
  globalTeardown: './tests/teardown.js',

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: [
    './tests/globalmocks.js',
  ],

  // The test environment that will be used for testing
  testEnvironment: 'node',
}
