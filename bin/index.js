#!/usr/bin/env node
const program = require('commander')
program.version(require('../package.json').version)
const log = require('../lib/log')

program
    .command('publish <fileName>')
    .alias('p')
    .description('publish blog')
    .action(name => {
        const publishBlog = require('../lib/publishBlog')
        publishBlog(name)
    })

program
    .command('reset')
    .alias('r')
    .description('reset config')
    .action(async () => {
        const resetPassword = require('../lib/resetPassword')
        await resetPassword()
    })

program
    .command('delete <fileName>')
    .alias('d')
    .description('delete blog')
    .action(async (fileName) => {
        const deleteBlog = require('../lib/deleteBlog')
        deleteBlog(fileName)
    })

program
    .command('init')
    .description('init')
    .action(async () => {
        const init = require('../lib/init')
        init()
    })
program
    .command('push <commit>')
    .description('push')
    .action(async (commit) => {
        const pushBlogs = require('../lib/pushBlogs')
        pushBlogs(commit)
    })

program.parse(process.argv);
