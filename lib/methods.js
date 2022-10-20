const fs = require('fs')
// const fm = require('front-matter')
const imageinfo = require('imageinfo')
const path = require('path')
const { request } = require('../service/request')
const { getConfig } = require('../utils/getConfig.js')

// 删除博客
// postid 博客id
// publish 删除后是否需要重新发布博客
const deletePost = async (data, callback = () => { }) => {
    const config = await getConfig()
    const { postid, publish } = data
    const params = ['', postid, config.username, config.key, publish]
    return request('blogger.deletePost', params, callback)
}

// 获取博客信息
const getUsersBlogs = async () => {
    const config = await getConfig()
    const params = ['', config.username, config.key]
    return request('blogger.getUsersBlogs', params)
}

// 编辑博客
// postid 博客id
// post博客内容
// publish 是否发布
const editPost = async (data, callback = () => { }) => {
    const config = await getConfig()
    const { postid, post, publish } = data
    const params = [postid, config.username, config.key, post, publish]
    return request('metaWeblog.editPost', params, callback)
}



// 获取博客分类
const getCategories = async (filterName) => {
    const config = await getConfig()
    const params = ['', config.username, config.key]
    const res = await request('metaWeblog.getCategories', params)
    return res.filter(item => /^\[随笔分类\]/gi.test(item.title))
}

// 获取博客详情
const getPost = async (postid) => {
    const config = await getConfig()
    const params = [postid, config.username, config.key]
    return request('metaWeblog.getPost', params)
}


// 获取博客列表 num 条数
const getRecentPosts = async (num, callback = () => { }) => {
    const config = await getConfig()
    const params = ['', config.username, config.key, num]
    return request('metaWeblog.getRecentPosts', params, callback)
}
// 上传媒体
const newMediaObject = async (file) => {
    const config = await getConfig()
    // console.log(file, '====-=-=-=');
    const params = ['', config.username, config.key, file]
    return request('metaWeblog.newMediaObject', params)
}


// 新建博客
const newPost = async (data, callback = () => { }) => {
    const config = await getConfig()
    const { post, publish } = data
    const params = ['', config.username, config.key, post, publish]
    return request('metaWeblog.newPost', params, callback)
}


// 新建分类
const newCategory = async (blog_id = '', category) => {
    const config = await getConfig()
    const params = [blog_id, config.username, config.key, category]
    return request('wp.newCategory', params)
}

// 上传本地图片
function uploadImg(imgPath) {
    const imgData = fs.readFileSync(imgPath)
    const image = imageinfo(imgData)
    const fileData = {
        bits: Buffer.from(imgData),
        type: image.mimeType,
        name: path.parse(imgPath).base
    }
    return newMediaObject(fileData)
}

// 替换博客中的本地图片为网络地址
async function replaceImgUrl(fileDataStr) {
    const imgReg = /\!\[.+\]?\(([\.\/|\.\.\/]?.+)\)/gi
    const pathReg = /\([\.\/|\.\.\/]?.+\)/gi
    let promiseArr = []
    fileDataStr.replace(imgReg, (path, $1) => {
        if (!/^https?/.test($1)) {
            promiseArr.push(uploadImg($1))
        }
    })
    if (promiseArr.length > 0) {
        const internetUrl = await Promise.all(promiseArr);
        return fileDataStr.replace(pathReg, (imgPath, $1) => {
            return imgPath.replace(imgPath, `(${internetUrl.shift().url})`)
        })
    }
    return fileDataStr
}

module.exports = {
    deletePost,
    getUsersBlogs,
    editPost,
    getCategories,
    getPost,
    getRecentPosts,
    newMediaObject,
    newPost,
    newCategory,
    replaceImgUrl
}