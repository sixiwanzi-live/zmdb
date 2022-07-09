import axios from 'axios';
import config from '../config';

export default class SubtitleApi {

    static findByClipId = (clipId, keyword) => {
        return axios.get(`${config.url.api}/clips/${clipId}/subtitles`, {
            params: { keyword }
        });
    }
}