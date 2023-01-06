# zmdb
字幕库前后端代码

## 接入API
1.上传up主头像，直播封面

`POST https://api.zimu.live/files/image`

Headers

`Authorization: Bearer <你的secretKey>`

Params

`file 类型File`

Return

Json字符串，如果成功上传，将返回服务器文件名
```
{
    "filename": "1d61c5b714401f07836f34100.webp"
}
```


2.上传直播基础信息

`POST https://api.zimu.live/clips`

Headers

`Authorization: Bearer <你的secretKey>`

`Content-Type: application/json`

Params

`authorId: <up主的id号，这里不是b站id>`

`bv: B站bv号`

`datetime: 本次直播时间，格式为YYYY-MM-DD HH:MM:SS`

`title: 直播标题`

`filename: 封面文件名，该文件名使用files/image接口上传文件后生成。`

格式示例
```
{
    "authorId":8,
    "bv":"BV15S4y1J7Lm",
    "datetime":"2022-07-09 19:00:00",
    "title":"【爱哥x月隐空夜】心跳联动回！",
    "filename":"bec071480d63db29dde33f600.webp"
}
```
Return

Json字符串，如果成功创建，将返回该clip的生成信息
```
{
    "id": 168,
    "authorId": 8,
    "title": "【爱哥x月隐空夜】心跳联动回！",
    "bv": "BV15S4y1J7Lm",
    "datetime":"2022-07-09 19:00:00"
}
```

3.上传直播字幕srt信息

`POST https://api.zimu.live/clips/{clip.id}/subtitles`

Headers

`Authorization: Bearer <你的secretKey>`

`Content-Type: application/text`

Params

`srt文件中的内容，注意不要传srt文件本身`


格式示例，注意结尾不能留超过1个空行
```
1
00:03:27,766 --> 00:03:28,733
hey dormo

2
00:03:31,766 --> 00:03:37,066
各位中爱病大家晚上好呀

3
00:03:38,600 --> 00:03:39,400
嘿

4
00:03:40,166 --> 00:03:41,699
听到这个音乐

```
Return
如果字幕内容输入成功，则不会返回具体内容，httpcode为204
