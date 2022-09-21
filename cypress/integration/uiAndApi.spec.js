const apiUrl = Cypress.config("apiUrl");

import HomePage from "../pom/homePage";
import NewArticlePage from "../pom/newArticlePage";

const homePage = new HomePage();
const { createArticle } = new NewArticlePage();

describe("UI", () => {
  beforeEach(() => {
    cy.intercept(apiUrl + "/tags").as("tags");
    cy.intercept(apiUrl + "/articles?limit=10&offset=0").as("articles");
    cy.apiLogin();
    cy.visit("/");
  });

  it("Compare each likes from UI and API response", () => {
    cy.get(".article-preview button")
      .then((likes) => Cypress._.map(likes, "innerText"))
      .then((likes) => {
        cy.wait("@articles").then(({ response }) => {
          response.body.articles.forEach((article) => {
            expect(likes.map((like) => parseInt(like))).includes(
              article.favoritesCount
            );
          });
        });
      });
  });

  it("Compare tags from API", () => {
    cy.get(".tag-list a");
    homePage.getTags("@tags");
  });

  it("Create new article and check countable like button", () => {
    cy.uiLogin();
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
