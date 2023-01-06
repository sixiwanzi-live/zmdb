export default class ClipDao {

    constructor(db) {
        this.db = db;
        this.__init();
    }

    __init = () => {
        const sql = 'CREATE TABLE IF NOT EXISTS clip(id INTEGER PRIMARY KEY AUTOINCREMENT, authorId INTEGER NOT NULL, title TEXT NOT NULL, datetime TEXT NOT NULL, cover TEXT NOT NULL, type INTEGER NOT NULL, playUrl TEXT NOT NULL, redirectUrl TEXT NOT NULL)';
        this.db.exec(sql);
    }

    __toDTO = (entity) => {
        return {
            id: entity.clip_id,
            authorId: entity.clip_authorId,
            title: entity.clip_title,
            datetime: entity.clip_datetime,
            cover: entity.clip_cover,
            type: entity.clip_type,
            playUrl: entity.clip_playUrl,
            redirectUrl: entity.clip_redirectUrl,
            author: {
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
        };
    }

    insert = (clip) => {
        const sql = 'INSERT INTO clip(authorId, title, datetime, cover, type, playUrl, redirectUrl) VALUES(@authorId, @title, @datetime, @cover, @type, @playUrl, @redirectUrl)';
        const stmt = this.db.prepare(sql);
        return stmt.run(clip);
    }

    update = (clip) => {
        const sql = 'UPDATE clip SET authorId=@authorId, title=@title, datetime=@datetime, cover=@cover, type=@type, playUrl=@playUrl, redirectUrl=@redirectUrl WHERE id=@id';
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

    findLatestByAuthorId = (authorId) => {
        const sql = 'SELECT * FROM clip WHERE authorId=? ORDER BY id DESC LIMIT 1';
        const stmt = this.db.prepare(sql);
        return stmt.get(authorId);
    }

    findByOrganizationId = (organizationId) => {
        const sql = 'SELECT ' + 
                        'clip.id as clip_id, ' +
                        'clip.authorId as clip_authorId, ' +
                        'clip.title as clip_title, ' +
                        'clip.datetime as clip_datetime, ' +
                        'clip.cover as clip_cover, ' +
                        'clip.type as clip_type, ' +
                        'clip.playUrl as clip_playUrl, ' +
                        'clip.redirectUrl as clip_redirectUrl, ' +
                        'author.id as author_id, ' +
                        'author.organizationId as author_organizationId, ' +
                        'author.uid as author_uid, ' +
                        'author.name as author_name, ' +
                        'author.avatar as author_avatar, ' +
                        'organization.id as organization_id, ' +
                        'organization.name as organization_name, ' +
                        'organization.avatar as organization_avatar ' +
                    'FROM clip ' +
                    'LEFT JOIN author ON clip.authorId=author.id ' +
                    'LEFT JOIN organization ON author.organizationId=organization.id ' +
                    'WHERE organization.id=? ' +
                    'ORDER BY clip.datetime DESC';
        const stmt = this.db.prepare(sql);
        return stmt.all(organizationId).map(item => { return this.__toDTO(item) });
    }

    findByAuthorIdsAndKeyword = (authorIds, keyword, pinyinKeyword) => {
        const sql = 'SELECT ' + 
                        'DISTINCT(clip.id) AS clip_id,' +
                        'clip.authorId AS clip_authorId,' +
                        'clip.title AS clip_title,' +
                        'clip.datetime AS clip_datetime,' +
                        'clip.cover as clip_cover, ' +
                        'clip.type as clip_type, ' +
                        'clip.playUrl as clip_playUrl, ' +
                        'clip.redirectUrl as clip_redirectUrl, ' +
                        'author.id AS author_id,' +
                        'author.organizationId AS author_organizationId,' +
                        'author.uid AS author_uid,' +
                        'author.name AS author_name,' +
                        'author.avatar AS author_avatar,' +
                        'organization.id AS organization_id,' +
                        'organization.name AS organization_name, ' +
                        'organization.avatar AS organization_avatar ' +
                    'FROM clip ' +
                    'LEFT JOIN subtitle ON clip.id = subtitle.clipId '+
                    'LEFT JOIN author ON clip.authorId=author.id ' +
                    'LEFT JOIN organization ON author.organizationId=organization.id ' +
                    `WHERE (subtitle.content LIKE ? OR subtitle.pinyinContent LIKE ?) AND clip.authorId IN (${authorIds.join(',')}) ` +
                    'ORDER BY clip.datetime DESC';
        const stmt = this.db.prepare(sql);
        return stmt.all(`%${keyword}%`, `% ${pinyinKeyword} %`).map(item => { return this.__toDTO(item) });
    }

    findByAuthorIdsAndKeywordWithRegexp = (authorIds, keywordPattern, pinyinKeywordPattern) => {
        const sql = 'SELECT ' + 
                        'DISTINCT(clip.id) AS clip_id,' +
                        'clip.authorId AS clip_authorId,' +
                        'clip.title AS clip_title,' +
                        'clip.datetime AS clip_datetime,' +
                        'clip.cover as clip_cover, ' +
                        'clip.type as clip_type, ' +
                        'clip.playUrl as clip_playUrl, ' +
                        'clip.redirectUrl as clip_redirectUrl, ' +
                        'author.id AS author_id,' +
                        'author.organizationId AS author_organizationId,' +
                        'author.uid AS author_uid,' +
                        'author.name AS author_name,' +
                        'author.avatar AS author_avatar,' +
                        'organization.id AS organization_id,' +
                        'organization.name AS organization_name, ' +
                        'organization.avatar AS organization_avatar ' +
                    'FROM clip ' +
                    'LEFT JOIN subtitle ON clip.id = subtitle.clipId '+
                    'LEFT JOIN author ON clip.authorId=author.id ' +
                    'LEFT JOIN organization ON author.organizationId=organization.id ' +
                    `WHERE (subtitle.content REGEXP ? OR subtitle.pinyinContent REGEXP ?) AND clip.authorId IN (${authorIds.join(',')}) ` +
                    'ORDER BY clip.datetime DESC';
        const stmt = this.db.prepare(sql);
        return stmt.all(keywordPattern, pinyinKeywordPattern).map(item => { return this.__toDTO(item) });
    }
}