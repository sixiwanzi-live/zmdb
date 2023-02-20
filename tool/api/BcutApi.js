import fetch from 'node-fetch';
import config from '../config.js';

export default class BcutApi {

    static async req(filename, size) {
        const reqBody = new URLSearchParams();
        reqBody.append("type", 2);
        reqBody.append("name", filename);
        reqBody.append("size", size);
        reqBody.append("resource_file_type", "m4a");
        reqBody.append("model_id", 7);
        const reqRes = await fetch(config.bcut.api.reqUrl, {
            method: "POST",
            body: reqBody
        });
        return await reqRes.json();
    }

    static async commit(inBossKey, resourceId, etags, uploadId) {
        const commitBody = new URLSearchParams();
        commitBody.append("in_boss_key", inBossKey);
        commitBody.append("resource_id", resourceId);
        commitBody.append("etags", etags.join(','));
        commitBody.append("upload_id", uploadId);
        commitBody.append("model_id", 7);
        const commitRes = await fetch(config.bcut.api.commitUrl, {
            method: "POST",
            body: commitBody
        });
        return await commitRes.json();
    }

    static async task(resourceUrl) {
        const taskRes = await fetch(config.bcut.api.taskUrl, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                resource: resourceUrl,
                model_id: "7"
            })
        });
        return await taskRes.json();
    }

    static async query(taskId) {
        const queryUrl = `${config.bcut.api.queryUrl}?model_id=7&task_id=${taskId}`;
        const queryRes = await fetch(queryUrl);
        return await queryRes.json();
    }
}