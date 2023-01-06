import validation from "../validation.js";
import error from '../error.js';

export default class OrganzationService {
    /**
     * 
     * @param {name}    社团名称，长度不能低于1字符，不能超过20字符 
     * @param {avatar}  B站的头像路径
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

        const avatar = entity.avatar || '';
        organization.avatar = avatar;

        const r = ctx.organizationDao.insert(organization);
        const id = r.lastInsertRowid;
        
        organization = ctx.organizationDao.findById(id);
        ctx.logger.info(`新增organization:${organization}`);
        return organization;
    }

    /**
     * 
     * @param {name}    社团名称，长度不能低于1字符，不能超过20字符 
     * @param {avatar}  B站头像路径
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
        if (entity.hasOwnProperty('avatar')) {
            const avatar = entity.avatar;
            organization.avatar = avatar;
        }

        ctx.organizationDao.update(organization);

        organization = ctx.organizationDao.findById(id);
        ctx.logger.info(`更新organization:${organization}`);
        return organization;
    }

    deleteById = async (ctx) => {
        if (ctx.state.auth.organizationId !== 0) {
            throw error.auth.Unauthorized;
        }
        const id = ctx.params.id;
        ctx.organizationDao.deleteById(id);
        ctx.logger.info(`删除organization:${id}`);
    }
    
    findAll = (ctx) => {
        return ctx.organizationDao.findAll();
    }
}