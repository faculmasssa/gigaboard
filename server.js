// @ts-check

const express = require('express');
const path = require('path');
const sql = require('sqlite3');

const app = express();
const db = new sql.Database(path.join(__dirname, 'db.sql'));
const public = path.join(__dirname, "./public");

app.use(express.static(path.join(__dirname, 'public')));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT} http://localhost:${PORT}/`);
});