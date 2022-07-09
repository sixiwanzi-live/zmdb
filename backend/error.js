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
                message: `直播标题长度不能小于${validation.clip.title.lowerLimit}字符`
            },
            LengthTooLong: {
                code: 400100122,
                message: `直播标题长度不能大于${validation.clip.title.upperLimit}字符`
            }
        },
        bv: {
            IllegalFormat: {
                code: 400100123,
                message: `录播视频bv号长度必须是${validation.clip.bv.limit}字符`
            }
        },
        datetime: {
            IllegalFormat: {
                code: 400100124,
                message: `直播时间日期格式非法`
            }
        },
        authors: {
            TooLittle: {
                code: 400100125,
                message: `查询的作者数量不应该小于${validation.clip.authors.lowerLimit}个`
            },
            TooMuch: {
                code: 400100126,
                message: `查询的主播数量不应该大于${validation.clip.authors.upperLimit}个`
            },
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
    }
}