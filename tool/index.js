import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import pino from 'pino';
import config from './config.js';
import { errorHandler } from './middlewares.js';
import SubtitleService from './subtitle/SubtitleService.js';

const app = new Koa({ proxy: true });
const router = new Router();

app.context.logger = pino({ transport: { target: 'pino-pretty' } });

app.context.subtitleService = new SubtitleService();

/**
 * subtitles
 */
router.get('/clips/:clipId/subtitles', async ctx => {
    ctx.body = await ctx.subtitleService.parse(ctx);
});

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