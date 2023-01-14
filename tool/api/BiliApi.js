import { exec } from 'child_process';
import fetch from 'node-fetch';
import config from '../config.js';

export default class BiliApi {

    static async reqAsr(filename, size) {
        const reqBody = new URLSearchParams();
        reqBody.append("appkey", "7eef75b7110f2836");
        reqBody.append("build", "02290110");
        reqBody.append("model_id", "asr_bcut");
        reqBody.append("name", filename);
        reqBody.append("platform", "ios");
        reqBody.append("resource_file_type", "m4a");
        reqBody.append("size", size);
        reqBody.append("type", 2);

        const reqRes = await fetch(config.bili.asr.reqUrl, {
            method: "POST",
            headers: {
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-Hans-CN;q=1",
                "user-agent": config.bili.asr.userAgent,
                "buvid": "YF4799FE0A6D8FD34FD1B7DE7E75DF22CAD5"
            },
            body: reqBody
        });
        return await reqRes.json();
    }

    static async commitAsr(inBossKey, resourceId, etags, uploadId) {
        const commitBody = new URLSearchParams();
        commitBody.append("appkey", "7eef75b7110f2836");
        commitBody.append("build", "02290110");
        commitBody.append("etags", etags.join(','));
        commitBody.append("in_boss_key", inBossKey);
        commitBody.append("model_id", "asr_bcut");
        commitBody.append("platform", "ios");
        commitBody.append("resource_id", resourceId);
        commitBody.append("upload_id", uploadId);
        const commitRes = await fetch(config.bili.asr.commitUrl, {
            method: "POST",
            headers: {
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-Hans-CN;q=1",
                "user-agent": config.bili.asr.userAgent,
                "buvid": "YF4799FE0A6D8FD34FD1B7DE7E75DF22CAD5"
            },
            body: commitBody
        });
        return await commitRes.json();
    }

    static async taskAsr(resourceUrl) {
        const taskRes = await fetch(config.bili.asr.taskUrl, {
            method: "POST",
            headers: {
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-Hans-CN;q=1",
                "user-agent": config.bili.asr.userAgent,
                "buvid": "YF4799FE0A6D8FD34FD1B7DE7E75DF22CAD5",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                appkey: "7eef75b7110f2836",
                build: "02290110",
                model_id: "asr_bcut",
                platform: "ios",
                resource: resourceUrl,
                raw_params: {
                    caption_type: "speech"
                }
            })
        });
        return await taskRes.json();
    }

    static async queryAsr(taskId) {
        const queryUrl = `${config.bili.asr.queryUrl}?appkey=7eef75b7110f2836&build=02290110&model_id=asr_bcut&platform=ios&task_id=${taskId}`;
        const queryRes = await fetch(queryUrl, {
            headers: {
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-Hans-CN;q=1",
                "user-agent": config.bili.asr.userAgent,
                "buvid": "YF4799FE0A6D8FD34FD1B7DE7E75DF22CAD5"
            }
        });
        return await queryRes.json();
    }

    static async deleteAsr(taskId) {
        const deleteRes = await fetch(config.bili.asr.deleteUrl, {
            method: "POST",
            headers: {
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-Hans-CN;q=1",
                "user-agent": config.bili.asr.userAgent,
                "buvid": "YF4799FE0A6D8FD34FD1B7DE7E75DF22CAD5",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                appkey: "7eef75b7110f2836",
                build: "02290110",
                model_id: "asr_bcut",
                platform: "ios",
                task_id: taskId
            })
        });
        return await deleteRes.json();
    }

    static async fetchVideoInfo(bv) {
        const url = `${config.bili.api.url}/x/web-interface/view?bvid=${bv}`;
        const res = await fetch(url);
        return await res.json();
    }

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