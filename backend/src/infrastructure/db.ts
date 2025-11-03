import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'app.db');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

export const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('Tutor','Veterinário')),
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin','user')) DEFAULT 'user',
    crmv TEXT,
    clinicAddress TEXT,
    professionalIdDocPath TEXT,
    diplomaDocPath TEXT,
    createdAt TEXT NOT NULL DEFAULT (DATETIME('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);
`);


