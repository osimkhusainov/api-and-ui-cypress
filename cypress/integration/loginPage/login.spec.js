describe("Login page", () => {
  before(() => cy.generateUserCreds());
  const apiURL = Cypress.config("apiUrl");
  beforeEach(() => {
    cy.intercept("POST", apiURL + "/users").as("newUser");
    cy.visit("/");
    cy.findByText("Sign up").click();
  });

  after(() => cy.cleareFixtureFile("userRequestBody.json"));

  it("Create new user with new creds", () => {
    cy.readFixtureFile("userRequestBody.json").then((user) => {
      cy.createUser({ ...user });
      cy.wait("@newUser").then(({ response }) => {
        expect(response?.statusCode).to.eq(200);
        cy.get("ul.nav li")
          .should("be.visible")
          .and("include.text", user.username);
      });
    });
  });

  it("Create new user with same email and password", () => {
    cy.readFixtureFile("userRequestBody.json").then((user) => {
      cy.log({ user });
      cy.createUser({ ...user });
      cy.get(".error-messages")
        .should("contain.text", "email has already been taken")
        .and("contain.text", "username has already been taken");
    });
  });
});
