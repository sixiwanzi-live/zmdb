import Database from 'better-sqlite3';
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import config from './config.js';
import { Srt } from './utils.js'
import { errorHandler, auth } from './middlewares.js';
import FileClient from './file/FileClient.js';
import OrganizationDao from './organization/OrganizationDao.js';
import AuthorDao from './author/AuthorDao.js';
import ClipDao from './clip/ClipDao.js';
import SubtitleDao from './subtitle/SubtitleDao.js'
import OrganzationService from './organization/OrganizationService.js';
import AuthorService from './author/AuthorService.js';
import ClipService from './clip/ClipService.js';
import SubtitleService from './subtitle/SubtitleService.js';
import FileService from './file/FileServices.js';

const app = new Koa({ proxy: true });
const router = new Router();

const db = new Database(config.db.path, { verbose: console.log });

app.context.srt = new Srt();
app.context.fileClient = new FileClient();

app.context.organizationDao = new OrganizationDao(db);
app.context.authorDao = new AuthorDao(db);
app.context.clipDao = new ClipDao(db);
app.context.subtitleDao = new SubtitleDao(db);

app.context.organizationService = new OrganzationService();
app.context.authorService = new AuthorService();
app.context.clipService = new ClipService();
app.context.subtitleService = new SubtitleService();
app.context.fileService = new FileService();

/**
 * file
 */
router.post('/files/image', auth, async ctx => {
    ctx.body = await ctx.fileService.uploadImage(ctx);
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
router.get('/organizations/:organizationId/clips', async ctx => {
    ctx.body = await ctx.clipService.findByOrganizationId(ctx) || {};
});
router.get('/clips', async ctx => {
    ctx.body = await ctx.clipService.find(ctx) || {};
});

/**
 * subtitles
 */
router.post('/clips/:clipId/subtitles', auth, async ctx => {
    ctx.body = await ctx.subtitleService.insert(ctx);
});
router.get('/clips/:clipId/subtitles', async ctx => {
    ctx.body = await ctx.subtitleService.findByClipId(ctx) || [];
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
app.use(cors());
app.use(errorHandler);
app.use(router.routes());

app.listen(config.web.port);