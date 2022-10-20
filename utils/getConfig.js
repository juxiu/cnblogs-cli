const fs = require('fs')
const path = require('path')
const getConfig = async () => {
    let config;
    let resetConfig = require('./resetConfig')
    const file = await fs.promises.access(path.resolve(__dirname, '../config.json')).then(() => true).catch(_ => false)
    if (file) {
        config = require('../config.json')
        if (!config || !config.username || !config.key || !config.url) {
            config = await resetConfig()
        }
    } else {
        config = await resetConfig()
    }
    return Promise.resolve(config)
}

exports.getConfig = getConfig