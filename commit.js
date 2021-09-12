const request = require('./lib/request_https');
const cheerio = require("cheerio"); //文档转换
const { getRandom, ascii2native } = require('./lib/utils'); //工具类
const { sendMsg } = require("./sendMsg"); //发送通知

//用于签到的 账号信息 列表
const cookieSess =
{
    'username': '',
    'phone': '',
    'cookies': process.env.COOKIE
};
//回复列表 用于发表评论的内容
let commitList = process.env.COMMIT.split(/[\r\n]+/g);

console.log('什么值得买 签到相关', new Date());

//文章列表 默认
let postIdList = ['9350354', '9328133', '9328024', '9350282', '9350254', '9328044', '9350219', '9350181', '9350166', '9343266', '9350093', '9350065', '9350031', '9349991', '9349977', '9349974', '9349943', '9349901', '9349892', '9349732'];

//评论地址 
//家居生活 发现频道 30 - 100 页 随机页数
let getCommitUrl = () => {
    let random = getRandom(30, 100);
    let commitUrl = `https://faxian.smzdm.com/h1s0t0f37c0p${random}/`;
    return commitUrl;
}

/**
 * 什么值得买 获取用来评论的文章id
 * @param {Object} url 需要访问的url
 * @param {Object} refererUrl 来源url
 * @param {Object} cookieSess 用来请求的 cookie
 */
let getPostID = (url, refererUrl, cookieSess = '') => {
    //如果没传值 随机取一个cookie 防止重复提交
    let cookie = cookieSess || cookieListValKey[getRandom(0, cookieListValKey.length - 1)].cookies;
    let referer = refererUrl;
    let options = {
        url: url,
        type: 'GET'
    }
    new Promise(function (resolve, reject) {
        options.callback = function (data, _setCookie) {
            //临时列表
            let tempPostIdList = [];
            try {
                let $ = cheerio.load(data);
                $('.feed-ver-pic').each(function (i, e) {
                    let href = $(e).find('a').eq(0).attr('href');
                    tempPostIdList.push(href.substring(href.indexOf('/p/') + 3, href.length - 1));
                });
                console.log(new Date().Format("yyyy-MM-dd hh:mm:ss") + '...新文章列表：' + tempPostIdList.join());
                //获取新列表，再更新，否则不更新
                if (tempPostIdList.length > 0) {
                    postIdList = tempPostIdList;
                }
            } catch (error) {
                console.log(error);
                sendMsg('什么值得买获取【文章列表报错】', `时间: ${new Date().Format("yyyy-MM-dd hh:mm:ss")}  <br/>错误内容: ${ascii2native(error)}`);
            } finally { }
        }
        request(options, cookie, referer);
    });
}

/**
 * 什么值得买 评论
 * @param {Object} cookieSess cookie信息
 */
let smzdmCommit = (cookieSess) => {
    //	let num = Math.floor(Math.random() * 900);
    let cookie = cookieSess.cookies;
    let cookieName = cookieSess.username;
    let referer = 'https://zhiyou.smzdm.com/user/submit/';
    let pId = postIdList[Math.floor(Math.random() * postIdList.length)];
    let options = {
        url: 'https://zhiyou.smzdm.com/user/comment/ajax_set_comment?callback=jQuery111006551744323225079_' + new Date().getTime() + '&type=3&pid=' + pId + '&parentid=0&vote_id=0&vote_type=&vote_group=&content=' + encodeURI(commitList[Math.floor(Math.random() * commitList.length)]) + '&_=' + new Date().getTime(),
        type: 'GET'
    }

    //console.log(options);

    new Promise((resolve, reject) => {
        options.callback = (data, _setCookie) => {
            try {
                //console.log('data===', data);
                if (data.indexOf('"error_code":0') != -1) {
                    console.log(new Date().Format("yyyy-MM-dd hh:mm:ss") + ' --- 什么值得买 评论成功!!!!');
                } else {
                    sendMsg('什么值得买发送【评论报错】', `时间: ${new Date().Format("yyyy-MM-dd hh:mm:ss")}  <br/>用户: ${cookieName} <br/>错误内容: ${ascii2native(data)}`);
                }
            } catch (error) {
                console.log(error);
                sendMsg('什么值得买发送【评论报错】', `时间: ${new Date().Format("yyyy-MM-dd hh:mm:ss")}  <br/>用户: ${cookieName} <br/>错误内容: ${ascii2native(error)}`);
            } finally { }

        }
        request(options, cookie, referer);
    });
}

//评论三次 执行时间自定
let commitSettimeout = (cookieSess, timeNum = 1) => {
    if (timeNum == 4) {
        return;
    }
    //延迟发评论
    setTimeout(() => {
        //发现频道 最新
        getPostID(getCommitUrl(), 'https://www.smzdm.com/jingxuan/', cookieSess.cookies);
        setTimeout(() => {
            //console.log('cookieSess==', cookieSess);
            smzdmCommit(cookieSess);
            console.log('评论次数', timeNum);
        }, 5000);
    }, getRandom(6000, 16000));

    setTimeout(() => {
        timeNum++;
        commitSettimeout(cookieSess, timeNum);
    }, getRandom(10000, 28000) * timeNum);
}

//发表三次评论
commitSettimeout(cookieSess);