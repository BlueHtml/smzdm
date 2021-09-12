# smzdm

**注意：不要使用！！action运行会卡死！不知道为啥。。。**

什么值得买自动做任务和评论来获取经验值

- 签到和任务的代码来自[blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script)
- 评论的代码修改自[xuess/smzdm-sign](https://github.com/xuess/smzdm-sign)

需要自行在`.github/workflows/main.yml`添加定时任务

## Secret

**`Settings`->`Secrets`->`New repository secret`，添加以下Secret：**
- `COOKIE`：什么值得买的Cookie
- `COMMIT`：什么值得买要发表的评论，多个使用**换行**隔开
- `PUSHPLUS_TOKEN`：PushPlus Token