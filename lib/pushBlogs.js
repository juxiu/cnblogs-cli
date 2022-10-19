const { deletePost, newPost } = require('./methods')
const { handleDeletePost } = require('./handleDeletePost')

const { publishPost } = require('./publishPost')
const getDiffs = require('../utils/gitDiff')
const shell = require("shelljs");
const path = require('path')
const log = require('../utils/log')
const fs = require('fs')
const chalk = require('chalk')
const cwd = process.cwd()
const handleBlogs = async (deleteArr = []) => {
    const { M, A, D } = await getDiffs()
    // M 修改  D删除 A添加
    const MArr = M.concat(A).map(item => {
        return publishPost(item)
    })
    const DArr = deleteArr.map(item => deletePost({ postid: item, publish: 1 }))
    const result = await Promise.all(MArr.concat(DArr))
    const pathArr = M.concat(A, D)
    const errData = result.filter((item, index) => {
        if (item.faultCode) {
            return { ...item, path: pathArr[index] }
        }
        return false
    })
    let funResult = {}
    if (errData.length > 0) {
        errData.forEach(item => {
            log.error(item.faultCode, `${item.faultString} in ${item.path}`)
        })
        funResult.ok = false
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
        funResult.ok = true
        funResult.data = { A, M, D }
    }
    return Promise.resolve(funResult)
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
    // 获取删除文件内容 用正则提取出postid
    const deleteDiff = shell.exec(`git diff --diff-filter=D`).stdout
    let deleteArr = []
    if (deleteDiff != '') {
        deleteArr = deleteDiff.match(/postid\: \d+/g).map(item => {
            return item.replace('postid:', '').trim()
        })
    }
    shell.exec('git add .')
    const res = await handleBlogs(deleteArr)
    if (res.ok) {
        shell.exec('git add .')
        const commitStr = commit || `add ${res.data.A.concat(res.data.M).join('\n')}\ndelete ${res.data.D.join('\n')}`
        shell.exec(`git commit -m "${commitStr}"`)
    }
    if (hasGitRemote) {
        shell.exec('git push')
    }
}
module.exports = pushBlogs