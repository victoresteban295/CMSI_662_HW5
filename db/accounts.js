const db = require('../db/sqlite'); //Database Connection

db.serialize(() => {
    //Add Accounts Table (Funds in Cents)
    db.run(`
        CREATE TABLE IF NOT EXISTS accounts (
            id TEXT PRIMARY KEY,
            owner TEXT,
            shares INTEGER,
            funds INTEGER,
            FOREIGN KEY(owner) REFERENCES users(email)
        )
    `);

    const insertAccounts = db.prepare("INSERT OR IGNORE INTO accounts VALUES (?, ?, ?, ?)");
    insertAccounts.run('100', 'alice@example.com', 30, 5000); 
    insertAccounts.run('998', 'bob@example.com', 15, 10000);
    insertAccounts.finalize(); 
});