const { getUsersBlogs, newPost, getRecentPosts, getPost, deletePost, getCategories, newCategory, editPost } = require('../src/methods')
const checkConfig = require('./checkConfig')
const ora = require('ora')
const log = require('./log.js')
const path = require('path')
const fm = require('front-matter')
const fs = require('fs')

const init = async () => {
    const res = await getRecentPosts()
    console.log(res);
}

module.exports = init