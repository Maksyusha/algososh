import {
  colors,
  buttonCalculateTestSelector,
  circleTestSelector,
  circleTextTestSelector,
  circleBodyTestSelector,
} from "../../src/constants/tests";
import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";

describe("Fibonacci page tests", () => {
  beforeEach(() => {
    cy.visit("/fibonacci");
  });

  it("button disabled when input is empty", () => {
    cy.get("input").should("be.empty");
    cy.get(buttonCalculateTestSelector).should("be.disabled");
  });

  it("fibonacci animation works correctly", () => {
    const inputValue = "8";
    const fibonacciNumbers = ["1", "1", "2", "3", "5", "8", "13", "21", "34"];

    cy.get("input").type(inputValue);
    cy.get(buttonCalculateTestSelector).click();

    for (let i = 0; i < fibonacciNumbers.length; i++) {
      cy.get(circleTestSelector).each(($el, j) => {
        cy.wrap($el)
          .find(circleTextTestSelector)
          .should("have.text", fibonacciNumbers[j]);
        cy.wrap($el)
          .find(circleBodyTestSelector)
          .should("have.css", "border-color", colors.default);
      });

      cy.wait(SHORT_DELAY_IN_MS);
    }
  });
});
