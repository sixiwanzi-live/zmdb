import error from "../error.js";
import validation from "../validation.js";
import {toExtension} from '../utils.js';
import config from "../config.js";

export default class AuthorService {

    /**
     * @param {organizationId} 组织id 
     * @param {uid} 作者的B站账号
     * @param {name} 作者的B站昵称，长度不能低于1字符，不能超过20字符
     * @param {filename} 作者头像文件名
     */
    insert = async (ctx) => {
        const entity = ctx.request.body;
        let author = {};
        // 检查参数合法性
        const organizationId = entity.organizationId;
        if (!ctx.organizationDao.findById(organizationId)) {
            throw error.organization.NotFound;
        }
        author.organizationId = organizationId;

        const name = entity.name || '';
        if (name.length < validation.author.name.lowerLimit) {
            throw error.author.name.LengthTooShort;
        }
        if (name.length > validation.author.name.upperLimit) {
            throw error.author.name.LengthTooLong;
        }
        author.name = name;
        author.uid = entity.uid || '';

        const r = ctx.authorDao.insert(author);
        const id = r.lastInsertRowid;

        await ctx.fileClient.mkdir(`${config.web.staticDir}/authors/${organizationId}`);

        const filename = entity.filename || '';
        if (filename.length === 0) {
            throw error.files.NotFound;
        }
        const extension = toExtension(filename);
        const dst = `authors/${organizationId}/${id}${extension}`;
        const src = filename;
        await ctx.fileClient.move(src, dst);

        return ctx.authorDao.findById(id);
    }

    /**
     * @param {organizationId} 组织id 
     * @param {uid} 作者的B站账号
     * @param {name} 作者的B站昵称，长度不能低于1字符，不能超过20字符
     * @param {filename} 作者的头像
     */
    update = async (ctx) => {
        const id = parseInt(ctx.params.id);
        const entity = ctx.request.body;
        // 检查参数合法性
        let author = ctx.authorDao.findById(id);
        if (!author) {
            throw error.author.NotFound;
        }
        if (entity.hasOwnProperty('organizationId')) {
            const organizationId = entity.organizationId;
            if (!ctx.organizationDao.findById(organizationId)) {
                throw error.organization.NotFound;
            }
            author.organizationId = organizationId;
        }
        if (entity.hasOwnProperty('uid')) {
            author.uid = entity.uid;
        }
        if (entity.hasOwnProperty('name')) {
            const name = entity.name || '';
            if (name.length < validation.author.name.lowerLimit) {
                throw error.author.name.LengthTooShort;
            }
            if (name.length > validation.author.name.upperLimit) {
                throw error.author.name.LengthTooLong;
            }
            author.name = name;
        }

        ctx.authorDao.update(author);

        if (entity.hasOwnProperty('filename')) {
            const filename = entity.filename || '';
            if (filename.length === 0) {
                throw error.files.NotFound;
            }
            const extension = toExtension(filename);
            const dst = `authors/${author.organizationId}/${id}${extension}`;
            const src = filename;
            await ctx.fileClient.move(src, dst);
        }

        return ctx.authorDao.findById(id);
    }

    deleteById = async (ctx) => {
        const id = entity.id;
        const author = ctx.authorDao.findById(id);
        ctx.authorDao.deleteById(id);

        const file = `authors/${author.organizationId}/${id}.webp`;
        await ctx.filesClient.delete(file);
    }

    findByOrganizationId = (ctx) => {
        const organizationId = parseInt(ctx.request.params.organizationId);
        return ctx.authorDao.findByOrganizationId(organizationId);
    }

    findAll = (ctx) => {
        return ctx.authorDao.findAll();
    }
}