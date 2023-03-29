describe("All routes are available", () => {
  it("string page is available", () => {
    cy.visit("/recursion");
  });

  it("fibonacci page is available", () => {
    cy.visit("/fibonacci");
  });

  it("sorting page is available", () => {
    cy.visit("/sorting");
  });

  it("stack page is available", () => {
    cy.visit("/stack");
  });

  it("queue page is available", () => {
    cy.visit("/queue");
  });

  it("list page is available", () => {
    cy.visit("/list");
  });
});
