export default class OrganizationDao {
    
    constructor(db) {
        this.db = db;
        this.__init();
    }

    __init = () => {
        const sql = 'CREATE TABLE IF NOT EXISTS organization(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, avatar TEXT NOT NULL)';
        this.db.exec(sql);
    }

    insert = (organization) => {
        const sql = 'INSERT INTO organization(name, avatar) VALUES(@name, @avatar)';
        const stmt = this.db.prepare(sql);
        return stmt.run(organization);
    }

    update = (organization) => {
        const sql = 'UPDATE organization SET name=@name WHERE id=@id';
        const stmt = this.db.prepare(sql);
        return stmt.run(organization);
    }

    deleteById = (id) => {
        const sql = 'DELETE FROM organization WHERE id=?';
        const stmt = this.db.prepare(sql);
        return stmt.run(id);
    }

    findById = (id) => {
        const sql = 'SELECT * FROM organization WHERE id = ?';
        const stmt = this.db.prepare(sql);
        return stmt.get(id);
    }

    findAll = () => {
        const sql = 'SELECT * FROM organization ORDER BY id ASC';
        const stmt = this.db.prepare(sql);
        return stmt.all();
    }
}
