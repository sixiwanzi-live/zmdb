import { stat } from 'fs/promises';
import { spawn } from 'child_process';
import config from './config.js';
import BiliApi from './api/BiliApi.js';
import PushApi from './api/PushApi.js';
import ZimuApi from './api/ZimuApi.js';

export default class SegmentService {

    constructor() {
        this.srcMap = new Map();
    }

    make = async (ctx) => {
        const clipId    = parseInt(ctx.params.clipId);
        const startTime = ctx.request.query.startTime;
        const endTime   = ctx.request.query.endTime;
        const audio     = ctx.request.query.audio || 'false';

        const st = startTime.replace(',', '.');
        const et = endTime.replace(',', '.');
        let filename = `clip-${clipId}-${st.replaceAll(':', '-').replace('.', '-')}--${et.replaceAll(':', '-').replace('.', '-')}`;
        if (audio === 'true') {
            filename = `${filename}.aac`;
        } else {
            filename = `${filename}.mp4`;
        }
        const output = `${config.segment.path}/${filename}`;

        // 获取clip基础信息
        const clip = await ZimuApi.findClipById(clipId);
        ctx.logger.info(clip);

        // 如果存在相同的切片，则直接返回
        try {
            await stat(output);
            PushApi.push('片段制作完成', `${clip.id},${clip.title},${filename}`);
            return { filename };
        } catch (ex) {}

        // 获取视频源地址并生成ffmpeg参数，B站视频需要先查缓存，如果缓存没有，需要请求B站获取
        // 非B站视频直接使用playUrl
        let src = '';
        let cmd = [];
        if (clip.type === 1) {
            // B站源
            if (this.srcMap.has(clipId)) {
                src = this.srcMap.get(clipId);
                ctx.logger.info(`clip(${clipId})命中缓存`);
            } else {
                ctx.logger.info(`clip(${clipId})未命中缓存`);
            }
            cmd = [
                '-ss', st, 
                '-to', et, 
                '-accurate_seek', 
                '-seekable', 1, 
                '-user_agent', config.segment.userAgent, 
                '-headers', `Referer: ${config.segment.referer}`,
                '-i', src,
                '-c', 'copy',
                '-avoid_negative_ts', 1,
                output
            ];
        } else if (clip.type === 2) {
            src = `https://${clip.playUrl}`;
            cmd = [
                '-ss', st, 
                '-to', et, 
                '-accurate_seek', 
                '-seekable', 1, 
                '-i', src,
                '-c', 'copy',
                '-avoid_negative_ts', 1,
                output
            ];
        } else if (clip.type === 3) {
            let a = clip.playUrl.split('/');
            a[0] = config.segment.recordRoot;
            src = a.join('/');
            cmd = [
                '-ss', st, 
                '-to', et, 
                '-accurate_seek', 
                '-i', src,
                '-c', 'copy',
                '-avoid_negative_ts', 1,
                output
            ];
        } else if (clip.type === 4) {
            let a = clip.playUrl.split('/');
            a[0] = config.segment.liveRoot;
            src = a.join('/');
            cmd = [
                '-ss', st, 
                '-to', et, 
                '-accurate_seek', 
                '-i', src,
                '-c', 'copy',
                '-avoid_negative_ts', 1,
                output
            ];
        }
        // 仅下载音频需要添加额外的命令行参数
        if (audio === 'true') {
            cmd = ['-vn', ...cmd];
        }

        try {
            await new Promise((res, rej) => {
                let p = spawn('ffmpeg', cmd);
                p.stdout.on('data', (data) => {
                    ctx.logger.info('stdout: ' + data.toString());
                });
                p.stderr.on('data', (data) => {
                    ctx.logger.info('stderr: ' + data.toString());
                });
                p.on('close', (code) => {
                    ctx.logger.info(`切片生成结束:${clip.id}-${clip.title}, code:${code}`);
                    res();
                });
                p.on('error', (error) => {
                    ctx.logger.error(error);
                    rej(error);
                });
            });
            await stat(output);
        } catch (ex) {
            ctx.logger.error(ex);
            if (clip.type === 1) {
                ctx.logger.info(`clip(${clipId})缓存可能失效，需重新获取`);
                // 在下载切片失败的情况下，如果是从B站下载失败的，说明视频源有问题，需要重新申请视频源
                if (this.srcMap.has(clipId)) {
                    this.srcMap.delete(clipId);
                }
                // 重新获取bv和cid
                const bv = clip.playUrl.substring(clip.playUrl.length - 12);
                const cid = await BiliApi.fetchCid(bv);
                // 重新获取视频流
                const qn = 112;
                src = await BiliApi.fetchStreamUrl(bv, cid, qn);
                ctx.logger.info(src);
                // 包含mcdn的源有问题，不应该被保存。
                // 将获取到的新src保存起来
                if (src.indexOf("mcdn") === -1) {
                    this.srcMap.set(clipId, src);
                }
                // 重新生成ffmepg命令行参数
                cmd = [
                    '-ss', st, 
                    '-to', et, 
                    '-accurate_seek', 
                    '-seekable', 1, 
                    '-user_agent', config.segment.userAgent, 
                    '-headers', `Referer: ${config.segment.referer}`,
                    '-i', src,
                    '-c', 'copy',
                    '-avoid_negative_ts', 1,
                    output
                ];
                // 仅下载音频需要添加额外的命令行参数
                if (audio === 'true') {
                    cmd = ['-vn', ...cmd];
                }
                await new Promise((res, rej) => {
                    let p = spawn('ffmpeg', cmd);
                    p.stdout.on('data', (data) => {
                        ctx.logger.info('stdout: ' + data.toString());
                    });
                    p.stderr.on('data', (data) => {
                        ctx.logger.info('stderr: ' + data.toString());
                    });
                    p.on('close', (code) => {
                        ctx.logger.info(`切片生成结束:${clip.id}-${clip.title}, code:${code}`);
                        res();
                    });
                    p.on('error', (error) => {
                        ctx.logger.error(error);
                        rej(error);
                    });
                });
            } else {
                // 在下载切片失败的情况下，如果是从本地源下载失败的，则直接报错。
                throw ex;
            }
        }

        await stat(output);

        PushApi.push('片段制作完成', `${clip.id},${clip.title}, ${filename}`);
        return {filename};
    }
}