const mainBox = document.getElementById('mainBox');
const infoText = document.getElementById('infoText');
const infoButton = document.getElementById('infoBtn');

let isCadastro = false;

function toggleForm() {
  isCadastro = !isCadastro;
  mainBox.classList.toggle('cadastro-mode');

  if (isCadastro) {
    infoText.innerHTML = 'Já tem conta?<br> Faça login';
    infoButton.textContent = 'Entrar';
  } else {
    infoText.innerHTML = 'Se não tem login,<br> cadastre-se';
    infoButton.textContent = 'Cadastre-se';
  }
}