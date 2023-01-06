import validation from "../validation.js";
import error from '../error.js';

export default class NotificationService {

    constructor() {
        this.content = '';
    }

    /**
     * 
     * @param {content} 通知内容
     * @returns 
     */
    insert = async (ctx) => {
        this.content = ctx.request.body.content;
        return {};
    }
    
    find = (ctx) => {
        return {content: this.content};
    }
}