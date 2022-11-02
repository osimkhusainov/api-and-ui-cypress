import { faker } from "@faker-js/faker";
describe("Example to Demonstrate SQL Database Testing in Cypress", () => {
  const newDb = faker.random.word();
  it("Create a Table", function () {
    cy.task(
      "queryDb",
      `CREATE TABLE ${newDb} (PersonID int, FirstName varchar(255), Address varchar(255), City varchar(255))`
    ).then((result) => cy.log(result));
  });

  it("Input Entries into the table", function () {
    cy.task(
      "queryDb",
      `INSERT INTO ${newDb} (PersonID, FirstName, Address, City) VALUES
    (001, "John", "House No. 01", "Helsinki"),
    (002, "Pam", "House No. 02", "Espoo"),
    (003, "Dwight", "House No. 03", "Lapland"),
    (004, "Michael", "House No. 04", "Vantaa");`
    ).then((result) => {
      expect(result.affectedRows).to.equal(4);
    });
  });

  it("Select particular person from DB", () => {
    cy.task(
      "queryDb",
      `SELECT FirstName FROM ${newDb} WHERE City="Vantaa"`
    ).then((result) => {
      expect(result[0].FirstName).to.equal("Michael");
    });
  });
});
