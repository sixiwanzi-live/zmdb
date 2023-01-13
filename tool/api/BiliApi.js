import { exec } from 'child_process';
import fetch from 'node-fetch';
import config from '../config.js';

export default class BiliApi {

    static async reqAsr(filename, size) {
        const reqBody = new URLSearchParams();
        reqBody.append("type", 2);
        reqBody.append("name", filename);
        reqBody.append("size", size);
        reqBody.append("resource_file_type", "m4a");
        reqBody.append("model_id", 7);
        const reqRes = await fetch(config.bili.asr.reqUrl, {
            method: "POST",
            body: reqBody
        });
        return await reqRes.json();
    }

    static async commitAsr(inBossKey, resourceId, etags, uploadId) {
        const commitBody = new URLSearchParams();
        commitBody.append("in_boss_key", inBossKey);
        commitBody.append("resource_id", resourceId);
        commitBody.append("etags", etags.join(','));
        commitBody.append("upload_id", uploadId);
        commitBody.append("model_id", 7);
        const commitRes = await fetch(config.bili.asr.commitUrl, {
            method: "POST",
            body: commitBody
        });
        return await commitRes.json();
    }

    static async taskAsr(resourceUrl) {
        const taskRes = await fetch(config.bili.asr.taskUrl, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                resource: resourceUrl,
                model_id: "7"
            })
        });
        return await taskRes.json();
    }

    static async queryAsr(taskId) {
        const queryUrl = `${config.bili.asr.queryUrl}?model_id=7&task_id=${taskId}`;
        const queryRes = await fetch(queryUrl);
        return await queryRes.json();
    }

    static async fetchVideoInfo(bv) {
        const url = `${config.bili.api.url}/x/web-interface/view?bvid=${bv}`;
        const res = await fetch(url);
        return await res.json();
    }

    // static async fetchHtml5StreamUrl(bv, cid) {
    //     const res = await new Promise((res, rej) => {
    //         const playurl = `${config.bili.api.url}/x/player/playurl?bvid=${bv}&cid=${cid}&qn=160&fnval=1&fourk=1`;
    //         console.log(playurl);
    //         const cmd = `curl '${playurl}' \
    //             -H 'authority: api.bilibili.com' \
    //             -H 'accept: application/json, text/javascript, */*; q=0.01' \
    //             -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6' \
    //             -H 'cache-control: no-cache' \
    //             -H 'origin: https://player.bilibili.com' \
    //             -H 'pragma: no-cache' \
    //             -H 'referer: https://player.bilibili.com/' \
    //             -H 'sec-ch-ua: "Microsoft Edge";v="105", " Not;A Brand";v="99", "Chromium";v="105"' \
    //             -H 'sec-ch-ua-mobile: ?0' \
    //             -H 'sec-ch-ua-platform: "Windows"' \
    //             -H 'sec-fetch-dest: empty' \
    //             -H 'sec-fetch-mode: cors' \
    //             -H 'sec-fetch-site: same-site' \
    //             -H 'user-agent: ${config.bili.api.userAgent}' \
    //             --compressed`;
    //         exec(cmd, (error, stdout, stderr) => {
    //             if (error) {
    //                 console.log(error);
    //                 rej(error);
    //             }
    //             console.log(stderr);
    //             console.log(stdout);
    //             res(JSON.parse(stdout));
    //         });
    //     });
    //     return res.data.durl[0].url;
    // }

    static async fetchHtml5StreamUrl(bv, cid) {
        const playurl = `${config.bili.api.url}/x/player/playurl?bvid=${bv}&cid=${cid}&fourk=1&platform=html5`;
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