import config from '../config';

export default class AuthorApi {

    static findByOrganizationId = async (organizationId) => {
        const url = `${config.url.api}/organizations/${organizationId}/authors`;
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }
}