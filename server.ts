import dotenv from 'dotenv';

import express from 'express';
import basicAuth from 'express-basic-auth';
import { BufferMap } from 'buffer-map'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { Formatter } from 'fracturedjsonjs';
import path from 'path';
import { AllowNull, Column, PrimaryKey, Table, Sequelize, Model, DataType, AutoIncrement, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import type { LoginInfo, RegisterInfo } from './src/cadastro';
import type { QueryInfo } from './src/admin';

const formatter = new Formatter();

dotenv.config();
const app = express();

const db = new Sequelize({ dialect: "sqlite", storage: path.join(__dirname, 'db.sql') });
db.sync();

@Table
export class User extends Model {

    @AllowNull(false) @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
    id!: number;
    @AllowNull(false) @Column(DataType.TEXT) 
    name!: string;
    @AllowNull(false) @Column(DataType.TEXT) 
    email!: string;
    @AllowNull(false) @Column('BINARY(32)') 
    password!: Buffer;
    @AllowNull(false) @Column('BINARY(16)') 
    salt!: Buffer;
    
    @HasMany(() => Task)
    tasks!: Task[];
}

export type TaskStatus = 'pending'|'ongoing'|'done';

@Table
export class Task extends Model {

    @AllowNull(false) @Column(DataType.TEXT) 
    name!: string;
    @AllowNull(false) @Column(DataType.ENUM('peding', 'ongoing', 'done'))
    status!: TaskStatus

    @BelongsTo(() => User)
    user!: User;
    @ForeignKey(() => User)
    userId!: number;
}

db.addModels([User, Task]);

let sessions: BufferMap<number> = new BufferMap();

const publicDir = path.join(__dirname, "./public");

app.use(express.static(publicDir, { index: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', async (req, res) => {
    if(!('token' in req.cookies)) {
        res.sendFile(path.join(publicDir, './index.html'));
        return;
    }
    let token = Buffer.from(<string>(req.cookies['token']), 'base64');
    if(sessions.has(token)) {
        console.log(await User.findByPk(sessions.get(token)));
        res.cookie('data', JSON.stringify((<User>await User.findByPk(sessions.get(token))).tasks || []));
        res.sendFile(path.join(publicDir, './painel.html'));
    }else {
        res.sendFile(path.join(publicDir, './index.html'));
    }
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(publicDir, './cadastro.html'));
});

app.get('/admin', basicAuth({ 
    users: {'admin': <string>(process.env['API_KEY'])}, challenge: true 
}), (req, res) => {
    res.sendFile(path.join(publicDir, './admin.html'));
});

app.post('/api/register', async (req, res) => {
    let info: RegisterInfo = req.body;
    let conflictingUser = await User.findOne({ where: { email: info.email } });
    if(conflictingUser) {
        res.sendStatus(409);
        return;
    }
    let salt = crypto.randomBytes(16);
    let hashedPass = crypto.pbkdf2Sync(info.password, salt, 1000, 32, "sha256");
    let user = await User.build({ name: info.name, email: info.email, password: hashedPass, salt: salt }).save();
    let id: number = user.id;
    let token = crypto.randomBytes(32);
    sessions.set(token, id);
    res.status(200).send(token);
});

app.post('/api/login', async (req, res) => {
    let info: LoginInfo = req.body;
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

export interface LogoutInfo { token: string }
app.post('/api/logout', async (req, res) => {
    let info: LogoutInfo = req.body;
    let token = Buffer.from(info.token, 'base64');
    if(sessions.has(token)) {
        sessions.delete(token);
    }
    res.sendStatus(200);
});

app.post('/api/query', async (req, res) => {
    let info: QueryInfo = req.body;
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