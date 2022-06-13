const checkConfig = async () => {
    const resetPassword = require('./resetPassword')
    let config = undefined
    try {
        config = require('../src/config.json')
    } catch (error) {
    }
    if (!config || !config.username || !config.password || !config.url) {
        await resetPassword()
    }
}

module.exports = checkConfig