
const { getRecentPosts } = require('./methods')
const gitInit = require('../utils/gitInit')
const log = require('../utils/log.js')
const path = require('path')
const ora = require('ora')
const fs = require('fs')
const { promisify } = require('util')
const Loading = new ora()
const chalk = require('chalk')
const cwdPath = process.cwd()
const inquirer = require('inquirer')
const checkRepeatFile = (arr) => {
    const result = {}
    result.repeatFiles = arr.filter(item => {
        return fs.existsSync(path.resolve(cwdPath, `${item.title}.md`))
    });
    result.noRepeats = arr.filter(item => {
        return !fs.existsSync(path.resolve(cwdPath, `${item.title}.md`))
    });
    return result
}
const init = async (num = 2) => {
    console.log(chalk.green('开始拉取博客……'));
    let res = await getRecentPosts(num)
    if (res.faultCode) {
        log.error(res.faultCode, res.faultString)
        return
    }
    Loading.succeed(`pull to ${res.length} blogs`)
    const { repeatFiles, noRepeats } = checkRepeatFile(res)
    if (repeatFiles.length > 0) {
        const logStr = repeatFiles.map(item => {
            // return path.resolve(cwdPath, `${item.title}.md`)
            return `${item.title}.md`
        }).join('\n')
        console.log(chalk.green(logStr));
        const { isWrite } = await inquirer.prompt([{
            name: 'isWrite',
            type: 'list',
            message: `以上文件已存在，是否覆盖？`,
            choices: [
                {
                    name: 'yes',
                    value: true
                },
                {
                    name: 'no',
                    value: false
                }
            ]
        }])
        if (!isWrite) {
            res = noRepeats
        }
    }
    // Loading.start(`write blogs to ${cwdPath}....`)
    console.log(chalk.green(`write blogs to ${cwdPath}....`));
    fs.writeFile = promisify(fs.writeFile)
    const promiseArr = res.map(item => {
        const yaml = `---\npostid: ${item.postid}\n---`
        const fileData = `${yaml}\n${item.description}`
        return fs.writeFile(path.resolve(cwdPath, `${item.title}.md`), fileData)
    })
    await Promise.all(promiseArr);
    Loading.succeed(`${res.length} pieces have been pulled!`)
    const an = await inquirer.prompt([{
        name: 'gitInit',
        type: 'list',
        message: '是否用git管理本地博客？',
        choices: [{
            name: 'yes',
            value: true
        }, {
            name: 'no',
            value: false
        }]
    }])
    if (an.gitInit) {
        gitInit()
    }
}

module.exports = init