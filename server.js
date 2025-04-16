// @ts-check

require('dotenv').config();
const express = require('express');
const basicAuth = require('express-basic-auth');
const bodyParser = require('body-parser');
const { BufferMap } = require('buffer-map');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');
const { Sequelize, DataTypes, Model } = require('sequelize');
const formatter = new (require('fracturedjsonjs')).Formatter();

const app = express();

const db = new Sequelize({ dialect: "sqlite", storage: path.join(__dirname, 'db.sql') });
db.sync({ force: true });


/**
 * @typedef {Object} User
 * @property {number} id 
 * @property {string} name 
 * @property {string} email 
 * @property {Buffer} password 
 * @property {Buffer} salt 
 * @typedef {Model<User, import('sequelize').Optional<User, 'id'>> & User} UserModel
 */
const User = db.define('User', /** @type {import('sequelize').ModelAttributes<UserModel>} */ ({
    id: { type: DataTypes.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: 'BINARY(32)', allowNull: false },
    salt: { type: 'BINARY(16)', allowNull: false },
}));

let /** @type {BufferMap<number>} */ sessions = new BufferMap();

const public = path.join(__dirname, "./public");

app.use(express.static(public, { index: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    if(!('token' in req.cookies)) {
        res.sendFile(path.join(public, './index.html'));
        return;
    }
    let token = Buffer.from(/** @type {string} */ (req.cookies['token']), 'base64');
    if(sessions.has(token)) {
        res.sendFile(path.join(public, './painel.html'));
    }else {
        res.sendFile(path.join(public, './index.html'));
    }
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(public, './cadastro.html'));
});

app.get('/admin', basicAuth({ 
    users: {'admin': /** @type {string} */ (process.env['API_KEY'])}, challenge: true 
}), (req, res) => {
    res.sendFile(path.join(public, './admin.html'));
});

/** @typedef {import('./js/cadastro.js').RegisterInfo} RegisterInfo */
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
    let /** @type {number} */ id = user.id;
    let token = crypto.randomBytes(32);
    sessions.set(token, id);
    res.status(200).send(token);
});

/** @typedef {import('./js/cadastro.js').LoginInfo} LoginInfo */
app.post('/api/login', async (req, res) => {
    let /** @type {RegisterInfo} */ info = req.body;
    let user = await User.findOne({where: { email: info.email }});
    if(!user) {
        res.sendStatus(409);
        return;
    }
    let hashedPass = crypto.pbkdf2Sync(info.password, user.salt, 1000, 32, "sha256");
    if(hashedPass.equals(user.password)) {
        let token = crypto.randomBytes(32);
        sessions.set(token, user.id);
        res.status(200).send(token);
    }else {
        res.sendStatus(409);
    }
});

/**
 * @typedef {Object} LogoutInfo
 * @property {string} token
 */
app.post('/api/logout', async (req, res) => {
    let /** @type {LogoutInfo} */ info = req.body;
    let token = Buffer.from(info.token, 'base64');
    if(sessions.has(token)) {
        sessions.delete(token);
    }
    res.sendStatus(200);
});

/** @typedef {import('./js/admin.js').QueryInfo} QueryInfo */
app.post('/api/query', async (req, res) => {
    let /** @type {QueryInfo} */ info = req.body;
    if(info.key !== process.env['API_KEY']) {
        res.sendStatus(401);
        return;
    }
    res.status(200).send(formatter.Serialize(await db.query(info.query)));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT} http://localhost:${PORT}/`);
});