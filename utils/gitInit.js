const { exec, exit } = require('shelljs')
const getDiffs = require('./gitDiff')
const fs = require('fs')
const path = require('path')
const watchFiles = async () => {
    if (exec('git init').code !== 0) {
        exit()
    }
    if (exec('git config --global core.quotepath false').code !== 0) {
        exit()
    }
    if (exec('git add .').code !== 0) {
        exit()
    }
    if (exec('git commit -m "first commit"').code !== 0) {
        exit()
    }

}

module.exports = watchFiles