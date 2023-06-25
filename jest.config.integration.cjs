const config = require('./jest.config.cjs')
config.testRegex = '.*\\.test\\.ts$'
config.coverageDirectory = 'coverage/integration'
module.exports = config
