const { newPost, editPost, replaceImgUrl } = require('./methods')
const fs = require('fs')
const fm = require('front-matter')
const path = require('path')
const ora = require('ora')
const chalk = require('chalk')
// 上传博客
// 获取文件路径，读取文件，判断文件是否存在，不存在则报错
//若存在 判断文件是否有id，若有id则调用编辑
// 若无id则调用newPost

const publishPost = async (fileName) => {
    console.log(chalk.green(`start publishing……`));
    const postPath = path.resolve(process.cwd(), fileName)
    // 判断文件是否存在
    const file = await fs.promises.access(path.resolve(__dirname, postPath)).then(() => true).catch(_ => false)
    const spinner = ora()
    if (file) {
        // 读取文件
        let data = fm(fs.readFileSync(postPath, 'utf8'))
        data.body = await replaceImgUrl(data.body)
        // console.log(data.body, '-=-=-==-');
        // return
        const fileName = path.parse(postPath).name
        const postData = {
            post: {
                description: data.body,
                title: data.title || fileName,
                categories: ['[Markdown]'],
            },
            publish: 1
        }
        spinner.start()
        // 如果有id则调用编辑接口
        if (data.attributes.postid) {
            console.log(chalk.green(`${postData.post.title} 已存在,开始更新…`));
            postData.postid = data.attributes.postid
            return editPost(postData, function (res) {
                if (res) {
                    spinner.succeed(chalk.green(`发布成功!《${postData.post.title}》已更新!`))
                }
                spinner.stop()
            })

        }
        return newPost(postData, function (res) {
            if (res) {
                data.frontmatter = `${data.frontmatter ? data.frontmatter + '\n' : ''}postid: ${res}`
                const writeData = `---\n${data.frontmatter}\n---\n${data.body}`
                fs.writeFileSync(postPath, writeData)
                // console.log(chalk.green(`${postData.post.title} 已存在,开始更新…`));
                spinner.succeed(chalk.green(`发布成功！已创建一篇名为《${postData.post.title}》的博客！`))
            }
        })
    } else {
        return Promise.reject(`${postData.post.title}不存在`)
    }
}

exports.publishPost = publishPost