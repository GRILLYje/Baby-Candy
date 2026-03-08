const Database = require("better-sqlite3");

/* เปิด database */

const db = new Database("./database.sqlite", {
  verbose: console.log
});

console.log("✅ SQLite Connected");

/* ปรับ performance */

db.exec(`
PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
PRAGMA busy_timeout=5000;
`);

/* สร้าง tables */

db.exec(`
CREATE TABLE IF NOT EXISTS activities (
id INTEGER PRIMARY KEY AUTOINCREMENT,
type TEXT,
user TEXT,
date INTEGER
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS leaves (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user TEXT,
start TEXT,
end TEXT,
days INTEGER,
reason TEXT
);
`);

module.exports = db;