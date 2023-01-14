import PushApi from './api/PushApi.js';

export async function errorHandler(ctx, next) {
    try {
        await next();
    } catch (e) {
        ctx.logger.error(e);
        let ex = {};
        if (e.hasOwnProperty('code')) {
            ex.code = e.code;
        } else {
            ex.code = 500;
        }
        if (e.hasOwnProperty('message')) {
            ex.message = e.message;
        } else {
            ex.message = `${e}`;
        }
        await PushApi.push('系统异常', JSON.stringify(ex));
        ctx.body = ex;
        ctx.status = 400;
    }
}