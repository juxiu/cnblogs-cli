const { getUsersBlogs, newPost, getRecentPosts, getPost, deletePost, getCategories, newCategory, editPost } = require('../src/methods')
const checkConfig = require('./checkConfig')
const gitInit = require('./gitInit')
const Loading = require('./loading')
const ora = require('ora')
const log = require('./log.js')
const path = require('path')

const fs = require('fs')
const { promisify } = require('util')

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
const init = async () => {
    await checkConfig()
    const params = {
        pageSize: 1
    }
    Loading.start(`pulling blog....`)
    let res = await getRecentPosts(params)
    if (res.faultCode) {
        log.error(res.faultCode, res.faultString)
        Loading.stop()
        return
    }
    Loading.succeed(`pull to ${res.length} blogs`)
    const { repeatFiles, noRepeats } = checkRepeatFile(res)
    if (repeatFiles.length > 0) {
        const logStr = repeatFiles.map(item => {
            return path.resolve(cwdPath, `${item.title}.md`)
        }).join('\n')
        console.log(chalk.green(logStr));
        const { isWrite } = await inquirer.prompt([{
            name: 'isWrite',
            type: 'list',
            message: 'above files already exist. Do you want to overwrite them?',
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
    Loading.start(`write blogs to ${cwdPath}....`)
    fs.writeFile = promisify(fs.writeFile)
    const promiseArr = res.map(item => {
        const yaml = `---\npostid: ${item.postid}\n---`
        const fileData = `${yaml}\n${item.description}`
        return fs.writeFile(path.resolve(cwdPath, `${item.title}.md`), fileData)
    })
    await Promise.all(promiseArr);
    Loading.succeed(`${res.length} pieces have been pulled!`)
    const an = await inquirer.prompt([{
        name: 'watch',
        type: 'list',
        message: 'watch files?',
        choices: [{
            name: 'yes',
            value: true
        }, {
            name: 'no',
            value: false
        }]
    }])
    if (an) {
        gitInit()
    }
}

module.exports = init