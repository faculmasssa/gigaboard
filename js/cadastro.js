// @ts-check

const Buffer = require('buffer/').Buffer;
const cookie = require('js-cookie');

const mainBox = /** @type {HTMLElement} */ (document.getElementById('mainBox'));
const infoText = /** @type {HTMLElement} */ (document.getElementById('infoText'));
const infoButton = /** @type {HTMLElement} */ (document.getElementById('infoBtn'));

let isCadastro = window.location.hash === '#registro';
swapForm();

function swapForm() {
    if (isCadastro) {
        history.replaceState(undefined, '', '#registro');
        window.location.hash = 'registro';
        infoText.innerHTML = 'Já tem conta?<br> Faça login';
        infoButton.textContent = 'Entrar';
        mainBox.classList.add('cadastro-mode');
    } else {
        history.replaceState(undefined, '', '#');
        infoText.innerHTML = 'Se não tem login,<br> cadastre-se';
        infoButton.textContent = 'Cadastre-se';
        mainBox.classList.remove('cadastro-mode')
    }
}

global.toggleForm = function() {
    isCadastro = !isCadastro;
    swapForm();
}

/** 
 * @typedef {Object} LoginInfo
 * @property {string} email 
 * @property {string} password
 */
global.login = async function() {
    let email = /** @type {HTMLInputElement} */ (document.getElementById("login-email"));
    let password = /** @type {HTMLInputElement} */ (document.getElementById("login-password"));
    if(!email.reportValidity() || !password.reportValidity()) {
        return;
    }
    let res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(/** @type {LoginInfo} */ ({
            email: email.value, password: password.value
        })),
        headers: {'Content-Type': 'application/json'},
    });
    if(res.status === 409) {
        email.setCustomValidity('Email ou senha inválido.')
        email.reportValidity();
        return;
    }else if(res.status !== 200) {
        return;
    }
    let token = Buffer.from(await res.arrayBuffer()).toString('base64');
    cookie.set('token', token);
    window.location.href = '/';
}

/** 
 * @typedef {Object} RegisterInfo
 * @property {string} name
 * @property {string} email 
 * @property {string} password
 */
global.register = async function() {
    let name = /** @type {HTMLInputElement} */ (document.getElementById("register-name"));
    let email = /** @type {HTMLInputElement} */ (document.getElementById("register-email"));
    let password = /** @type {HTMLInputElement} */ (document.getElementById("register-password"));
    let password2 = /** @type {HTMLInputElement} */ (document.getElementById("register-password2"));
    if(!name.reportValidity() || !email.reportValidity()) {
        return;
    }
    const minPasswordLength = 8;
    if(password.value.length < minPasswordLength) {
        password.setCustomValidity(`A senha precisa ter no mínimo ${minPasswordLength} caracteres.`);
        password.reportValidity();
        return;
    }
    if(password.value !== password2.value) {
        password.setCustomValidity('As senhas precisam ser iguais.');
        password.reportValidity();
        return;
    }
    let res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(/** @type {RegisterInfo} */ ({
            name: name.value, email: email.value, password: password.value
        })),
        headers: {'Content-Type': 'application/json'},
    });
    if(res.status === 200) {
        let token = Buffer.from(await res.arrayBuffer()).toString('base64');
        cookie.set('token', token);
        window.location.href = '/';
    }else if(res.status === 409) {
        email.setCustomValidity('Email já registrado');
        email.reportValidity();
    }
}

module.exports = {};