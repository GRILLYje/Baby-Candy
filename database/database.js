const Database = require("better-sqlite3");

/* เปิด database */

const db = new Database("./database.sqlite", {
  verbose: console.log
});

console.log("✅ SQLite Connected");

/* performance */

db.exec(`
PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
PRAGMA busy_timeout=5000;
`);

/* ================= ACTIVITIES ================= */

db.exec(`
CREATE TABLE IF NOT EXISTS activities (
id INTEGER PRIMARY KEY AUTOINCREMENT,
type TEXT,
user TEXT,
date INTEGER
);
`);

/* ================= LEAVES ================= */

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

/* ================= MEMBERS ================= */

db.exec(`
CREATE TABLE IF NOT EXISTS members (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id TEXT,
role TEXT,
weapon TEXT
);
`);

/* ================= ITEMS (ส่งของ) ================= */

db.exec(`
CREATE TABLE IF NOT EXISTS items (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
amount INTEGER,
note TEXT,
status TEXT,
created_at INTEGER
);
`);

/* ================= BALANCES (ยอดเงิน) ================= */

db.exec(`
  CREATE TABLE IF NOT EXISTS balances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT,
  balance INTEGER
  );
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS money_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      user TEXT,
      amount INTEGER,
      note TEXT,
      date INTEGER
    );
    `);

module.exports = db;