## 博客园自动发布工具 cnblogs-cli

### 安装

```js
npm i cnblogs-cli -g
```

### 使用说明

> 使用前请填写账号密码 `cn reset`，若账号密码填错，再次`reset`，默认所有博客由`markdown`编写

## 1. 拉取博客园文章

- 1.1 执行`cn init [num]`，会拉取博客园最近 `100`(博客园默认最大可拉取 100) 篇随笔,`num`为自定义拉取的条数

> 拉取成功后会询问是否使用 git 管理本地 blog，如选择`是`，则在本地初始化为 git 仓库

## 2. 管理随笔

- 2.1 推送单个随笔

  `cn push <fileName>`,推送成功后会在 `markdown` 顶部添加`yaml`格式的`postid`字段记录博客的`postid`,你也可以在`markdown`顶部`yaml`中添加`title`字段用作随笔的`title`

- 2.2 批量管理

  `cn push [commit message]`如果在 `init` 时选择了用`git`管理本地随笔，当文件变动后执行`push`,会将本地的文件变动推送到博客园，目前可推动的变动有**修改**，**添加**，**删除**

- 2.3 删除单个随笔

  `cn delete <fileName>`
