import { stat, readFile, unlink } from 'fs/promises';
import fetch from 'node-fetch';
import config from './config.js';
import { toAudio, segment } from './ffmpeg.js';
import BiliApi from './api/BiliApi.js';
import BcutApi from './api/BcutApi.js';
import { fromMilliseconds } from './util.js'

export default class AsrService {

    constructor() {}

    parse = async (ctx) => {
        const bv = ctx.request.query.bv;
        // 获取音频文件m4a
        const infoJson = await BiliApi.fetchVideoInfo(bv);
        if (!infoJson) {
            ctx.logger.error(`${bv}未找到基础信息`);
            return '';
        }
        const title = infoJson.data.title;
        const cid = infoJson.data.cid;
        ctx.logger.info(`title:${title}, cid:${cid}`);
        const streamJson = await BiliApi.fetchStreamUrls(bv, cid);
        if (!streamJson) {
            ctx.logger.error(`${bv}未找到音频流`);
            return '';
        }
        const videoUrl = streamJson.data.durl[streamJson.data.durl.length - 1].url;
        const filepath = `${config.web.tmpDir}/${title}.m4a`;
        ctx.logger.info(`${bv}的视频链接为${videoUrl}`);
        ctx.logger.info(`${bv}的音频将被下载至${filepath}`);
        await toAudio(videoUrl, filepath);
        await stat(filepath);

        // 分段解析字幕
        let subtitles = [];
        let t = 0;
        while (true) {
            const ss = fromMilliseconds(t * config.bcut.segDuration).replaceAll(',', '.');
            const to = fromMilliseconds((t + 1) * config.bcut.segDuration).replaceAll(',', '.');
            ctx.logger.info(`bv:${bv},ss:${ss},to:${to}`);
            const segFilename = `${bv}-${t + 1}.m4a`;
            const segPath = `${config.web.tmpDir}/${segFilename}`;
            await segment(filepath, segPath, ss, to);
            const segInfo = await stat(segPath);
            if (segInfo.size < 1024) {
                await unlink(segPath);
                break;
            }
            // 请求上传
            const segFile = await readFile(segPath);
            const reqJson = await BcutApi.req(segFilename, segFile.byteLength);
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
                if (endRange > segFile.byteLength) endRange = segFile.byteLength;
                ctx.logger.info(`开始上传分片${startRange}-${endRange}`);
                const uploadRes = await fetch(uploadUrls[i], {
                    method: "PUT",
                    body: segFile.subarray(startRange, endRange)
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
            const commitJson = await BcutApi.commit(inBossKey, resourceId, etags, uploadId);
            if (commitJson.code !== 0) {
                throw commitJson;
            }
            const resourceUrl = commitJson.data.download_url;
            ctx.logger.info(`资源url:${resourceUrl}`);

            // 创建任务
            const taskJson = await BcutApi.task(resourceUrl);
            if (taskJson.code !== 0) {
                throw taskJson;
            }
            const taskId = taskJson.data.task_id;
            ctx.logger.info(`任务id:${taskId}`);

            // 查询结果
            while (true) {
                await new Promise((res, rej) => {
                    setTimeout(() => {
                        res();
                    }, config.bcut.queryInterval)
                });
                const queryJson = await BcutApi.query(taskId);
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
                        const start = fromMilliseconds(item.start_time);
                        const end = fromMilliseconds(item.end_time);
                        const content = item.transcript;
                        subtitles.push({start, end, content});
                    }
                    break;
                }
            }
            await unlink(segPath);
            await new Promise((res, rej) => {
                setTimeout(() => {
                    res();
                }, config.bcut.segInterval)
            });
            ++t;
        }
        let srt = '';
        for (let i = 0; i < subtitles.length; ++i) {
            const subtitle = subtitles[i];
            srt += `${i + 1}\r\n${subtitle.start} --> ${subtitle.end}\r\n${subtitle.content}\r\n\r\n`;
        }
        return srt;
    }
}