export default class AuthorDao {

    constructor(db) {
        this.db = db;
        this.__init();
    }

    __init = () => {
        const sql = 'CREATE TABLE IF NOT EXISTS author(id INTEGER PRIMARY KEY AUTOINCREMENT, organizationId INTEGER NOT NULL, uid INTEGER NOT NULL UNIQUE, name TEXT NOT NULL UNIQUE, avatar TEXT NOT NULL)';
        this.db.exec(sql);
    }

    __toDTO = (entity) => {
        return {
            id: entity.author_id,
            organizationId: entity.author_organizationId,
            uid: entity.author_uid,
            name: entity.author_name,
            avatar: entity.author_avatar,
            organization: {
                id: entity.organization_id,
                name: entity.organization_name,
                avatar: entity.organization_avatar
            }
        }
    }

    insert = (author) => {
        const sql = 'INSERT INTO author(organizationId, uid, name, avatar) VALUES(@organizationId, @uid, @name, @avatar)';
        const stmt = this.db.prepare(sql);
        return stmt.run(author);
    }

    update = (author) => {
        const sql = 'UPDATE author SET organizationId=@organizationId, uid=@uid, name=@name, avatar=@avatar WHERE id=@id';
        const stmt = this.db.prepare(sql);
        return stmt.run(author);
    }

    deleteById = (id) => {
        const sql = 'DELETE FROM author WHERE id=?';
        const stmt = this.db.prepare(sql);
        return stmt.run(id);
    }

    findById = (id) => {
        const sql = 'SELECT * FROM author WHERE id=?';
        const stmt = this.db.prepare(sql);
        return stmt.get(id);
    }

    findByUid = (uid) => {
        const sql = 'SELECT * FROM author WHERE uid=?';
        const stmt = this.db.prepare(sql);
        return stmt.get(uid);
    }

    findAll = () => {
        const sql = 'SELECT ' + 
                        'author.id as author_id, ' +
                        'author.organizationId as author_organizationId, ' +
                        'author.uid as author_uid, ' +
                        'author.name as author_name, ' +
                        'author.avatar as author_avatar, ' +
                        'organization.id as organization_id, ' +
                        'organization.name as organization_name, ' +
                        'organization.avatar as organization_avatar ' +
                    'FROM author ' +
                    'LEFT JOIN organization ON author.organizationId=organization.id ' +
                    'ORDER BY author.id ASC';

        const stmt = this.db.prepare(sql);
        return stmt.all().map(item => this.__toDTO(item));
    }

    findByOrganizationId = (organizationId) => {
        const sql = 'SELECT ' + 
                        'author.id as author_id, ' +
                        'author.organizationId as author_organizationId, ' +
                        'author.uid as author_uid, ' +
                        'author.name as author_name, ' +
                        'author.avatar as author_avatar, ' +
                        'organization.id as organization_id, ' +
                        'organization.name as organization_name, ' +
                        'organization.avatar as organization_avatar ' +
                    'FROM author ' +
                    'LEFT JOIN organization ON author.organizationId=organization.id ' +
                    'WHERE organizationId=? ' +
                    'ORDER BY author.id ASC';

        const stmt = this.db.prepare(sql);
        return stmt.all(organizationId).map(item => this.__toDTO(item));
    }

    findAll = () => {
        const sql = 'SELECT ' +
                        'author.id as author_id, ' +
                        'author.organizationId as author_organizationId, ' +
                        'author.uid as author_uid, ' +
                        'author.name as author_name, ' +
                        'author.avatar as author_avatar, ' +
                        'organization.id as organization_id, ' +
                        'organization.name as organization_name, ' +
                        'organization.avatar as organization_avatar ' +
                    'FROM author ' +
                    'LEFT JOIN organization ON author.organizationId=organization.id ' +
                    'ORDER BY author.id DESC';
        const stmt = this.db.prepare(sql);
        return stmt.all().map(item => this.__toDTO(item));
    }
}
