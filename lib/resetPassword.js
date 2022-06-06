const fs = require('fs')
const path = require('path')
const log = require('./log')
const clear = require('clear')
const inquirer = require('inquirer')
const resetPassword = async () => {
    const res = await inquirer.prompt([{
        name: 'username',
        type: 'input',
        message: 'Please enter your cnblogs username:'
    }, {
        name: 'password',
        type: 'input',
        message: 'Please enter your cnblogs password:'
    }, {
        name: 'url',
        type: 'input',
        message: 'MetaWeblog访问地址(博客园管理>设置>其他设置):'
    }])
    fs.writeFileSync(path.resolve(__dirname, '../src/', 'config.json'), JSON.stringify(res))
    clear()
    log.info('success', 'Configuration reset!')
    return Promise.resolve(res)
}
module.exports = resetPassword