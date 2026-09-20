import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const dataDirectory = join(process.cwd(), ".data");
mkdirSync(dataDirectory, { recursive: true });

const database = new Database(join(dataDirectory, "365-sport.sqlite"));
database.pragma("journal_mode = WAL");
database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'Customer',
    status TEXT NOT NULL DEFAULT 'Active',
    orders INTEGER NOT NULL DEFAULT 0,
    spent REAL NOT NULL DEFAULT 0,
    joined TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// Ensure Superadmin account chengrathana14@gmail.com exists with password 11112222 and role Admin
import { randomBytes, scryptSync } from "node:crypto";

const seedAdminPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const adminUser = database
  .prepare("SELECT id FROM users WHERE email = ?")
  .get("chengrathana14@gmail.com") as { id: number } | undefined;

if (!adminUser) {
  database
    .prepare(
      `INSERT INTO users (name, email, password_hash, phone, role, status, joined)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      "Cheng Rothana",
      "chengrathana14@gmail.com",
      seedAdminPassword("11112222"),
      "+855 12 345 678",
      "Admin",
      "Active",
      new Date().toISOString(),
    );
} else {
  database
    .prepare(
      `UPDATE users 
       SET role = 'Admin', status = 'Active', password_hash = ?
       WHERE email = ?`,
    )
    .run(seedAdminPassword("11112222"), "chengrathana14@gmail.com");
}

export default database;

