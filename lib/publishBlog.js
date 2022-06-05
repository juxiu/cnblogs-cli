
const { getUsersBlogs, newPost, getRecentPosts, getPost, deletePost, getCategories, newCategory, editPost } = require('../src/methods')
const ora = require('ora')
const log = require('./log')
const path = require('path')
const fs = require('fs')
const publishBlog = async (file) => {
    const params = {
        filePath: file
    }
    const fileAllPath = path.resolve(process.cwd(), file)
    const fileInfo = path.parse(file)
    const isEdit = /_id_\d+/g.test(fileInfo.name)
    const loading = new ora(`start publish ${file}`)
    loading.start()
    if (isEdit) {
        await editPost(params)
    } else {
        const res = await newPost(params)
        const newPath = path.resolve(process.cwd(), `${fileInfo.name}_id_${res}${fileInfo.ext}`)
        fs.renameSync(fileAllPath, newPath)
    }
    loading.succeed()
    log.info('success', 'Blog published successfully!')
}

module.exports = publishBlog