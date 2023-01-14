import fetch from 'node-fetch';
import config from '../config.js';

export default class PushApi {

    static async push(title, content) {
        const url = `https://api2.pushdeer.com/message/push?pushkey=${config.push.key}&text=${title}&desp=${content}`;
        const res = await fetch(url);
        return await res.json();
    }
}