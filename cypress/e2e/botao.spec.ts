describe('Simulacao', () => {
    it('Deve navegar para a tela de cadastro ao clicar em Começar', () => {
        cy.visit('http://localhost:3000/#');
        cy.contains('Começar').click();
        cy.url().should('include', 'http://localhost:3000/cadastro#registro');
    });
});