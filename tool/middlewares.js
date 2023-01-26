import config from "./config.js";

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
            ex.message = e;
        }
        ctx.body = ex;
        ctx.status = 400;
    }
}
