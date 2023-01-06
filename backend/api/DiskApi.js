import fetch from 'node-fetch';
import config from '../config.js';

export default class DiskApi {
    static async segment(clipId, startTime, endTime, audio) {
        const url = `${config.disk.url}/clips/${clipId}/segments?startTime=${startTime}&endTime=${endTime}&audio=${audio}`;
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }
}