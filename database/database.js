const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
if(err) return console.error(err);
console.log("✅ SQLite Connected");
});

db.run(`
CREATE TABLE IF NOT EXISTS activities (
id INTEGER PRIMARY KEY AUTOINCREMENT,
type TEXT,
user TEXT,
date INTEGER
)
`);

module.exports = db;