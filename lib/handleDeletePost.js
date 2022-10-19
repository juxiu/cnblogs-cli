const { deletePost } = require('./methods')
const fs = require('fs')
const fm = require('front-matter')
const path = require('path')
const ora = require('ora')
const chalk = require('chalk')

const inquirer = require('inquirer')
// 删除blog
const handleDeletePost = async (fileName) => {
    console.log(chalk.green(`start deleting……`));
    const postPath = path.resolve(process.cwd(), fileName)
    // 判断文件是否存在
    const file = await fs.promises.access(path.resolve(__dirname, postPath)).then(() => true).catch(_ => false)
    if (file) {
        let data = fm(fs.readFileSync(postPath, 'utf8'))
        const postTitle = data.title || path.parse(postPath).name
        if (data.attributes.postid) {
            console.log(chalk.green(`正在请求删除《${postTitle}》……`));
            const delRes = await deletePost({
                postid: data.attributes.postid,
                publish: 1
            })
            if (delRes) {
                console.log(chalk.green(`博客园《${postTitle}》已删除……`));
                // 如果文件存在则询问是否删除本地文件
                const { deleteLocalFile } = await inquirer.prompt([{
                    name: 'deleteLocalFile',
                    type: 'list',
                    message: '是否删除本地文件？',
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
                if (deleteLocalFile) {
                    // 删除本地文件
                    fs.rmSync(postPath);
                    console.log(chalk.green(`本地文件《${postTitle}》已被移除……`))
                } else {
                    // 删除本地文件中的postid
                    data.frontmatter = data.frontmatter.replace(/postid:\s\d+/, '')
                    console.log(data.frontmatter, 'data.frontmatter');
                    const writeData = data.frontmatter ? `---\n${data.frontmatter}\n---\n${data.body}` : data.body
                    fs.writeFileSync(postPath, writeData)
                    console.log(chalk.green(`本地文件《${postTitle}》中postid已被移除……`))
                }
            }
        } else {
            const { deleteLocalFile } = await inquirer.prompt([{
                name: 'deleteLocalFile',
                type: 'list',
                message: '文件无id,是否删除本地文件？',
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
            if (deleteLocalFile) {
                // 删除本地文件
                fs.rmSync(postPath);
                console.log(chalk.green(`本地文件《${postTitle}》已被移除……`))
            }
        }
    } else {
        return Promise.reject('文件不存在')
    }
}

exports.handleDeletePost = handleDeletePost