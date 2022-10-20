#!/usr/bin/env node
const program = require('commander')
const { config } = require('shelljs')
program.version(require('./package.json').version)
// const log = require('../lib/log')

program
    .command('init [num]')
    .option('--d,--dir [dir]', '博文存放文件夹')
    .description('init')
    .action(async (num, dir) => {
        const init = require('./lib/init')
        init(num)
    })

program
    .command('publish <fileName>')
    .alias('p')
    .description('publish blog')
    .action(name => {
        const { publishPost } = require('./lib/publishPost')
        publishPost(name)
    })

program
    .command('delete <fileName>')
    .alias('d')
    .description('delete post')
    .action(async (fileName) => {
        const { handleDeletePost } = require('./lib/handleDeletePost')
        handleDeletePost(fileName)
    })

program
    .command('categories')
    .alias('cate')
    .description('delete post')
    .action(async (fileName) => {
        const { getCategories } = require('./lib/methods')
        const cates = await getCategories()
        console.log(cates.filter(item => item.title.includes('[随笔分类]')).map(item => item.title).join('\n'));
    })
program
    .command('reset')
    .alias('r')
    .description('reset config')
    .action(async () => {
        const resetConfig = require('./utils/resetConfig')
        await resetConfig()
    })
program
    .command('clear')
    .alias('c')
    .description('clear config')
    .action(async () => {
        const fs = require('fs')
        const file = await fs.promises.access(path.resolve(__dirname, './config.json')).then(() => true).catch(_ => false)
        if (file) {
            fs.rmSync('./config.json')
            console.log(chalk.green('本地配置已被清除'));
        } else {
            console.log(chalk.green('本地没有配置信息'));
        }
    })

program
    .command('push [commit]')
    .description('推送博客到博客园')
    .action(async (commit) => {
        const pushBlogs = require('./lib/pushBlogs')
        pushBlogs(commit)
    })

program
    .command('userinfo')
    .alias('info')
    .description('查看本地配置信息')
    .action(async (commit) => {
        const fs = require('fs')
        const path = require('path')
        const chalk = require('chalk')
        const file = await fs.promises.access(path.resolve(__dirname, './config.json')).then(() => true).catch(_ => false)
        if (file) {
            const config = require('./config.json')
            const str = Object.entries(config).map(item => item.join(':')).join('\n')
            console.log(chalk.green(str));
        } else {
            console.log(chalk.green('本地没有配置信息'));
        }
    })

program.parse(process.argv);
