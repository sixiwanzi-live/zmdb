import fetch from 'node-fetch';
import config from '../config.js';

export default class SegmentApi {
    static async segment(clipId, startTime, endTime, audio) {
        const url = `${config.tool.url}/clips/${clipId}/segments?startTime=${startTime}&endTime=${endTime}&audio=${audio}`;
        const res = await fetch(url);
        return await res.json();
    }
}