import fetch from 'node-fetch';
import PushApi from '../api/PushApi.js';
import ZimuApi from '../api/ZimuApi.js';
import { fromMicroseconds } from '../util.js'

const archives = [
    {
        // AI中国绊爱
        authorId: 8,
        url: 'https://api.bilibili.com/x/series/archives?mid=484322035&series_id=210661&only_normal=true&sort=desc&pn=1&ps=1',
    },
    {
        // 凜凜蝶凜
        authorId: 21,
        url: 'https://api.bilibili.com/x/series/archives?mid=1220317431&series_id=2610314&only_normal=true&sort=desc&pn=1&ps=1',
    },
    {
        // 灯夜tomoya
        authorId: 29,
        url: 'https://api.bilibili.com/x/series/archives?mid=1854400894&series_id=2880259&only_normal=true&sort=desc&pn=1&ps=1',
    },
    {
        // 扇宝
        authorId: 30,
        url: 'https://api.bilibili.com/x/polymer/space/seasons_archives_list?mid=1682965468&season_id=983010&sort_reverse=false&page_num=1&page_size=1',
    },
    {
        // 安可
        authorId: 31,
        url: 'https://api.bilibili.com/x/series/archives?mid=1375400985&series_id=2924566&only_normal=true&sort=desc&pn=1&ps=1',
    },
];

(async () => {
    for (let i = 0; i < archives.length; ++i) {
        const archive = archives[i];
        try {
            console.log(`处理author(${archive.authorId})的replay`);
            const clip = await ZimuApi.findLatestClipByAuthorId(archive.authorId);
            // 如果不是直播中或者待解析就不用更新
            if (clip.type !== 4 && clip.type !== 0) {
                console.log(`author(${archive.authorId})无最新视频`);
                continue;
            }
            // 获取B站源
            let video = {};
            const archiveRes = await fetch(archive.url);  // 请求合集列表
            const archiveJson = await archiveRes.json();
            if (!archiveRes.ok) {
                await PushApi.push(`请求合集列表失败`, JSON.stringify(archiveJson));
                continue;
            }
            video = archiveJson.data.archives[0];
            console.log(`author(${archive.authorId})合集列表中的最新录播为:${video.title},${video.bvid}`);
            if (video.title.indexOf(clip.title) === -1) {
                console.log(`author(${archive.authorId})的合集列表中无匹配录播,${video.title},${clip.title}`);
                continue;
            }
            try {
                const updatedClip = {
                    id: clip.id,
                    bv: video.bvid
                };
                console.log(`将更新clip:${updatedClip.id},${updatedClip.bv}`);
                await ZimuApi.updateClip(updatedClip);
                await PushApi.push(`更新author(${archive.authorId})的clip(${clip.id}),bv号为${video.bvid}`, '');
            } catch (ex) {
                console.log(ex);
                await PushApi.push(`更新clip(${clip.title})的bv失败`, ex);
                continue;
            }
            // 获取录播基础信息
            const infoUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${video.bvid}`;
            const infoRes = await fetch(infoUrl);
            const infoJson = await infoRes.json();
            if (!infoRes.ok) {
                await PushApi.push(`获取author(${archive.authorId})的录播基础信息失败(${video.bvid}, ${clip.title})`, JSON.stringify(infoJson));
                continue;
            }
            // 获取字幕信息
            if (infoJson.data.subtitle.list.length > 0) {
                console.log(`author(${archive.authorId})的录播(${clip.title},${video.bvid})找到智能字幕`);
                const subtitleUrl = infoJson.data.subtitle.list[0].subtitle_url;
                const subtitleRes = await fetch(subtitleUrl);
                const subtitleJson = await subtitleRes.json();
                if (!subtitleRes.ok) {
                    await PushApi.push(`获取录播字幕失败(${video.bvid}, ${clip.title})`, JSON.stringify(subtitleJson));
                    continue;
                }
                // json格式字幕转换成srt格式
                let srt = '';
                const subtitles = subtitleJson.body;
                for (let k = 0; k < subtitles.length; ++k) {
                    const subtitle = subtitles[k];
                    const lineId = subtitle.sid;
                    const startTime = fromMicroseconds(subtitle.from * 1000);
                    const endTime = fromMicroseconds(subtitle.to * 1000);
                    const content = subtitle.content;
                    const line = `${lineId}\r\n${startTime} --> ${endTime}\r\n${content}\r\n\r\n`;
                    srt += line;
                }
                try {
                    await ZimuApi.insertSubtitle(clip.id, srt);
                    console.log(`author(${archive.authorId})写入字幕成功:${video.bvid},${clip.datetime},${video.title}`);
                } catch (ex) {
                    console.log(`author(${archive.authorId})写入字幕失败:${video.bvid},${video.title}`);
                    await PushApi.push(`author(${archive.authorId})写入字幕失败:${video.bvid},${video.title}`, '');
                }
            } else {
                console.log(`author(${archive.authorId})的录播(${clip.title},${video.bvid})未找到智能字幕`);
                await PushApi.push(`author(${archive.authorId})的录播(${clip.title},${video.bvid})未找到智能字幕`, '');
            }
        } catch (ex) {
            PushApi.push(`获取author(${archive.authorId})最近clip失败`, JSON.stringify(ex));
        }
    }
})()