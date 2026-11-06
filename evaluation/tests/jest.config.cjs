module.exports = {
  rootDir: '/app',
  roots: ['/tests'],
  testEnvironment: 'node',
  testMatch: ['/tests/**/*.test.js'],
  moduleDirectories: ['node_modules'],
  modulePaths: ['/app/tests/node_modules'],
  transform: { '^.+\\.js$': ['/app/tests/node_modules/babel-jest', {
    babelrc: false, configFile: false,
    presets: [['/app/tests/node_modules/@babel/preset-env', { targets: { node: 'current' } }]]
  }] },
  testTimeout: 120000,
  clearMocks: true
};
