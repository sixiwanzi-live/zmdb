import Database from 'better-sqlite3';
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import pino from 'pino';
import config from './config.js';
import { errorHandler, auth } from './middlewares.js';
import OrganizationDao from './organization/OrganizationDao.js';
import AuthorDao from './author/AuthorDao.js';
import ClipDao from './clip/ClipDao.js';
import SubtitleDao from './subtitle/SubtitleDao.js'
import OrganzationService from './organization/OrganizationService.js';
import AuthorService from './author/AuthorService.js';
import ClipService from './clip/ClipService.js';
import SubtitleService from './subtitle/SubtitleService.js';
import NotificationService from './notification/NotificationService.js';

const app = new Koa({ proxy: true });
const router = new Router();

app.context.logger = pino({ transport: { target: 'pino-pretty' } });

const db = new Database(config.db.path, { verbose: (content) => app.context.logger.info(content) });
db.function('REGEXP', { deterministic: true }, (regex, text) => {
    return new RegExp(regex).test(text) ? 1 : 0;
});

app.context.organizationDao = new OrganizationDao(db);
app.context.authorDao = new AuthorDao(db);
app.context.clipDao = new ClipDao(db);
app.context.subtitleDao = new SubtitleDao(db);

app.context.organizationService = new OrganzationService();
app.context.authorService = new AuthorService();
app.context.clipService = new ClipService();
app.context.subtitleService = new SubtitleService();
app.context.notificationService = new NotificationService();

/**
 * notification
 */
router.post('/notifications', auth, ctx => {
    ctx.body = ctx.notificationService.insert(ctx);
});
router.get('/notifications', ctx => {
    ctx.body = ctx.notificationService.find();
});

/**
 * organization
 */
router.post('/organizations', auth, async ctx => {
    ctx.body = await ctx.organizationService.insert(ctx);
});
router.put('/organizations/:id', auth, async ctx => {
    ctx.body = await ctx.organizationService.update(ctx);
});
router.get('/organizations', async ctx => {
    ctx.body = await ctx.organizationService.findAll(ctx) || [];
});

/**
 * authors
 */
router.post('/authors', auth, async ctx => {
    ctx.body = await ctx.authorService.insert(ctx);
});
router.put('/authors/:id', auth, async ctx => {
    ctx.body = await ctx.authorService.update(ctx);
});
router.get('/authors/:id', async ctx => {
    ctx.body = await ctx.authorService.findById(ctx);
});
router.get('/authors', async ctx => {
    ctx.body = await ctx.authorService.findAll(ctx);
});
router.get('/organizations/:organizationId/authors', async ctx => {
    ctx.body = await ctx.authorService.findByOrganizationId(ctx);
});


/**
 * clips
 */
router.post('/clips', auth, async ctx => {
    ctx.body = await ctx.clipService.insert(ctx);
});
router.put('/clips/:id', auth, async ctx => {
    ctx.body = await ctx.clipService.update(ctx);
});
router.delete('/clips/:id', auth, async ctx => {
    ctx.body = await ctx.clipService.deleteById(ctx);
});
router.get('/clips/:id', async ctx => {
    ctx.body = await ctx.clipService.findById(ctx);
});
router.get('/organizations/:organizationId/clips', async ctx => {
    ctx.body = await ctx.clipService.findByOrganizationId(ctx) || {};
});
router.get('/authors/:authorId/clips', async ctx => {
    ctx.body = await ctx.clipService.findByAuthorId(ctx) || {};
});
router.get('/clips', async ctx => {
    if (ctx.request.query.bv) {
        ctx.body = await ctx.clipService.findByBv(ctx) || {};
    } else {
        ctx.body = {};
    }
});
router.get('/clips/:clipId/segment', async ctx => {
    ctx.body = await ctx.clipService.segment(ctx) || {};
});

/**
 * subtitles
 */
router.post('/clips/:clipId/subtitles', auth, async ctx => {
    ctx.body = await ctx.subtitleService.insert(ctx);
});
router.put('/clips/:clipId/subtitles', auth, async ctx => {
    ctx.body = await ctx.subtitleService.update(ctx);
});
router.get('/clips/:clipId/subtitles', async ctx => {
    ctx.body = await ctx.subtitleService.findByClipId(ctx) || [];
});
router.get('/clips/:clipId/srt', async ctx => {
    ctx.body = await ctx.subtitleService.findSrtByClipId(ctx) || '';
});

app.use(koaBody({ 
    jsonLimit: config.web.bodyLimit, 
    formLimit: config.web.bodyLimit,
    textLimit: config.web.bodyLimit,
    multipart: true,
    formidable: {
        uploadDir: config.web.tmpDir,
        keepExtensions: true
    }
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