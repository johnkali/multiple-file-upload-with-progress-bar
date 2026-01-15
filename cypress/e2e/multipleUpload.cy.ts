describe('test multiple file upload component', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/');

    cy.get('[data-testid="upload-header"]').should("exist")
    .should('have.text', 'File Upload');
    cy.wait(3000);
    cy.get('input[type="file"]').selectFile('cypress/fixtures/images/profile.jpg', {force: true});
    cy.get('[data-testid="upload-button"]').click();
    cy.wait(2000);
    cy.get('[data-testid="completed"]').should('have.text', 'Completed');
  })
})