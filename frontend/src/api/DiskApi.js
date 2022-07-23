import axios from 'axios';
import config from '../config';

export default class DiskApi {

    static make = (bv, startTime, endTime) => {
        return axios.post(`${config.url.disk}/segments`, { bv, startTime, endTime});
    }
}