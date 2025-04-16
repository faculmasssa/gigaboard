// @ts-check

const mainBox = /** @type {HTMLElement} */ (document.getElementById('mainBox'));
const infoText = /** @type {HTMLElement} */ (document.getElementById('infoText'));
const infoButton = /** @type {HTMLElement} */ (document.getElementById('infoBtn'));

let isCadastro = window.location.hash === '#registro';
swapForm();

function swapForm() {
    console.log(isCadastro);
    if (isCadastro) {
        window.location.hash = 'registro';
        infoText.innerHTML = 'Já tem conta?<br> Faça login';
        infoButton.textContent = 'Entrar';
        mainBox.classList.add('cadastro-mode');
    } else {
        window.location.hash = '';
        infoText.innerHTML = 'Se não tem login,<br> cadastre-se';
        infoButton.textContent = 'Cadastre-se';
        mainBox.classList.remove('cadastro-mode')
    }
}

global.toggleForm = function() {
    isCadastro = !isCadastro;
    swapForm();
}

global.login = function() {
    let email = /** @type {HTMLInputElement} */ (document.getElementById("login-email"));
    let password = /** @type {HTMLInputElement} */ (document.getElementById("login-password"));
    if(!email.reportValidity() || !password.reportValidity()) {
        return;
    }
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
        alert('sucexo');
    }else if(res.status === 409) {
        email.setCustomValidity('Email já registrado');
        email.reportValidity();
    }
}

module.exports = {};