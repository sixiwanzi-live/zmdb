import config from '../config';

export default class OrganizationsApi {

    static findAll = async () => {
        const url = `${config.url.api}/organizations`;
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }
}