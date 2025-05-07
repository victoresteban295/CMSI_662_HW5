const db = require('../db/sqlite'); //Database Connection
const crypto = require('crypto');


//Create PBKDF2 Hash Using User's Password
const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha256').toString('hex');
    return `${salt}$${hash}`;
}

db.serialize(() => {
    //Add Users Table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            name TEXT,
            password TEXT
        )
    `);

    const insertUsers = db.prepare("INSERT OR IGNORE INTO users VALUES (?, ?, ?)");
    insertUsers.run('alice@example.com', 'Alice Xu', hashPassword("123456"));
    insertUsers.run('bob@example.com', 'Bobby Tables', hashPassword("123456"));
    insertUsers.finalize();
});