class HomePage {
  getTags(endpoint) {
    cy.get(".tag-list a")
      .then((tags) => Cypress._.map(tags, "innerText"))
      .then((tags) => {
        cy.wait(endpoint).then(({ response }) =>
          response.body.tags.forEach((tag) => expect(tags).includes(tag))
        );
      });
  }
}

export default HomePage;
