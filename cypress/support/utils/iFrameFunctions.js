/*
    Example:
        getIframeBody()
            .find("#ProductSummary-totalAmount")
            .children()
            .invoke("text")
            .then((text) => cy.log(text));
*/

const getIframeDocument = () => {
  return cy
    .get("iframe#checkout-demo")
    .its("0.contentDocument")
    .should("exist");
};

export const getIframeBody = () => {
  return getIframeDocument()
    .its("body")
    .should("not.be.undefined")
    .then(cy.wrap);
};
