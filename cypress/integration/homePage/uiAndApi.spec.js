const apiUrl = Cypress.config("apiUrl");

import HomePage from "../../support/pom/homePage";
import NewArticlePage from "../../support/pom/newArticlePage";

const homePage = new HomePage();
const { createArticle } = new NewArticlePage();

describe("Home page", () => {
  beforeEach(() => {
    cy.intercept(apiUrl + "/tags").as("tags");
    cy.intercept(apiUrl + "/articles?limit=10&offset=0").as("articles");
    cy.apiLogin();
    cy.visit("/");
  });

  it("Compare each like from UI and API response", () => {
    cy.findByText("Global Feed", { selector: "a" }).click();
    cy.wait("@articles").then(({ response }) => {
      cy.get(".article-preview button")
        .then((likes) => Cypress._.map(likes, "innerText"))
        .then((likes) => {
          response.body.articles.forEach((article) => {
            expect(likes.map((like) => parseInt(like))).includes(
              article.favoritesCount
            );
          });
        });
    });
  });

  it("Compare tags from API", () => {
    homePage.getTags("@tags");
  });

  it("Create new article and check countable like button", () => {
    // cy.apiLogin();
    // cy.visit("/");
    createArticle();
    cy.findByText("Home").click();
    cy.findByText("Global Feed").should("be.visible").click();
    cy.get(".article-preview button")
      .should("be.visible")
      .first()
      .should("contain", 0)
      .click()
      .should("contain", 1);
  });
});
