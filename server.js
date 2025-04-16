// @ts-check

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

const db = new Sequelize({ dialect: "sqlite", storage: path.join(__dirname, 'db.sql') });
db.sync({ force: true });
const User = db.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: 'BINARY(32)', allowNull: false },
    salt: { type: 'BINARY(16)', allowNull: false },
});

let /** @type {Map<Buffer, number>} */ sessions = new Map();

const public = path.join(__dirname, "./public");

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    let token = Buffer.from(/** @type {string} */ (req.cookies['token']), 'base64');
    console.log(token.toString('base64'));
    if(sessions.has(token)) {
        res.sendFile(path.join(public, './painel.html'));
    }else {
        res.sendFile(path.join(public, './cadastro.html'));
    }
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(public, './cadastro.html'));
});


/** @typedef {import('./js/script-cadastro.js').RegisterInfo} RegisterInfo */
app.post('/api/register', async (req, res) => {
    let /** @type {RegisterInfo} */ info = req.body;
    let conflictingUser = await User.findOne({ where: { email: info.email } });
    if(conflictingUser) {
        res.sendStatus(409);
        return;
    }
    let salt = crypto.randomBytes(16);
    let hashedPass = crypto.pbkdf2Sync(info.password, salt, 1000, 32, "sha256");
    let user = await User.build({ name: info.name, email: info.email, password: hashedPass, salt: salt }).save();
    let /** @type {number} */ id = user.dataValues.id;
    let token = crypto.randomBytes(32);
    console.log('####', token.toString('base64'));
    sessions.set(token, id);
    res.status(200).send(token);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT} http://localhost:${PORT}/`);
});