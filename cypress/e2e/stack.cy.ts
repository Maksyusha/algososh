import {
  colors,
  buttonAddTestSelector,
  circleTestSelector,
  buttonDeleteTestSelector,
  buttonClearTestSelector,
  circleBodyTestSelector,
} from "../../src/constants/tests";
import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";

describe("Stack page tests", () => {
  beforeEach(() => {
    cy.visit("/stack");
  });

  const inputValues = ["t", "e", "s", "t"];

  it("add button disabled when input is empty", () => {
    cy.get("input").should("be.empty");
    cy.get(buttonAddTestSelector).should("be.disabled");
  });

  it("animation of adding element works correctly", () => {
    for (let i = 0; i < inputValues.length; i++) {
      cy.get("input").type(inputValues[i]);
      cy.get(buttonAddTestSelector).click();

      cy.get(circleBodyTestSelector).each(($el, j) => {
        if (i != j) {
          cy.wrap($el).should("have.css", "border-color", colors.default);
        } else {
          cy.wrap($el).should("have.css", "border-color", colors.changing);
          cy.wait(SHORT_DELAY_IN_MS);
          cy.wrap($el).should("have.css", "border-color", colors.default);
        }
      });
    }
  });

  it("animation of deleting element works correctly", () => {
    for (let i = 0; i < inputValues.length; i++) {
      cy.get("input").type(inputValues[i]);
      cy.get(buttonAddTestSelector).click();
    }

    for (let i = inputValues.length - 1; i > 0; i--) {
      cy.get(buttonDeleteTestSelector).click()
      cy.get(circleBodyTestSelector).eq(i).should("have.css", "border-color", colors.changing);
      cy.wait(SHORT_DELAY_IN_MS)

      cy.get(circleBodyTestSelector).each(($el) => {
        cy.wrap($el).should("have.css", "border-color", colors.default);
      });

      cy.get(circleTestSelector).should("have.length", i);
    }

    cy.get(buttonDeleteTestSelector).click();
    cy.get(circleBodyTestSelector).should("have.css", "border-color", colors.changing);
    cy.wait(SHORT_DELAY_IN_MS);
    cy.get(circleTestSelector).should("have.length", 0);
    cy.get(buttonDeleteTestSelector).should("be.disabled");
  });

  it('clear button works correctly', () => {
    for (let i = 0; i < inputValues.length; i++) {
      cy.get("input").type(inputValues[i]);
      cy.get(buttonAddTestSelector).click();
    }

    cy.get(buttonClearTestSelector).click()
    cy.get(circleTestSelector).should('have.length', 0)
    cy.get(buttonClearTestSelector).should('be.disabled')
  })
});
