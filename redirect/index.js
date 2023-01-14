import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import pino from 'pino';
import config from './config.js';
import { errorHandler } from './middlewares.js';
import RedirectService from './RedirectService.js';

const app = new Koa({ proxy: true });
const router = new Router();

app.context.logger = pino({ transport: { target: 'pino-pretty' } });

app.context.redirectService = new RedirectService();

/**
 * redirect
 */
router.get('/clips/:clipId/play-url', async ctx => {
    const playurl = await ctx.redirectService.fetchPlayUrl(ctx);
    ctx.logger.info(`playurl:${playurl}`);
    ctx.redirect(playurl);
});
// router.get('/clips/:clipId/download-url', async ctx => {
//     ctx.body = await ctx.subtitleService.parse(ctx);
// });
// router.get('/clips/:clipId/source-url', async ctx => {
//     ctx.body = await ctx.subtitleService.parse(ctx);
// });


app.use(koaBody({ 
    jsonLimit: config.web.bodyLimit, 
    formLimit: config.web.bodyLimit,
    textLimit: config.web.bodyLimit,
}));

app.use(logger((str, args) => {
    let line = `${args[1]} ${args[2] || ''} ${args[3] || ''} ${args[4] || ''} ${args[5] || ''}`;
    line = line.trim();
    app.context.logger.info(line);
}));
app.use(cors());
app.use(errorHandler);
app.use(router.routes());

app.listen(config.web.port);