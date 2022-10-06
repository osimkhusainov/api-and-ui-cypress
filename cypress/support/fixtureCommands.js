Cypress.Commands.add("generateUserCreds", () => {
  const { faker } = require("@faker-js/faker");
  cy.writeFile("cypress/fixtures/userRequestBody.json", {
    username: `${faker.random.word()}${faker.random.numeric(5)}`,
    email: `${faker.random.word()}@${faker.lorem.word()}.com`,
    password: `${faker.random.word()}${faker.random.numeric(5)}`,
  });
});

Cypress.Commands.add("readFixtureFile", (fileName) => {
  cy.readFile(`cypress/fixtures/${fileName}`);
});

Cypress.Commands.add("writeUserResponse", (response) => {
  cy.writeFile("cypress/fixtures/userResponse.json", JSON.stringify(response));
});

Cypress.Commands.add("cleareFixtureFile", (fileName) => {
  cy.writeFile(`cypress/fixtures/${fileName}`, {});
});
