export default class ClipDao {

    constructor(db) {
        this.db = db;
        this.__init();
    }

    __init = () => {
        const sql = 'CREATE TABLE IF NOT EXISTS clip(id INTEGER PRIMARY KEY AUTOINCREMENT, authorId INTEGER NOT NULL, title TEXT NOT NULL, bv TEXT NOT NULL UNIQUE, datetime TEXT NOT NULL)';
        this.db.exec(sql);
    }

    __toDTO = (entity) => {
        return {
            id: entity.clip_id,
            authorId: entity.clip_authorId,
            title: entity.clip_title,
            bv: entity.clip_bv,
            datetime: entity.clip_datetime,
            author: {
                id: entity.author_id,
                organizationId: entity.author_organizationId,
                uid: entity.author_uid,
                name: entity.author_name,
                organization: {
                    id: entity.organization_id,
                    name: entity.organization_name
                }
            }
        };
    }

    insert = (clip) => {
        const sql = 'INSERT INTO clip(authorId, title, bv, datetime) VALUES(@authorId, @title, @bv, @datetime)';
        const stmt = this.db.prepare(sql);
        return stmt.run(clip);
    }

    update = (clip) => {
        const sql = 'UPDATE clip SET authorId=@authorId, title=@title, bv=@bv, datetime=@datetime WHERE id=@id';
        const stmt = this.db.prepare(sql);
        return stmt.run(clip);
    }

    deleteById = (id) => {
        const sql = 'DELETE FROM clip WHERE id=?';
        const stmt = this.db.prepare(sql);
        return stmt.run(id);
    }

    findById = (id) => {
        const sql = 'SELECT * FROM clip WHERE id=?';
        const stmt = this.db.prepare(sql);
        return stmt.get(id);
    }

    findByBv = (bv) => {
        const sql = 'SELECT * FROM clip WHERE bv=?';
        const stmt = this.db.prepare(sql);
        return stmt.get(bv);
    }

    findByOrganizationId = (organizationId) => {
        const sql = 'SELECT ' + 
                        'clip.id as clip_id, ' +
                        'clip.authorId as clip_authorId, ' +
                        'clip.title as clip_title, ' +
                        'clip.bv as clip_bv, ' +
                        'clip.datetime as clip_datetime, ' +
                        'author.id as author_id, ' +
                        'author.organizationId as author_organizationId, ' +
                        'author.uid as author_uid, ' +
                        'author.name as author_name, ' +
                        'organization.id as organization_id, ' +
                        'organization.name as organization_name ' +
                    'FROM clip ' +
                    'LEFT JOIN author ON clip.authorId=author.id ' +
                    'LEFT JOIN organization ON author.organizationId=organization.id ' +
                    'WHERE organization.id=? ' +
                    'ORDER BY clip.datetime DESC';
        const stmt = this.db.prepare(sql);
        return stmt.all(organizationId).map(item => { return this.__toDTO(item) });
    }

    findByAuthorIdsAndKeyword = (authorIds, keyword) => {
        const sql = 'SELECT ' + 
                        'DISTINCT(clip.id) AS clip_id,' +
                        'clip.authorId AS clip_authorId,' +
                        'clip.title AS clip_title,' +
                        'clip.bv AS clip_bv,' +
                        'clip.datetime AS clip_datetime,' +
                        'author.id AS author_id,' +
                        'author.organizationId AS author_organizationId,' +
                        'author.uid AS author_uid,' +
                        'author.name AS author_name,' +
                        'organization.id AS organization_id,' +
                        'organization.name AS organization_name ' +
                    'FROM clip ' +
                    'LEFT JOIN subtitle ON clip.id = subtitle.clipId '+
                    'LEFT JOIN author ON clip.authorId=author.id ' +
                    'LEFT JOIN organization ON author.organizationId=organization.id ' +
                    `WHERE subtitle.content LIKE ? AND clip.authorId IN (${authorIds.join(',')}) ` +
                    'ORDER BY clip.datetime DESC';
        const stmt = this.db.prepare(sql);
        return stmt.all('%' + keyword + '%').map(item => { return this.__toDTO(item) });
    }

    findByAuthorIdsAndPinyinKeyword = (authorIds, pinyinKeyword) => {
        const sql = 'SELECT ' + 
                        'DISTINCT(clip.id) AS clip_id,' +
                        'clip.authorId AS clip_authorId,' +
                        'clip.title AS clip_title,' +
                        'clip.bv AS clip_bv,' +
                        'clip.datetime AS clip_datetime,' +
                        'author.id AS author_id,' +
                        'author.organizationId AS author_organizationId,' +
                        'author.uid AS author_uid,' +
                        'author.name AS author_name,' +
                        'organization.id AS organization_id,' +
                        'organization.name AS organization_name ' +
                    'FROM clip ' +
                    'LEFT JOIN subtitle ON clip.id = subtitle.clipId '+
                    'LEFT JOIN author ON clip.authorId=author.id ' +
                    'LEFT JOIN organization ON author.organizationId=organization.id ' +
                    `WHERE subtitle.pinyinContent LIKE ? AND clip.authorId IN (${authorIds.join(',')}) ` +
                    'ORDER BY clip.datetime DESC';
        const stmt = this.db.prepare(sql);
        return stmt.all('%' + pinyinKeyword + '%').map(item => { return this.__toDTO(item) });
    }
}