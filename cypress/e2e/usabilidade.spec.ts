// Teste de Usabilidade

interface Login {
    Email: string;
    Senha: string;
}

const loginnUsuario: Login = {
    Email: 'igor@testando.com',
    Senha: 'igornovo'
};

describe('Teste de Usabilidade - Cadastro e Criação de Tarefa', () => {
    it('Usuário consegue se cadastrar e adicionar uma tarefa', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Cadastre-se').click();
        cy.url().should('include', 'http://localhost:3000/cadastro#');

        cy.get('#login-email').type(loginnUsuario.Email);
        cy.get('#login-password').type(loginnUsuario.Senha);

        cy.contains('Entrar').click();

        cy.url().should('include', 'http://localhost:3000');

        cy.get('#task-add').type('Estudar Cypress');
        cy.contains('Adicionar').click();

        cy.contains('Estudar Cypress').should('be.visible');
    });
});