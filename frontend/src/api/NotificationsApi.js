import config from '../config';

export default class OrganizationsApi {

    static find = async () => {
        const url = `${config.url.api}/notifications`;
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }
}