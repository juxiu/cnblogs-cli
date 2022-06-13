const { deletePost, newPost } = require('../src/methods')
const getDiffs = require('./gitDiff')
const shell = require("shelljs");
const path = require('path')
const log = require('./log')
const fs = require('fs')
const chalk = require('chalk')
const cwd = process.cwd()
const handleBlogs = async (deleteArr) => {
    const { M, A } = await getDiffs()
    const D = deleteArr
    // M 修改  D删除 A添加
    const MArr = M.concat(A).map(item => {
        return newPost({ filePath: path.resolve(cwd, item) })
    })
    const DArr = D.map(item => deletePost({ postid: item }))
    const result = await Promise.all(MArr.concat(DArr))
    const pathArr = M.concat(A, D)
    const errData = result.filter((item, index) => {
        if (item.faultCode) {
            return { ...item, path: pathArr[index] }
        }
        return false
    })
    if (errData.length > 0) {
        errData.forEach(item => {
            log.error(item.faultCode, `${item.faultString} in ${item.path}`)
        })
        return Promise.resolve(false)
    } else {
        M.forEach(item => {
            log.info('success', `${chalk.green(path.resolve(cwd, item))} has been changed`)
        })
        A.forEach(item => {
            log.info('success', `${chalk.green(path.resolve(cwd, item))} has been added`)
        })
        D.forEach(item => {
            log.info('success', `${chalk.green(path.resolve(cwd, item))} has been deleted`)
        })
    }
    return Promise.resolve(true)
}
const pushBlogs = async (commit) => {
    const remoteInfo = shell.exec('git remote -v')
    // console.log(remoteInfo);
    // const git = remoteInfo.stdout.split('\n').join('').split('origin').join().split('\t').filter(item => {
    //     return /^http.+\(push\)$/g.test(item)
    // })
    const hasGitRemote = remoteInfo.stdout != ''
    if (hasGitRemote) {
        shell.exec(`git pull`)
    }
    const deleteDiff = shell.exec(`git diff --diff-filter=D`).stdout
    let deleteArr = []
    if (deleteDiff != '') {
        deleteArr = deleteDiff.match(/postid\: \d+/g).map(item => {
            return item.replace('postid:', '').trim()
        })
    }
    shell.exec('git add .')
    const res = await handleBlogs(deleteArr)
    if (res) {
        shell.exec('git add .')
        shell.exec(`git commit -m "${commit}"`)
    }
    if (hasGitRemote) {
        shell.exec('git push')
    }
}
module.exports = pushBlogs