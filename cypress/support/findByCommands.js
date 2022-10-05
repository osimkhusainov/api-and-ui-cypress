Cypress.Commands.add("findByForm", (name) => {
  cy.get(`[formcontrolname='${name}']`);
});

Cypress.Commands.add("findByFormAndType", (formName, articleName) => {
  cy.findByForm(formName).should("be.visible").type(articleName);
});
