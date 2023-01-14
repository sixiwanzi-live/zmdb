import fetch from 'node-fetch';
import config from '../config.js';

export default class BiliApi {

    static async fetchVideoInfo(bv) {
        const url = `${config.bili.api.url}/x/web-interface/view?bvid=${bv}`;
        const res = await fetch(url);
        return await res.json();
    }

    static async fetchHtml5StreamUrl(bv, cid) {
        const playurl = `${config.bili.api.url}/x/player/playurl?bvid=${bv}&cid=${cid}&platform=html5`;
        const res = await fetch(playurl, {
            "headers": {
                "authority": "api.bilibili.com",
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "cache-control": "no-cache",
                "origin": "https://player.bilibili.com",
                "pragma": "no-cache",
                "referer": "https://player.bilibili.com/",
                "sec-ch-ua": '"Microsoft Edge";v="105", " Not;A Brand";v="99", "Chromium";v="105"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "user-agent": config.bili.api.userAgent
            }
        });
        const json = await res.json();
        return json.data.durl[0].url;
    }
}