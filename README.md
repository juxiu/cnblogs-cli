## cnblogs-cli

博客园自动发布工具

### 安装

```bash
npm i cnblogs-cli -g
```

### 使用说明

> 使用前请填写账号密码 `cn reset`，若账号密码填错，再次`reset`，默认所有博客由`markdown`编写

## 1. 拉取博客园文章

- 1.1 执行`cn init [num]`，会在**当前目录**拉取博客园最近 `100`(博客园默认最大可拉取 100) 篇随笔,`num`为自定义拉取的条数

> 拉取成功后会询问是否使用 git 管理本地随笔，如选择`是`，则在本地初始化为 git 仓库

## 2. 管理随笔

- 2.1 推送随笔

  `cn push <filePath>`,推送成功后会在 `markdown` 顶部添加`yaml`格式的`postid`字段记录博客的`postid`,你也可以在`markdown`顶部`yaml`中添加`title`字段用作随笔的`title`

- 2.3 删除随笔

  `cn delete <filePath>`or`cn d <filePath>`
