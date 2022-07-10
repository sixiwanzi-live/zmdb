import { pinyin } from 'pinyin-pro';
import error from '../error.js'
import validation from '../validation.js';
import config from '../config.js';
import { mark } from '../utils.js';

export default class SubtitleService {

    /**
     * @param {clipId} 作品id
     * @param {content} 字幕srt内容 
     * @returns 
     */
    insert = async (ctx) => {
        const clipId = parseInt(ctx.params.clipId);
        let content = ctx.request.body || '';
        // 检查参数合法性
        const clip = ctx.clipDao.findById(clipId);
        if (!clip) {
            throw error.clip.NotFound;
        }

        const author = ctx.authorDao.findById(clip.authorId);
        if (!author) {
            throw error.author.NotFound;
        }

        if (ctx.state.auth.organizationId !== 0 || ctx.state.auth.organizationId !== author.organizationId) {
            throw error.auth.Unauthorized;
        }

        // TODO 去掉符号
        content = content.replace(/<[^><]*>/g, '');
        if (content.length < validation.subtitle.content.lowerLimit) {
            throw error.subtitle.content.LengthTooShort;
        }

        const subtitles = ctx.srt.parse(content) || [];
        if (subtitles.length === 0) {
            return error.subtitle.content.ParseError;
        }

        await ctx.fileClient.mkdir(`${config.web.staticDir}/srt/${author.organizationId}/${author.id}`);

        const path = `srt/${author.organizationId}/${author.id}/${clipId}.srt`;
        await ctx.fileClient.save(path, content);        
        
        ctx.subtitleDao.deleteByClipId(clipId); // 首先删除历史字幕
        ctx.subtitleDao.insertByClipId(clipId, subtitles);
    }

    deleteByClipId = async (ctx) => {
        const clipId = parseInt(ctx.params.clipId);

        const author = ctx.authorDao.findById(clip.authorId);
        if (!author) {
            throw error.author.NotFound;
        }

        if (ctx.state.auth.organizationId !== 0 || ctx.state.auth.organizationId !== author.organizationId) {
            throw error.auth.Unauthorized;
        }

        ctx.subtitleDao.deleteByClipId(clipId); // 删除历史字幕

        const path = `srt/${author.organizationId}/${author.id}/${clipId}.srt`;
        await ctx.fileClient.delete(path);
    }

    findByClipId = async (ctx) => {
        const req = ctx.request;
        const clipId = parseInt(req.params.clipId);
        let subtitles = ctx.subtitleDao.findByClipId(clipId);
        subtitles.forEach(subtitle => {
            subtitle.markedContent = subtitle.content;
        });
        if (req.query.keyword) {
            const keyword = req.query.keyword;
            const pinyinKeyword = pinyin(keyword, {toneType:'num'});
            const rows = ctx.subtitleDao.findLineIdByClipIdAndKeyword(clipId, keyword, pinyinKeyword);
            rows.forEach(row => {
                const subtitle = subtitles[row.lineId - 1];
                subtitle.markedContent = mark(subtitle.markedContent, keyword);
                if (subtitle.markedContent.indexOf('{') !== -1) {
                    subtitle.matchMode = 2;
                }
                if (subtitle.markedContent.indexOf('[') !== -1) {
                    subtitle.matchMode = 1;
                }
            });
        }
        subtitles.forEach(item => {
            delete item.content;
            delete item.pinyinContent;
        });
        return subtitles;
    }
}
