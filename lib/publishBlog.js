
const { getUsersBlogs, newPost, getRecentPosts, getPost, deletePost, getCategories, newCategory, editPost } = require('../src/methods')
const ora = require('ora')
const log = require('./log')
const path = require('path')
const fs = require('fs')
const fm = require('front-matter')
const checkConfig = require('./checkConfig')
const publishBlog = async (file) => {
    checkConfig()
    const fileAllPath = path.resolve(process.cwd(), file)
    const postid = fm(fs.readFileSync(fileAllPath, 'utf8')).attributes.postid || ''
    const params = {
        filePath: file
    }
    const loading = new ora(`start publish ${file}`)
    loading.start()
    if (postid) {
        params.postid = postid
        await editPost(params)
        loading.succeed('edit successfully!')
    } else {
        const res = await newPost(params)
        if (/^\d+$/g.test(res)) {
            let data = fm(fs.readFileSync(fileAllPath, 'utf8'))
            if (data.frontmatter) {
                data.frontmatter += `\npostid: ${res}`
                const writeData = `---\n${data.frontmatter}\n---\n${data.body}`
                fs.writeFileSync(path.resolve(process.cwd(), params.filePath), writeData)
            }
            loading.succeed('published successfully!')
        } else {
            loading.stop()
            log.error(res.faultCode, res.faultString)
        }
    }
}

module.exports = publishBlog