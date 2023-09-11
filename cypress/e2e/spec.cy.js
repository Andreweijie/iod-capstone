describe("browse and see details of a place", () => {
  it("passes", () => {
    cy.viewport(1920, 1080);

    cy.visit("http://localhost:3000/");

    cy.get(".place-card").should("have.length", 8);

    cy.get("#search-filter").type("the");

    cy.get(".place-card").should("have.length", 3);

    cy.get(".place-grid>.place-card").eq(1).contains("More").click();
  });
});
