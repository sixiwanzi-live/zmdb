export default {
    web: {
        port: 端口号,
        bodyLimit: 10 * 1024
    },
    zimu: {
        url: '你的字幕库api地址url'
    },
    bili: {
        api: {
            url: 'https://api.bilibili.com'
        }
    },
    segment: {
        path: '生成的切片所要保存的文件夹',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.27',
        referer: 'https://www.bilibili.com',
        cookie: "你登录bilibili账户的cookie"
    },
    push: {
        key: '你的pushdeer key'
    }
}