import fetch from 'node-fetch';
import config from '../config.js';

export default class ZimuApi {

    static async updateClip(clip) {
        const url = `${config.zimu.url}/clips/${clip.id}`;
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${config.zimu.auth}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(clip)
        });
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }

    static async insertSubtitle(clipId, srt) {
        const url = `${config.zimu.url}/clips/${clipId}/subtitles`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.zimu.auth}`,
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: srt
        });
        if (!res.ok) {
            throw await res.json();
        }
        return;
    }

    static async findLatestClipByAuthorId(authorId) {
        const url = `${config.zimu.url}/authors/${authorId}/latest-clip`;
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }

    static async findSrtByClipId(clipId) {
        const url = `${config.zimu.url}/clips/${clipId}/srt`;
        const res = await fetch(url);
        return await res.text();
    }

    static async findClipById(clipId) {
        const url = `${config.zimu.url}/clips/${clipId}`;
        return await (await fetch(url)).json();
    }
}