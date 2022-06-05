#!/usr/bin/env node
const program = require('commander')
program.version(require('../package.json').version)

program
    .command('publish <fileName>')
    .alias('p')
    .description('publish blog')
    .action(name => {
        const publishBlog = require('../lib/publishBlog')
        publishBlog(name)
    })

program.parse(process.argv);
