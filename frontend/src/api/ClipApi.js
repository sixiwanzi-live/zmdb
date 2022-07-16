import axios from 'axios';
import config from '../config';

export default class ClipApi {

    static findByOrganizationId = (organizationId) => {
        return axios.get(`${config.url.api}/organizations/${organizationId}/clips`);
    }

    static find = (authorIds, keyword) => {
        return axios.get(`${config.url.api}/clips`, {
            params: { authorIds, keyword }
        });
    }
}