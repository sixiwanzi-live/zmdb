import fetch from 'node-fetch';
import { exec } from 'child_process';
import config from '../config.js';

export default class BiliApi {

    static async fetchCid(bv) {
        const res = await fetch(`http://api.bilibili.com/x/web-interface/view?bvid=${bv}`);
        const data = await res.json();
        return data.data.cid;
    }

    static async fetchStreamUrl(bv, cid) {
        const res = await new Promise((res, rej) => {
            const playurl = `https://api.bilibili.com/x/player/playurl?bvid=${bv}&cid=${cid}&qn=120&fnval=128&fourk=1`;
            const cmd = `curl '${playurl}' \
                -H 'authority: api.bilibili.com' \
                -H 'accept: application/json, text/javascript, */*; q=0.01' \
                -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6' \
                -H 'cache-control: no-cache' \
                -H "cookie: ${config.segment.cookie}" \
                -H 'origin: https://player.bilibili.com' \
                -H 'pragma: no-cache' \
                -H 'referer: https://player.bilibili.com/' \
                -H 'sec-ch-ua: "Microsoft Edge";v="105", " Not;A Brand";v="99", "Chromium";v="105"' \
                -H 'sec-ch-ua-mobile: ?0' \
                -H 'sec-ch-ua-platform: "Windows"' \
                -H 'sec-fetch-dest: empty' \
                -H 'sec-fetch-mode: cors' \
                -H 'sec-fetch-site: same-site' \
                -H 'user-agent: ${config.segment.userAgent}' \
                --compressed`;
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    rej(error);
                }
                res(JSON.parse(stdout));
            });
        });
        return res.data.durl[0].url;
    }
}