const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'stock.db');
const db = new sqlite3.Database(dbPath); //One Shared Connection

module.exports = db;