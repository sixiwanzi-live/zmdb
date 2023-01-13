import { stat, readFile } from 'fs/promises';
import fetch from 'node-fetch';
import config from '../config.js';
import { fromMilliseconds } from '../util.js';
import { toAudio } from '../ffmpeg.js';
import ZimuApi from '../api/ZimuApi.js';
import BiliApi from '../api/BiliApi.js';

export default class SubtitleService {

    /**
     * 如果clip本身已经生成了字幕，则直接返回已生成字幕
     * 如果clip本身没有字幕，但是是B站源，则首先查B站源是否已有智能字幕，若有则直接下载智能字幕，并且更新数据库
     * 如果clip本身没有字幕，但是是B站源，并且无智能字幕，则直接生成字幕，并更新字幕库
     * 如果clip本身没有字幕，且为录播站源或者本地源，则直接生成字幕，并更新数据库
     * @param {clipId} 作品id
     * @returns 
     */
    parse = async (ctx) => {
        const clipId = parseInt(ctx.params.clipId);
        // 查询数据库中是否已有生成好的字幕，如果有则直接返回
        const text = await ZimuApi.findSrtByClipId(clipId);
        if (text.length > 0) {
            return text;
        }

        let downloadUrl = "";
        const clip = await ZimuApi.findClipById(clipId);
        if (clip.type === 1) {
            // B站源
        } else if (clip.type === 2 || clip.type === 3) {
            // 录播站源或者本地源
            downloadUrl = `https://${clip.playUrl}`;
        }
        if (downloadUrl === "") {
            throw {
                code: 400,
                message: `Clip(${clip.id},${clip.title})未找到视频地址`
            }
        }
        const filename = `${clip.id}.m4a`;
        const filepath = `${config.web.tmpDir}/audio/${filename}`;
        await toAudio(downloadUrl, filepath);
        // 检查音频文件是否已经生成
        await stat(filepath);
        // 提交member.bilibili.com进行字幕解析
        const audio = await readFile(filepath);
        // 请求上传
        const reqJson = await BiliApi.reqAsr(filename, audio.byteLength);
        const reqCode = reqJson.code;
        if (reqCode !== 0) {
            throw reqJson;
        }
        ctx.logger.info(reqJson);
        const inBossKey     = reqJson.data.in_boss_key;
        const resourceId    = reqJson.data.resource_id;
        const uploadId      = reqJson.data.upload_id;
        const uploadUrls    = reqJson.data.upload_urls;
        const perSize       = reqJson.data.per_size;

        // 上传分片 
        let etags = [];
        for (let i = 0; i < uploadUrls.length; ++i) {
            let startRange  = i * perSize;
            let endRange    = (i + 1) * perSize;
            if (endRange > audio.byteLength) endRange = audio.byteLength;
            ctx.logger.info(`开始上传分片${startRange}-${endRange}`);
            const uploadRes = await fetch(uploadUrls[i], {
                method: "PUT",
                body: audio.subarray(startRange, endRange)
            });
            if (!uploadRes.ok) {
                throw {
                    code: 500,
                    message: `上传分片失败 ${startRange}-${endRange}`
                }
            }
            ctx.logger.info(`分片上传成功 ${uploadRes.headers.get("etag")}`);
            etags.push(uploadRes.headers.get("etag"));
        }

        // 提交上传
        const commitJson = await BiliApi.commitAsr(inBossKey, resourceId, etags, uploadId);
        if (commitJson.code !== 0) {
            throw commitJson;
        }
        const resourceUrl = commitJson.data.download_url;
        ctx.logger.info(`资源url:${resourceUrl}`);

        // 创建任务
        const taskJson = await BiliApi.taskAsr(resourceUrl);
        if (taskJson.code !== 0) {
            throw taskJson;
        }
        const taskId = taskJson.data.task_id;
        ctx.logger.info(`任务id:${taskId}`);

        // 查询结果
        let srt = '';
        while (true) {
            await new Promise((res, rej) => {
                setTimeout(() => {
                    res();
                }, 30000)
            });
            const queryJson = await BiliApi.queryAsr(taskId);
            if (queryJson.code !== 0) {
                throw queryJson;
            }
            if (queryJson.data.state === 0) {
                ctx.logger.info("未开始");
            } else if (queryJson.data.state === 1) {
                ctx.logger.info("运行中");
            } else if (queryJson.data.state === 3) {
                ctx.logger.error("错误");
                throw queryJson;
            } else if (queryJson.data.state === 4) {
                ctx.logger.info("已完成");
                const result = JSON.parse(queryJson.data.result);
                const utterances = result.utterances;
                for (let i = 0; i < utterances.length; ++i) {
                    const item = utterances[i];
                    const lineId = i + 1;
                    const start = fromMilliseconds(item.start_time);
                    const end = fromMilliseconds(item.end_time);
                    const content = item.transcript;
                    srt += `${lineId}\r\n${start} --> ${end}\r\n${content}\r\n\r\n`;
                }
                break;
            }
        }
        return srt;
    }
}
