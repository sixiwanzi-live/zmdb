import { pinyin } from 'pinyin-pro';
import axios from 'axios';
import error from "../error.js";
import validation from "../validation.js";
import config from "../config.js";
import { toExtension } from '../utils.js';

export default class ClipService {

    constructor() {
        this.videoMap = new Map();
    }

    /**
     * @param {authorId} 作者id 
     * @param {title} 作品标题
     * @param {bv} B站视频号，长度为12字符
     * @param {datetime} 时间日期字符串，格式为YYYY-MM-DD HH:MM:SS
     * @param {filename} 视频缩略图
     */
    insert = async (ctx) => {
        const entity = ctx.request.body;
        let clip = {};
        // 检查参数合法性
        const authorId = entity.authorId;
        const author = ctx.authorDao.findById(authorId);
        if (!author) {
            throw error.author.NotFound;
        }
        if (ctx.state.auth.organizationId !== 0 && ctx.state.auth.organizationId !== author.organizationId) {
            throw error.auth.Unauthorized;
        }
        clip.authorId = authorId;

        const title = entity.title || '';
        if (title.length < validation.clip.title.lowerLimit) {
            throw error.clip.title.LengthTooShort;
        }
        if (title.length > validation.clip.title.upperLimit) {
            throw error.clip.title.LengthTooLong;
        }
        clip.title = title;

        // TODO 增加bv合法性校验
        const bv = entity.bv || '';
        if (bv.length !== validation.clip.bv.limit) {
            throw error.clip.bv.IllegalFormat;
        }
        // 检查bv是否存在
        const authorByBv = ctx.clipDao.findByBv(bv);
        if (authorByBv) {
            let ex = error.clip.bv.SameBv;
            ex.message = `${ex.message}:${authorByBv.id}`;
            throw ex;
        }
        clip.bv = bv;

        // TODO 增加datetime格式校验
        const datetime = entity.datetime || '';
        if (datetime.length !== validation.clip.datetime.limit) {
            return error.clip.datetime.IllegalFormat;
        }
        clip.datetime = datetime;

        const r = ctx.clipDao.insert(clip);
        const id = r.lastInsertRowid;

        await ctx.fileClient.mkdir(`${config.web.staticDir}/clips/${author.organizationId}/${authorId}`);
        
        const filename = entity.filename || '';
        if (filename.length === 0) {
            throw error.files.NotFound;
        }
        const extension = toExtension(filename);
        const dst = `clips/${author.organizationId}/${authorId}/${id}${extension}`;
        const src = filename;
        await ctx.fileClient.move(src, dst);

        return ctx.clipDao.findById(id);
    }

    /**
     * @param {id} 作品id
     * @param {authorId} 作者id 
     * @param {title} 作品标题
     * @param {bv} B站视频号，长度为12字符
     * @param {datetime} 时间日期字符串，格式为YYYY-MM-DD HH:MM:SS
     * @param {filename} 头像缩略图
     */
    update = async (ctx) => {
        const id = parseInt(ctx.params.id);
        const entity = ctx.request.body;
        console.log(entity);
        // 检查参数合法性
        let clip = ctx.clipDao.findById(id);
        if (!clip) {
            throw error.clip.NotFound;
        }
        const author = ctx.authorDao.findById(clip.authorId);
        if (ctx.state.auth.organizationId !== 0 && ctx.state.auth.organizationId !== author.organizationId) {
            throw error.auth.Unauthorized;
        }

        if (entity.hasOwnProperty('authorId')) {
            const authorId = entity.authorId || 0;
            if (!ctx.authorDao.findById(authorId)) {
                throw error.author.NotFound;
            }
            clip.authorId = authorId;
        }

        if (entity.hasOwnProperty('title')) {
            const title = entity.title || '';
            if (title.length < validation.clip.title.lowerLimit) {
                throw error.clip.title.LengthTooShort;
            }
            if (title.length > validation.clip.title.upperLimit) {
                throw error.clip.title.LengthTooLong;
            }
            clip.title = title;
        }
        if (entity.hasOwnProperty('bv')) {
            // TODO 增加bv合法性校验
            const bv = entity.bv || '';
            if (bv.length !== validation.clip.bv.limit) {
                throw error.clip.bv.IllegalFormat;
            }
            clip.bv = bv;
        }
        if (entity.hasOwnProperty('datetime')) {
            // TODO 增加datetime格式校验
            const datetime = entity.datetime || '';
            if (datetime.length !== validation.clip.datetime.limit) {
                throw error.clip.datetime.IllegalFormat;
            }
            clip.datetime = datetime;
        }

        ctx.clipDao.update(clip);

        if (entity.hasOwnProperty('filename')) {
            const filename = entity.filename || '';
            if (filename.length === 0) {
                throw error.files.NotFound;
            }
            const author = ctx.authorDao.findById(clip.authorId);
            const extension = toExtension(filename);
            const dst = `clips/${author.organizationId}/${author.id}/${id}${extension}`;
            const src = filename;
            await ctx.fileClient.move(src, dst);
        }

        return ctx.clipDao.findById(id);
    }

    deleteById = async (ctx) => {
        const id = parseInt(ctx.params.id);
        const clip = ctx.clipDao.findById(id);
        const author = ctx.authorDao.findById(id);
        if (ctx.state.auth.organizationId !== 0 && ctx.state.auth.organizationId !== author.organizationId) {
            throw error.auth.Unauthorized;
        }
        ctx.clipDao.deleteById(id);
        
        const file = `clips/${author.organizationId}/${clip.authorId}/${id}.webp`;
        await ctx.fileClient.delete(file);
    }

    findByOrganizationId = (ctx) => {
        const organizationId = parseInt(ctx.params.organizationId);
        return ctx.clipDao.findByOrganizationId(organizationId);
    }

    find = (ctx) => {
        const req = ctx.request;
        const authorIds = req.query.authorIds.split(",") || [];
        if (authorIds.length < validation.clip.authors.lowerLimit) {
            throw error.clip.authors.TooLittle;
        }
        if (authorIds.length > validation.clip.authors.upperLimit) {
            throw error.clip.authors.TooMuch;
        }

        // TODO 删除content中的符号字符
        const keyword = req.query.keyword || '';
        if (keyword.length < validation.clip.content.lowerLimit) {
            throw error.clip.content.LengthTooShort;
        }
        if (keyword.length > validation.clip.content.upperLimit) {
            throw error.clip.content.LengthTooLong;
        }

        const pinyinKeyword = pinyin(keyword, {toneType:'num'});
        const r1 = ctx.clipDao.findByAuthorIdsAndKeyword(authorIds, keyword);
        const r2 = ctx.clipDao.findByAuthorIdsAndPinyinKeyword(authorIds, pinyinKeyword);
        const clipIds = new Set();
        const r = [];
        r1.forEach(item => {
            clipIds.add(item.id);
            item.matchMode = 1;
            r.push(item);
        });
        r2.forEach(item => {
            if (!clipIds.has(item.id)) {
                item.matchMode = 2;
                r.push(item);
            }
        });
        r.sort((a, b) => {
            return b.datetime.localeCompare(a.datetime);
        });
        return r;
    }

    fetchVideoUrl = async (ctx) => {
        const id = parseInt(ctx.params.id);
        const video = this.videoMap.get(id);
        if (video && video.expiredTime > Date.now()) {
            return {url: video.url};
        }

        let clip = ctx.clipDao.findById(id);
        if (!clip) {
            throw error.clip.NotFound;
        }
        const res1 = await axios.get(`https://api.bilibili.com/x/web-interface/view?bvid=${clip.bv}`);
        if (!res1 || !res1.data) {
            throw error.clip.video.FetchCidFailed;
        }
        const cid = res1.data.data.cid;
        console.log(`cid:${cid}`);
        const res2 = await axios.get(`http://api.bilibili.com/x/player/playurl?bvid=${clip.bv}&cid=${cid}&platform=html5&qn=16`);
        if (!res2 || !res2.data) {
            throw error.clip.video.FetchUrlFailed;
        }
        const url = res2.data.data.durl[0].url;
        console.log(`url:${url}`);
        this.videoMap.set(id, {url: url, expiredTime: Date.now() + 60 * 60 * 1000});
        return {url};
    }
}