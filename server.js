// @ts-check

const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const sql = require('sqlite3');

const app = express();
const db = new sql.Database(path.join(__dirname, 'db.sql'));
const public = path.join(__dirname, "./public");

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

/**
 * @typedef {object} User
 * @property {number} id
 * @property {string} name 
 * @property {string} email 
 * @property {Buffer} password
 * @property {Buffer} salt
 */

db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password BINARY(32) NOT NULL,
        salt BINARY(16) NOT NULL
    );
`);

app.get('/', (req, res) => {

    let token = "" // TODO: Pegar token nos cookies
    if (token) {
        res.sendFile(path.join(public, './index.html'));
    } else {
        res.sendFile(path.join(public, './cadastro.html'));
    }
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(public, './cadastro.html'));
});

app.get('/painel', (req, res) => {
    res.sendFile(path.join(public, './painel.html'));
});

/** @typedef {import('./js/script-cadastro.js').RegisterInfo} RegisterInfo */
app.post('/api/register', async (req, res) => {
    let /** @type {RegisterInfo} */ info = req.body;
    let /** @type {User | null} */ conflictingUser = await new Promise(res => 
        db.prepare('SELECT * FROM users WHERE email=?').get(info.email, (err, row) => res(row))
    );
    if(conflictingUser) {
        res.sendStatus(409);
        return;
    }
    let salt = crypto.randomBytes(16);
    let hashedPass = crypto.pbkdf2Sync(info.password, salt, 1000, 32, "sha256");
    db.prepare('INSERT INTO users (name, email, password, salt) VALUES (?, ?, ?, ?)')
        .get(info.name, info.email, hashedPass, salt);
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT} http://localhost:${PORT}/`);
});