import { faker } from "@faker-js/faker";

const apiUrl = Cypress.config("apiUrl");
const articleBody = {
  article: {
    title: faker.random.word(),
    description: faker.lorem.paragraph(),
    body: faker.random.word(),
  },
};

describe("API methods", () => {
  it("Get all tags from API and assert with tags array", () => {
    // authorization is not required
    const tags = ["implementations", "welcome", "introduction", "codebaseShow"];
    cy.request("GET", apiUrl + "/tags").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.tags).to.be.a("array");
      expect(response.body.tags).to.deep.eq(tags);
    });
  });

  it("Create article and assert response", () => {
    cy.apiLogin().then(({ body }) => {
      const { token, username } = body.user;
      cy.request({
        method: "POST",
        url: apiUrl + "/articles",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: articleBody,
      }).then((response) => {
        const { article } = response.body;
        expect(response.status).to.eq(200);
        expect(response.body).to.have.key("article");
        expect(article.author?.username).to.eq(username);
        expect(article.body).to.be.a("string");
        expect(article.body).to.eq(articleBody.article.body);
        expect(article.title).to.eq(articleBody.article.title);
        expect(article.description).to.eq(articleBody.article.description);
        expect(article.favorited).to.eq(false);
        expect(article.createdAt).to.be.a("string");
      });
    });
  });

  it("Get all articles and check new created article from previous step", () => {
    cy.apiLogin()
      .then(({ body }) => body.user.token)
      .then((token) => {
        cy.request({
          method: "GET",
          url: apiUrl + "/articles?limit=10&offset=0",
          headers: {
            Authorization: `Token ${token}`,
          },
        }).then((response) => {
          const { articles } = response.body;
          expect(response.status).to.eq(200);
          expect(articles.length).to.eq(response.body.articlesCount);
          const createdArticleIsExist = articles.some((article) => {
            return (
              article.body === articleBody.article.body &&
              article.title === articleBody.article.title &&
              article.description === articleBody.article.description
            );
          });
          expect(createdArticleIsExist).true;
        });
      });
  });

  it("Find from articles array created in step 2 article, delete it and assert new articles array", () => {
    cy.apiLogin().then(({ body }) => {
      const { token } = body.user;
      return cy
        .request({
          method: "GET",
          url: apiUrl + "/articles?limit=10&offset=0",
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          const targetArticleForDelete = response.body.articles.find(
            (article) =>
              article.body === articleBody.article.body &&
              article.title === articleBody.article.title &&
              article.description === articleBody.article.description
          );

          const { slug } = targetArticleForDelete;
          cy.request({
            method: "DELETE",
            url: apiUrl + `/articles/${slug}`,
            headers: {
              Authorization: `Token ${token}`,
            },
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.empty;
          });
        });
    });
  });
});
