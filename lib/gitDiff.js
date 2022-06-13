
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const command = 'git diff --name-status --cached HEAD'
// 获取git改动清单
const getArrList = (str, type) => {
    const arr = str.split('\n')
    return arr.filter(item => {
        const regex = new RegExp(`[${type}].*`)
        if (regex.test(item)) {
            return item !== undefined
        }
    })
}
/**
 * @description 获取类型清单
 * @param {*} arr
 * @param {*} type M:修改，D：删除 A：新增
 * @returns
 */
const formatList = (arr, type) => {
    return arr.map(item => {
        return item.replace(/\s/g, '').replace(type, '')
    })
}
const getDiff = async () => {
    const files = await exec(command, 'utf8')
    // // const files = shell.exec(command)
    // const files = shell.exec("git status")
    // console.log('files.stdout', files);
    // return files
    const typeList = ['M', 'D', 'A']
    const result = {}
    typeList.forEach(type => {
        result[type] = formatList(getArrList(files.stdout, type), type)
    })
    return result
}
module.exports = getDiff