// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import "@testing-library/cypress/add-commands";
import "cypress-file-upload";

// API
Cypress.Commands.add("apiLogin", () => {
  cy.request("POST", Cypress.config("apiUrl") + "/users/login", {
    user: {
      email: Cypress.env("EMAIL"),
      password: Cypress.env("PASSWORD"),
    },
  }).then(({ body }) => {
    localStorage.setItem("jwtToken", body.user.token);
  });
});

// UI
Cypress.Commands.add("uiLogin", () => {
  cy.findByText("Sign in").click();
  cy.findByPlaceholderText("Email").type(Cypress.env("EMAIL"));
  cy.findByPlaceholderText("Password").type(Cypress.env("PASSWORD"));
  cy.findByRole("button", { name: /Sign In/i }).click();
});
