import axios from 'axios';

export default class BiliApi {

    static findCidByBv = async (bv) => {
        // const res = await axios.get(`http://api.bilibili.com/x/web-interface/view?bvid=${bv}`);
        // console.log(res);
        // return res;
        const res = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bv}`, {
            method: 'GET',
            headers: {
                Origin: 'https://bilibili.com'
            },
            referrer: 'https://bilibili.com',
            referrerPolicy: 'strict-origin-when-cross-origin',
            credentials: 'include'      
        });
        console.log(res.ok);
    }
}