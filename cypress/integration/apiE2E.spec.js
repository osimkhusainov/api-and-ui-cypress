import { faker } from "@faker-js/faker";
import { it } from "mocha";

const apiUrl = Cypress.config("apiUrl");

const article = {
  title: `${faker.random.word()} ${faker.random.numeric(5)}`,
  description: faker.lorem.paragraph(),
  body: faker.random.word(),
};

const generateNum = (num) => Math.floor(Math.random() * num);
console.log(generateNum(99999));

describe("E2E API", () => {
  before(() => cy.generateUserCreds());

  after(() => {
    cy.cleareFixtureFile("userRequestBody.json");
    cy.cleareFixtureFile("userResponse.json");
  });
  it("API login", () => {
    cy.apiLogin().then((response) => expect(response.status).to.eq(200));
  });
  it("Create user", () => {
    cy.readFixtureFile("userRequestBody.json").then((user) => {
      cy.request({
        method: "POST",
        url: apiUrl + "/users",
        body: { user },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body?.user.username).to.eq(user.username);
        cy.writeUserResponse(response.body.user);
      });
    });
  });

  it("Get all tags from API and assert with tags array", () => {
    // authorization is not required
    cy.request("GET", apiUrl + "/tags").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body?.tags).to.be.a("array");
      const eachElementIsString = response.body?.tags.every(
        (tag) => typeof tag === "string"
      );
      expect(eachElementIsString).to.be.true;
    });
  });

  it("Create article and assert response", () => {
    cy.readFixtureFile("userResponse.json").then((user) => {
      const { token, username } = user;
      cy.request({
        method: "POST",
        url: apiUrl + "/articles",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: { article },
      }).then((response) => {
        const { article: articleBody } = response.body;
        expect(response.status).to.eq(200);
        expect(response.body).to.have.key("article");
        expect(articleBody.author?.username).to.eq(username);
        expect(articleBody.body).to.be.a("string");
        expect(articleBody.body).to.eq(article.body);
        expect(articleBody.title).to.eq(article.title);
        expect(articleBody.description).to.eq(article.description);
        expect(articleBody.favorited).to.eq(false);
        expect(articleBody.createdAt).to.be.a("string");
      });
    });
  });

  it("Get all articles and check new created article from previous step", () => {
    cy.readFixtureFile("userResponse.json").then((user) => {
      const { token } = user;
      cy.request({
        method: "GET",
        url: apiUrl + "/articles?limit=10&offset=0",
        headers: {
          Authorization: `Token ${token}`,
        },
      }).then((response) => {
        const { articles } = response.body;
        expect(response.status).to.eq(200);
        const createdArticleIsExist = articles.some((respArticle) => {
          return (
            respArticle.body === article.body &&
            respArticle.title === article.title &&
            respArticle.description === article.description
          );
        });
        expect(createdArticleIsExist).true;
      });
    });
  });

  it("Find from articles array created in step 2 article, delete it and assert new articles array", () => {
    cy.readFixtureFile("userResponse.json").then((user) => {
      const { token } = user;
      return cy
        .request({
          method: "GET",
          url: apiUrl + "/articles?limit=10&offset=0",
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          expect(response.status).to.eq(200);
          const targetArticleForDelete = response.body.articles.find(
            (respArticle) =>
              respArticle.body === article.body &&
              respArticle.title === article.title &&
              respArticle.description === article.description
          );

          const { slug } = targetArticleForDelete;
          cy.request({
            method: "DELETE",
            url: apiUrl + `/articles/${slug}`,
            headers: {
              Authorization: `Token ${token}`,
            },
          }).then((response) => {
            expect(response.status).to.eq(204);
            expect(response.body).to.be.empty;
          });

          cy.request({
            method: "GET",
            url: apiUrl + "/articles",
            headers: {
              Authorization: `Token ${token}`,
            },
          }).then(({ body }) =>
            expect(body.articlesCount).to.eq(response.body.articlesCount - 1)
          );
        });
    });
  });
});
