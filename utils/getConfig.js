// const fs = require('fs')
// const path = require('path')
const getConfig = async () => {
    let resetConfig = require('./resetConfig')
    // const file = await fs.promises.access(path.resolve(__dirname, '../src/config.json')).then(() => true).catch(_ => false)
    let config = require('../config.js')
    if (!config.username || !config.key || !config.url) {
        config = await resetConfig()
    }
    return Promise.resolve(config)
}

exports.getConfig = getConfig