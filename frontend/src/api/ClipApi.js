import config from '../config';

export default class ClipApi {

    static findByOrganizationId = async (organizationId, keyword) => {
        let url = `${config.url.api}/organizations/${organizationId}/clips`;
        if (keyword) {
            const params = new URLSearchParams();
            params.append('keyword', keyword);
            url = `${url}?${params.toString()}`;
        }
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }

    static fetchSegment = async (clipId, startTime, endTime, audio) => {
        const url = `${config.url.api}/clips/${clipId}/segment?startTime=${startTime}&endTime=${endTime}&audio=${audio}`;
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }
}