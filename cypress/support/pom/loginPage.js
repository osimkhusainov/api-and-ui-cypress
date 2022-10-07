Cypress.Commands.add("findByInputAndType", (inputName, text) => {
  cy.findByPlaceholderText(inputName).should("be.empty").type(text);
});

Cypress.Commands.add("createUser", ({ username, email, password }) => {
  cy.findByInputAndType("Username", username);
  cy.findByInputAndType("Email", email);
  cy.findByInputAndType("Password", password);
  cy.findByRole("button", { name: /Sign up/i }).should("be.enabled").click();
});
