export default class SubtitleDao {
    constructor(db) {
        this.db = db;
        this.__init();
    }

    __init = () => {
        const sql = 'CREATE TABLE IF NOT EXISTS subtitle(clipId INTEGER NOT NULL, lineId INTEGER NOT NULL, start INTEGER NOT NULL, end INTEGER NOT NULL, content TEXT NOT NULL, pinyinContent TEXT NOT NULL, PRIMARY KEY (clipId, lineId))';
        this.db.exec(sql);
    }

    insertByClipId = (clipId, subtitles) => {
        const sql = 'INSERT INTO subtitle(clipId, lineId, start, end, content, pinyinContent) VALUES(?, ?, ?, ?, ?, ?)';
        const stmt = this.db.prepare(sql);
        return this.db.transaction(items => {
            items.forEach(item => {
                stmt.run(clipId, item.lineId, item.start, item.end, item.content, item.pinyinContent);
            });
        })(subtitles);
    }

    update = (subtitle) => {
        const sql = 'UPDATE subtitle SET start=@start, end=@end, content=@content, pinyinContent=@pinyinContent WHERE clipId=@clipId AND lineId=@lineId';
        const stmt = this.db.prepare(sql);
        return stmt.run(subtitle);
    }

    deleteByClipId = (clipId) => {
        const sql = 'DELETE FROM subtitle WHERE clipId=?';
        const stmt = this.db.prepare(sql);
        return stmt.run(clipId);
    }

    findByClipIdAndLineId = (clipId, lineId) => {
        const sql = 'SELECT * FROM subtitle WHERE clipId=? AND lineId=?';
        const stmt = this.db.prepare(sql);
        return stmt.get(clipId, lineId);
    }

    findByClipId = (clipId) => {
        const sql = 'SELECT * FROM subtitle WHERE clipId=? ORDER BY lineId ASC';
        const stmt = this.db.prepare(sql);
        return stmt.all(clipId);
    }

    findLineIdByClipIdAndKeyword = (clipId, keyword, pinyinKeyword) => {
        const sql = 'SELECT lineId FROM subtitle WHERE clipId=? AND (content LIKE ? OR pinyinContent LIKE ?) ORDER BY lineId ASC';
        const stmt = this.db.prepare(sql);
        return stmt.all(clipId, `%${keyword}%`, `% ${pinyinKeyword} %`);
    }

    findLineIdByClipIdAndKeywordWithRegexp = (clipId, keywordPattern, pinyinKeywordPattern) => {
        const sql = 'SELECT lineId FROM subtitle WHERE clipId=? AND (content REGEXP ? OR pinyinContent REGEXP ?) ORDER BY lineId ASC';
        const stmt = this.db.prepare(sql);
        return stmt.all(clipId, keywordPattern, pinyinKeywordPattern);
    }

}
