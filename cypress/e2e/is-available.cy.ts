describe("Application is available", () => {
  it('main page is available on "/localhost:3000"', () => {
    cy.visit("/");
  });
});
