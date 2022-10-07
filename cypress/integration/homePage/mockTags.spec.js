const apiUrl = Cypress.config("apiUrl");
import HomePage from "../../support/pom/homePage";

const { getTags } = new HomePage();

describe("Mock response for tags", () => {
  before(() => {
    cy.intercept(apiUrl + "/tags", { fixture: "tags.json" }).as("mock-tags");
    cy.visit("/");
  });
  it("Check tags from UI and mocked response", () => {
    getTags("@mock-tags");
  });
});
