import { faker } from "@faker-js/faker";

class NewArticlePage {
  createArticle() {
    const article = {
      title: faker.name.jobTitle(),
      description: faker.random.word(),
      body: faker.lorem.sentence(),
      tag: faker.random.word(),
    };
    cy.findByText("New Article").should("be.visible").click();
    cy.findByFormAndType("title", article.title);
    cy.findByFormAndType("description", article.description);
    cy.findByFormAndType("body", article.body);
    cy.findByPlaceholderText("Enter tags")
      .should("be.visible")
      .and("be.empty")
      .type(article.tag);
    cy.findByText("Publish Article").click();
    cy.get(".article-page h1")
      .should("be.visible")
      .and("have.text", article.title);
  }
}

export default NewArticlePage;
