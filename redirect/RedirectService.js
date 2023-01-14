import { stat, readFile } from 'fs/promises';
import Cache from 'cache';
import config from './config.js';
import ZimuApi from './api/ZimuApi.js';
import BiliApi from './api/BiliApi.js';

export default class RedirectService {

    constructor() {
        this.cache = new Cache(60 * 1000);
    }

    fetchPlayUrl = async (ctx) => {
        const clipId = parseInt(ctx.params.clipId);
        // 查询clip信息
        const clip = await ZimuApi.findClipById(clipId);
        const author = await ZimuApi.findAuthorById(clip.authorId);
        let playurl = "";
        if (clip.type === 1) {
            const bv = clip.playUrl.substring(clip.playUrl.indexOf("BV"), clip.playUrl.length);
            playurl = this.cache.get(bv);
            if (!playurl) {
                ctx.logger.info('未命中缓存');
                const info = await BiliApi.fetchVideoInfo(bv);
                const cid = info.data.cid;
                playurl = await BiliApi.fetchHtml5StreamUrl(bv, cid);
                this.cache.put(bv, playurl);
            }
        } else if (clip.type === 2) {
            playurl = `https://${clip.playUrl}`;
        } else if (clip.type === 3) {
            const datetime = clip.datetime.replaceAll("-", "").replaceAll(":", "").replaceAll(" ", "");
            const yyyymm = `${datetime.substring(0, 4)}-${datetime.substring(4, 6)}`;
            const date = datetime.substring(0, 8);
            const time = datetime.substring(8, 14);
            playurl = `${config.zimu.live.url}/${author.organizationId}/${author.name}/${yyyymm}/${date}-${time}-${author.name}-${clip.title}.mp4`;
        } else if (clip.type === 4) {
            const datetime = clip.datetime.replaceAll("-", "").replaceAll(":", "").replaceAll(" ", "");
            const yyyymm = `${datetime.substring(0, 4)}-${datetime.substring(4, 6)}`;
            const date = datetime.substring(0, 8);
            const time = datetime.substring(8, 14);
            playurl = `${config.zimu.live.url}/${author.organizationId}/${author.name}/${yyyymm}/${date}-${time}-${author.name}-${clip.title}.flv`;
        }
        return playurl;
    }
}
