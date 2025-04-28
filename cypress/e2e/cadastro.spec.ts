// Teste de cadastro do usuário.
interface UsuarioCadastro {
    Nome: string;
    Email: string;
    Senha: string;
    Confirmar_Senha: string;
}

const novolsuario: UsuarioCadastro = {
    Nome: 'igor',
    Email: 'igor@testando.com',
    Senha: 'igornovo',
    Confirmar_Senha: 'igornovo'
};

describe('Entrada de dados', () => {
    it('O usuário deve se cadastrar e ter acesso ao todo-list', () => {
        cy.visit('http://localhost:3000/#');
        cy.contains('Começar').click();
        cy.url().should('include', 'http://localhost:3000/cadastro#registro');

        cy.get('#register-name').type(novolsuario.Nome);
        cy.get('#register-email').type(novolsuario.Email);
        cy.get('#register-password').type(novolsuario.Senha);
        cy.get('#register-password2').type(novolsuario.Confirmar_Senha);

        cy.contains('Cadastrar').click();
        cy.url().should('include', 'http://localhost:3000');
    });
});