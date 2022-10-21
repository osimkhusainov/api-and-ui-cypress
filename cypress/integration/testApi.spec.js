describe("API", () => {
  const url =
    "https://app.usetopic.com/api/keyword_reports?api_key=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.0ijAY2LNVhfjIV4XxE2SxjAD12erDDVlT0t4qRj8sds";
  it("Check limit parameter", () => {
    const limit = 30;

    cy.request(`${url}&limit=${limit}`).then((response) => {
      const { reports, count } = response.body;
      expect(response.status).eq(200);
      expect(reports.length).to.eq(limit);
      expect(count).to.eq(limit);
    });
  });

  it("Check api_key param", () => {
    const offset = 30;
    cy.request(url).then(({ body }) => {
      const id = body.reports.map((report) => report.id);
      cy.log(id);
      cy.request(`${url}&offset=${offset}`).then(({ body }) => {
        const newIds = body.reports.map((report) => report.id);
        cy.log(newIds);
        expect(id).not.to.eq(newIds);
      });
    });
  });
});
