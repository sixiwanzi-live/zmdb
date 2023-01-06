import validation from "./validation.js"

export default {
    server: {
        code: 500100000,
        message: 'internal server error'
    },
    sqlite: {
        code: 500100100,
        message: ''
    },
    auth: {
        Unauthorized: {
            code: 401100000,
            message: '您没有权限使用该功能'
        }
    },
    files: {
        NotFound: {
            code: 400100020,
            message: '找不到文件'
        },
        DeleteFailed: {
            code: 500100101,
            message: '删除文件失败'
        },
        UploadFailed: {
            code: 500100102,
            message: '上传文件失败'
        },
        RefreshFailed: {
            code: 500100103,
            message: '刷新失败'
        }
    },
    organization: {
        NotFound: {
            code: 400100100,
            message: '社团不存在'
        },
        name: {
            LengthTooShort: {
                code: 400100101,
                message: `社团名称长度不能小于${validation.organization.name.lowerLimit}字符`
            },
            LengthTooLong: {
                code: 400100102,
                message: `社团名称长度不能大于${validation.organization.name.upperLimit}字符`
            }
        }
    },
    author: {
        NotFound: {
            code: 400100110,
            message: '作者不存在'
        },
        name: {
            LengthTooShort: {
                code: 400100111,
                message: `作者昵称长度不能小于${validation.author.name.lowerLimit}字符`
            },
            LengthTooLong: {
                code: 400100112,
                message: `作者昵称长度不能大于${validation.author.name.upperLimit}字符`
            }
        },
    },
    clip: {
        NotFound: {
            code: 400100120,
            message: '作品不存在'
        },
        title: {
            LengthTooShort: {
                code: 400100121,
                message: `标题长度不能小于${validation.clip.title.lowerLimit}字符`
            },
            LengthTooLong: {
                code: 400100122,
                message: `标题长度不能大于${validation.clip.title.upperLimit}字符`
            }
        },
        datetime: {
            IllegalFormat: {
                code: 400100124,
                message: `直播时间日期格式非法`
            }
        },
        content: {
            LengthTooShort: {
                code: 400100127,
                message: `搜索词长度不能小于${validation.clip.content.lowerLimit}字符`
            },
            LengthTooLong: {
                code: 400100128,
                message: `搜索词长度不能大于${validation.clip.content.upperLimit}字符`
            }
        },
        video: {
            FetchCidFailed: {
                code: 400100129,
                message: `请求获取cid失败`
            },
            FetchUrlFailed: {
                code: 400100130,
                message: `请求获取VideoUrl失败`
            }
        },
        startTime: {
            IllegalFormat: {
                code: 400100131,
                message: '起始时间格式错误'
            }
        },
        endTime: {
            IllegalFormat: {
                code: 400100132,
                message: '结束时间格式错误'
            }
        }
    },
    subtitle: {
        NotFound: {
            code: 400100140,
            message: '字幕不存在'
        },
        content: {
            LengthTooShort: {
                code: 400100141,
                message: `字幕内容不能小于${validation.subtitle.content.lowerLimit}字符`
            },
            ParseError: {
                code: 400100142,
                message: `字幕文本解析错误`
            }
        }
    },
    segment: {
        IntervalTooLong: {
            code: 400101130,
            message: `切片时长不应超过${validation.segment.interval.upperLimit / 60000 }分钟`
        },
        IntervalTooShort: {
            code: 400101131,
            message: `切片时长不应少于${validation.segment.interval.lowerLimit / 1000 }秒钟`
        }
    }
}