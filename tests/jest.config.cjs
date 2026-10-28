const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '..'),
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  moduleDirectories: ['node_modules'],
  modulePaths: [path.join(__dirname, 'node_modules')],
  transform: {
    '^.+\\.js$': [require.resolve('babel-jest'), {
      babelrc: false,
      configFile: false,
      presets: [[require.resolve('@babel/preset-env'), { targets: { node: 'current' } }]]
    }]
  },
  testTimeout: 120000,
  clearMocks: true
};
