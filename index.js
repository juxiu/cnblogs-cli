#!/usr/bin/env node
const program = require('commander')
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
// program
//     .command('reset')
//     .alias('r')
//     .description('reset config')
//     .action(async () => {
//         const resetPassword = require('../lib/resetPassword')
//         await resetPassword()
//     })

program
    .command('push [commit]')
    .description('push')
    .action(async (commit) => {
        const pushBlogs = require('./lib/pushBlogs')
        pushBlogs(commit)
    })

program
    .command('aaa')
    .description('push')
    .action(async (commit) => {
        console.log('dddddd');
    })

program.parse(process.argv);
