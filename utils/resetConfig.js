const fs = require('fs')
const path = require('path')
const log = require('./log')
const clear = require('clear')
const inquirer = require('inquirer')
let config = require('../config')
const resetConfig = async () => {
    const res = await inquirer.prompt([{
        name: 'username',
        type: 'input',
        message: 'Please enter your cnblogs username:'
    }, {
        name: 'key',
        type: 'input',
        message: '博客园访问:'
    }, {
        name: 'url',
        type: 'input',
        message: 'MetaWeblog访问地址(博客园管理>设置>其他设置):'
    }])
    for (const key in res) {
        res[key] = res[key].trim()
    }
    config.username = res.username
    config.key = res.key
    config.url = res.url
    // fs.writeFileSync(path.resolve(__dirname, '../src/', 'config.json'), JSON.stringify(res))
    clear()
    log.info('success', 'Configuration reset!')
    return Promise.resolve(res)
}
module.exports = resetConfig