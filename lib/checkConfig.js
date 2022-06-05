
const checkConfig = async () => {
    const resetPassword = require('./resetPassword')
    const config = require('../src/config.json')
    if (!config.username || !config.password || !config.url) {
        await resetPassword()
    }
}

module.exports = checkConfig