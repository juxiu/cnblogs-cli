## 博客园自动发布工具

### 安装

```bash
npm i cnblogs-cli -g
```

### 使用说明

> 使用前请填写账号密码 `cn reset`，若账号密码填错，再次`reset`

## 1. 拉取博客园文章

- 1.1 执行`cn init [num]`，会在**当前目录**拉取博客园最近 `100`篇随笔,`num`为自定义拉取的条数

> - 拉取成功后会询问是否使用 git 管理本地随笔，如选择`是`，则在本地初始化为 git 仓库
> - git 初始化后 本地文件变更会在执行 `cn push [commit message]` 后推送到博客园,可执行的文件变更有新增、删除、内容变化
> - 同时会在本地仓库产生一个 commit

## 2. 管理随笔

- 2.1 推送随笔

  `cn publish <fileName>` or `cn p <fileName>`,推送成功后会在 `markdown` 顶部添加`yaml`格式的`postid`字段记录博客的`postid`,你也可以在`markdown`顶部`yaml`中添加`title`字段用作随笔的`title`

- 2.3 删除随笔
  `cn delete <fileName>` or `cn d <fileName>`

## 3.批量管理(需要用 git 初始化)

- 批量推送
  在本地文件有变动后，执行`cn push`,会将有变动的文件推送到博客园。

## 4.其他

- `cn categories` or `cn cate` 查看博客园随笔分类列表
- `cn userinfo` or `cn info` 查看本地配置信息
- `cn reset` or `cn r` 重新配置
- `cn clear` or `cn c` 清除本地配置信息
