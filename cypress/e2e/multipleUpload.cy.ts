import { Cylinder } from "lucide-react";

describe('test multiple file upload component', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/');

    cy.get('[data-testid="upload-header"]').should("exist")
    .should('have.text', 'File Upload');
    cy.wait(5000);
    cy.get('[data-testid="upload-input"]').click({force:true});
  })
})