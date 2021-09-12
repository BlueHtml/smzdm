const https = require('https')
const PUSHPLUS_TOKEN = process.env.PUSHPLUS_TOKEN;

function sendMsg(title, content) {
    const data = JSON.stringify({
        token: PUSHPLUS_TOKEN,
        title: title,
        content: content
    })

    const options = {
        hostname: 'www.pushplus.plus',
        port: 443,
        path: '/send',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    const req = https.request(options, res => {
        console.log(`状态码: ${res.statusCode}`)

        res.on('data', d => {
            process.stdout.write(d)
        })
    })

    req.on('error', error => {
        console.error(error)
    })

    //写入数据发送到server
    req.write(data)
    //发送请求
    req.end()
}

module.exports = {
    sendMsg: sendMsg
};