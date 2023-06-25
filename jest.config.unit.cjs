const config = require('./jest.config.cjs')
config.testRegex = '.*\\.spec\\.ts$'
config.coverageDirectory = 'coverage/unit'
module.exports = config
