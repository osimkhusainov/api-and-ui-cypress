describe("Login page", () => {
  before(() => cy.generateUserCreds());
  beforeEach(() => {
    cy.visit("/");
    cy.findByText("Sign up").click();
  });

  after(() => cy.clearFixture("userRequestBody.json"));

  it("Create new user with new creds", () => {
    cy.readFixtureFile("userRequestBody.json").then((user) => {
      cy.createUser({ ...user });
      cy.get("ul.nav li")
        .should("be.visible")
        .and("include.text", user.username);
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
