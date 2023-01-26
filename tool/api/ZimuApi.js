import fetch from 'node-fetch';
import config from '../config.js';

export default class ZimuApi {
    static async findClipById(clipId) {
        const res = await fetch(`${config.zimu.url}/clips/${clipId}`);
        return await res.json();
    }

    static async findAuthorById(authorId) {
        const url = `${config.zimu.url}/authors/${authorId}`;
        const res = await fetch(url);
        return await res.json();
    }
}