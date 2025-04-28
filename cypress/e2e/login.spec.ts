// Teste de login.

interface Login {
    Email: string;
    Senha: string;
}

const loginUsuario: Login = {
    Email: 'igon@testando.com',
    Senha: 'igomovo'
};

describe('Teste de login do usuário', () => {
    it('O usuário deve clicar em login se já estiver registrado no banco de dados, após isso ele será direcionado ao Todo-list', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Cadastre-se').click();  
        cy.url().should('include', 'http://localhost:3000/cadastro#');  

        cy.get('#login-email').type(loginUsuario.Email);
        cy.get('#login-password').type(loginUsuario.Senha);

        cy.contains('Entrar').click();

        cy.url().should('include', 'http://localhost:3000');
    });
});