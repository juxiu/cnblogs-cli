const { getUsersBlogs, newPost, getRecentPosts, getPost, deletePost, getCategories, newCategory, editPost } = require('../src/methods')
const checkConfig = require('./checkConfig')
const ora = require('ora')
const log = require('./log.js')
const path = require('path')
const fm = require('front-matter')
const fs = require('fs')
const handleDeleteBlog = async (file) => {
    await checkConfig()
    const fileAllPath = path.resolve(process.cwd(), file)
    const postid = fm(fs.readFileSync(fileAllPath, 'utf8')).attributes.postid || ''
    if (postid) {
        const params = { postid }
        const loading = new ora('Deleting....')
        loading.start()
        const res = await deletePost(params)
        if (res.faultCode) {
            log.error(res.faultCode, res.faultString)
            loading.stop()
            return
        }
        fs.unlinkSync(fileAllPath)
        loading.succeed('Deleted!')
        return
    }
    log.info('no postid', 'Please check whether it has been uploaded!')
}

module.exports = handleDeleteBlog