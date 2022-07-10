import validation from "../validation.js";
import error from '../error.js';
import config from "../config.js";
import { toExtension } from "../utils.js";

export default class OrganzationService {
    /**
     * 
     * @param {name} 社团名称，长度不能低于1字符，不能超过20字符 
     * @param {filename} 头像文件名
     * @returns 
     */
    insert = async (ctx) => {
        if (ctx.state.auth.organizationId !== 0) {
            throw error.auth.Unauthorized;
        }
        const entity = ctx.request.body;

        let organization = {};
        // 检查参数合法性
        const name = entity.name || '';
        if (name.length < validation.organization.name.lowerLimit) {
            throw error.organization.name.LengthTooShort;
        }
        if (name.length > validation.organization.name.upperLimit) {
            throw error.organization.name.LengthTooLong;
        }
        organization.name = name;

        const r = ctx.organizationDao.insert(organization);
        const id = r.lastInsertRowid;

        await ctx.fileClient.mkdir(`${config.web.staticDir}/organizations`);

        const filename = entity.filename || '';
        if (filename.length === 0) {
            throw error.files.NotFound;
        }
        const extension = toExtension(filename);
        const dst = `organizations/${id}${extension}`;
        const src = filename;
        await ctx.fileClient.move(src, dst);
        
        return ctx.organizationDao.findById(id);
    }

    /**
     * 
     * @param {name} 社团名称，长度不能低于1字符，不能超过20字符 
     * @param {filename} 头像文件名
     * @returns 
     */
    update = async (ctx) => {
        if (ctx.state.auth.organizationId !== 0) {
            throw error.auth.Unauthorized;
        }
        const id = parseInt(ctx.params.id);
        const entity = ctx.request.body;
        // 检查参数合法性
        let organization = ctx.organizationDao.findById(id);
        if (!organization) {
            throw error.organization.NotFound;
        }
        if (entity.hasOwnProperty('name')) {
            const name = entity.name;
            if (name.length < validation.organization.name.lowerLimit) {
                throw error.organization.name.LengthTooShort;
            }
            if (name.length > validation.organization.name.upperLimit) {
                throw error.organization.name.LengthTooLong;
            }
            organization.name = name;
        }

        ctx.organizationDao.update(organization);

        if (entity.hasOwnProperty('filename')) {
            const filename = entity.filename || '';
            if (filename.length === 0) {
                throw error.files.NotFound;
            }
            const extension = toExtension(filename);
            const dst = `organizations/${organization.id}${extension}`;
            const src = filename;
            await ctx.fileClient.move(src, dst);
        }

        return ctx.organizationDao.findById(id);
    }

    deleteById = async (ctx) => {
        if (ctx.state.auth.organizationId !== 0) {
            throw error.auth.Unauthorized;
        }
        const id = ctx.params.id;
        ctx.organizationDao.deleteById(id);
        
        const file = `organizations/${id}.webp`;
        await ctx.fileClient.delete(file);
    }
    
    findAll = (ctx) => {
        return ctx.organizationDao.findAll();
    }
}