
const { request } = require('./utils')
const fs = require('fs')
const fm = require('front-matter')
const config = require('./config')
const imageinfo = require('imageinfo')
const path = require('path')
// // 删除博客
// function deletePost(params, options) {
//     params = { ...config, ...params }
//     const xml = `<?xml version="1.0"?>
// <methodCall>
//   <methodName>blogger.deletePost</methodName>
//   <params>
//     <param>
//         <value><string></string></value>
//     </param>
//     <param>
//         <value><string>${params.postid}</string></value>
//     </param>
//     <param>
//         <value><string>${params.username}</string></value>
//     </param>
//     <param>
//         <value><string>${params.password}</string></value>
//     </param>
//     <param>
//         <value><boolean>0</boolean></value>
//     </param>
//   </params>
// </methodCall>`
//     return request(params.url, xml, options)
// }
// 获取用户博客信息
function getUsersBlogs(params, options) {
    params = { ...config, ...params }
    const xml = `<?xml version="1.0"?>
<methodCall>
  <methodName>blogger.getUsersBlogs</methodName>
  <params>
    <param>
        <value><string></string></value>
    </param>
    <param>
        <value><string>${params.username}</string></value>
    </param>
    <param>
        <value><string>${params.password}</string></value>
    </param>
  </params>
</methodCall>`
    return request(params.url, xml, options)
}
// 创建新博

async function newPost(params, options) {
    params = { ...config, ...params }
    let data = fm(fs.readFileSync(params.filePath, 'utf8'))
    data.body = await replaceImgUrl(data.body)
    const writeData = `---\n${data.frontmatter}\n---\n
${data.body}
    `
    // 将文件中的本地链接替换成网络图片，下次修改上传时无需重新上传
    fs.writeFileSync('./test.md', writeData)
    const xml = `<?xml version="1.0"?>
<methodCall>
  <methodName>metaWeblog.newPost</methodName>
  <params>
    <param>
        <value><string></string></value>
    </param>
    <param>
        <value><string>${params.username}</string></value>
    </param>
    <param>
        <value><string>${params.password}</string></value>
    </param>
    <param>
         <value>
                <struct>
                    <member>
                        <name>description</name>
                        <value>
                            <string>${data.body}</string>
                        </value>
                    </member>
                    <member>
                        <name>title</name>
                        <value>
                            <string>${data.attributes.title || ''}</string>
                        </value>
                    </member>
                    <member>
                        <name>categories</name>
                        <value>
                            <array>
                                <data>
                                    <value>
                                        <string>[Markdown]</string>
                                    </value>
                                </data>
                            </array>
                        </value>
                    </member>
                </struct>
            </value>
    </param>
    <param>
        <value><boolean>1</boolean></value>
    </param>
  </params>
</methodCall>`
    return request(params.url, xml, options)
}
// 替换博客中的本地图片为网络地址
async function replaceImgUrl(fileDataStr) {
    const imgReg = /\!\[.+\]\(([\.\/|\.\.\/].+)\)/g
    const pathReg = /\([\.\/|\.\.\/].+\)/g
    const promiseArr = []
    fileDataStr.replace(imgReg, (path, $1) => {
        promiseArr.push(uploadImg($1))
    })
    const internetUrl = await Promise.all(promiseArr);
    return fileDataStr.replace(pathReg, (path, $1) => {
        return path.replace(path, `(${internetUrl.shift().url})`)
    })
}
// 上传本地图片
function uploadImg(imgPath) {
    const imgData = fs.readFileSync(imgPath)
    config.imageinfo = imageinfo(imgData)
    config.imageinfo.name = path.parse(imgPath).base
    config.imageinfo.base64 = imgData.toString('base64')
    return newMediaObject(config)
}
function newMediaObject(params, options) {
    params = { ...config, ...params }
    const xml = `<?xml version="1.0"?>
<methodCall>
  <methodName>metaWeblog.newMediaObject</methodName>
  <params>
      <param>
        <value><string></string></value>
    </param>
    <param>
        <value><string>${params.username}</string></value>
    </param>
    <param>
        <value><string>${params.password}</string></value>
    </param>
    <param>
         <value>
                <struct>
                    <member>
                        <name>name</name>
                        <value>
                            <string>${params.imageinfo.name}</string>
                        </value>
                    </member>
                    <member>
                        <name>type</name>
                        <value>
                            <string>${params.imageinfo.mimeType}</string>
                        </value>
                    </member>
                    <member>
                        <name>bits</name>
                        <value>
                           <base64>${params.imageinfo.base64}</base64>
                        </value>
                    </member>
                </struct>
            </value>
    </param>
  </params>
</methodCall>`
    return request(params.url, xml, options)
}
// 获取最近随笔
function getRecentPosts(params, options) {
    params = { ...config, ...params }
    const xml = `<?xml version="1.0"?>
<methodCall>
  <methodName>metaWeblog.getRecentPosts</methodName>
  <params>
    <param>
        <value><string>000000</string></value>
    </param>
    <param>
        <value><string>${params.username}</string></value>
    </param>
    <param>
        <value><string>${params.password}</string></value>
    </param>

    <param>
        <value><i4>${params.pageSize}</i4></value>
    </param>
  </params>
</methodCall>`
    return request(params.url, xml, options)
}
// 获取文章内容
function getPost(params, options) {
    params = { ...config, ...params }
    const xml = `<?xml version="1.0"?>
<methodCall>
  <methodName>metaWeblog.getPost</methodName>
  <params>
    <param>
        <value><string>${params.postid}</string></value>
    </param>
    <param>
        <value><string>${params.username}</string></value>
    </param>
    <param>
        <value><string>${params.password}</string></value>
    </param>
  </params>
</methodCall>`
    return request(params.url, xml, options)
}

function deletePost(params, options) {
    params = { ...config, ...params }
    const xml = `<?xml version="1.0"?>
<methodCall>
  <methodName>blogger.deletePost</methodName>
  <params>
    <param>
        <value><string></string></value>
    </param>
    <param>
        <value><string>${'16327454'}</string></value>
    </param>
    <param>
        <value><string>${params.username}</string></value>
    </param>
    <param>
        <value><string>${params.password}</string></value>
    </param>
    <param>
        <value><boolean>0</boolean></value>
    </param>
  </params>
</methodCall>`
    return request(params.url, xml, options)
}

function getCategories(params, options) {
    params = { ...config, ...params }
    const xml = `<?xml version="1.0"?>
<methodCall>
  <methodName>metaWeblog.getCategories</methodName>
  <params>
    <param>
        <value><string></string></value>
    </param>
    <param>
        <value><string>${params.username}</string></value>
    </param>
    <param>
        <value><string>${params.password}</string></value>
    </param>
  </params>
</methodCall>`
    return request(params.url, xml, options)
}
function newCategory(params, options) {
    params = { ...config, ...params }
    const xml = `<?xml version="1.0"?>
<methodCall>
  <methodName>wp.newCategory</methodName>
  <params>
    <param>
        <value><string></string></value>
    </param>
    <param>
        <value><string>${params.username}</string></value>
    </param>
    <param>
        <value><string>${params.password}</string></value>
    </param>
     <param>
         <value>
                <struct>
                    <member>
                        <name>name</name>
                        <value>
                            <string>${params.categoryName}</string>
                        </value>
                    </member>
                    <member>
                        <name>parent_id</name>
                        <value>
                            <i4>-5</i4>
                        </value>
                    </member>
                </struct>
            </value>
    </param>
  </params>
</methodCall>`
    return request(params.url, xml, options)
}

async function editPost(params, options) {
    params = { ...config, ...params }
    let data = fm(fs.readFileSync(params.filePath, 'utf8'))
    data.body = await replaceImgUrl(data.body)
    const xml = `<?xml version="1.0"?>
<methodCall>
  <methodName>metaWeblog.editPost</methodName>
  <params>
    <param>
        <value><string>${params.postid}</string></value>
    </param>
    <param>
        <value><string>${params.username}</string></value>
    </param>
    <param>
        <value><string>${params.password}</string></value>
    </param>
    <param>
         <value>
                <struct>
                    <member>
                        <name>description</name>
                        <value>
                            <string>${data.body}</string>
                        </value>
                    </member>
                    <member>
                        <name>title</name>
                        <value>
                            <string>${data.attributes.title || ''}</string>
                        </value>
                    </member>
                    <member>
                        <name>categories</name>
                        <value>
                            <array>
                                <data>
                                    <value>
                                        <string>[Markdown]</string>
                                    </value>
                                </data>
                            </array>
                        </value>
                    </member>
                </struct>
            </value>
    </param>
    <param>
        <value><boolean>1</boolean></value>
    </param>
  </params>
</methodCall>`
    return request(params.url, xml, options)
}
module.exports = {
    deletePost,
    getUsersBlogs,
    newPost,
    getRecentPosts,
    getPost,
    getCategories,
    newCategory,
    editPost
}