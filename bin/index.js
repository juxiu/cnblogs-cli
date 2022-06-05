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
        log.info('success', 'Reset successful!')
    })

program.parse(process.argv);
