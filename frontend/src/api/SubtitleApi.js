import config from '../config';

export default class SubtitleApi {

    static findByClipId = async (clipId, keyword) => {
        const url = `${config.url.api}/clips/${clipId}/subtitles?keyword=${encodeURIComponent(keyword)}`;
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }
}