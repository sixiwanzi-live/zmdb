import fetch from 'node-fetch';
import BiliApi from './api/BiliApi.js';
import { fromMilliseconds } from './util.js'

export default class SubtitleService {

    constructor() {}

    fetchBvSubtitles = async (ctx) => {
        const bv = ctx.request.query.bv;
        const json = await BiliApi.fetchVideoInfo(bv);
        if (!json) {
            ctx.logger.error(`${bv}未找到基础信息`);
            return '';
        }
        ctx.logger.info(json);
        // 获取字幕信息
        if (json.data.subtitle.list.length > 0) {
            ctx.logger.info(`${bv})找到智能字幕`);
            const subtitleUrl = json.data.subtitle.list[0].subtitle_url;
            const subtitleRes = await fetch(subtitleUrl);
            const subtitleJson = await subtitleRes.json();
            if (!subtitleJson) {
                ctx.logger.error(`${bv})获取智能字幕失败`);
                return '';
            }
            ctx.logger.info(`${bv})获取智能字幕成功`);
            // json格式字幕转换成srt格式
            let srt = '';
            const subtitles = subtitleJson.body;
            for (let k = 0; k < subtitles.length; ++k) {
                const subtitle = subtitles[k];
                const lineId = subtitle.sid;
                const startTime = fromMilliseconds(subtitle.from * 1000);
                const endTime = fromMilliseconds(subtitle.to * 1000);
                const content = subtitle.content;
                const line = `${lineId}\r\n${startTime} --> ${endTime}\r\n${content}\r\n\r\n`;
                srt += line;
            }
            return srt;
        } else {
            ctx.logger.warn(`${bv})未找到智能字幕`);
            return '';
        }
    }
}