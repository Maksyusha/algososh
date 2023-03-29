import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import {
  buttonAddTestSelector,
  buttonClearTestSelector,
  buttonDeleteTestSelector,
  circleBodyTestSelector,
  circleHeadTestSelector,
  circleTailTestSelector,
  circleTestSelector,
  circleTextTestSelector,
  colors,
} from "../../src/constants/tests";

describe("Queue page tests", () => {
  beforeEach(() => {
    cy.visit("/queue");
  });

  const inputValues = ["t", "e", "s", "t"];

  it("add button disabled when input is empty", () => {
    cy.get("input").should("be.empty");
    cy.get(buttonAddTestSelector).should("be.disabled");
  });

  it("animation of adding elements works correctly", () => {
    for (let i = 0; i < inputValues.length; i++) {
      cy.get("input").type(inputValues[i]);
      cy.get(buttonAddTestSelector).click();
      cy.get(circleBodyTestSelector)
        .eq(i)
        .should("have.css", "border-color", colors.changing);
      cy.wait(SHORT_DELAY_IN_MS);
      cy.get(circleBodyTestSelector)
        .eq(i)
        .should("have.css", "border-color", colors.changing);
      cy.get(circleTestSelector).eq(0).find(circleHeadTestSelector).should("have.text", "head");
      cy.get(circleTestSelector).eq(i).find(circleTailTestSelector).should("have.text", "tail");
      cy.get(circleTestSelector).eq(i).find(circleTextTestSelector).should("have.text", inputValues[i]);
      cy.wait(SHORT_DELAY_IN_MS);
      cy.get(circleBodyTestSelector)
        .eq(i)
        .should("have.css", "border-color", colors.default);
    }
  });

  it("animation of deleting elements works correctly", () => {
    for (let i = 0; i < inputValues.length; i++) {
      cy.get("input").type(inputValues[i]);
      cy.get(buttonAddTestSelector).click();
    }

    for (let i = 0; i < inputValues.length; i++) {
      cy.get(buttonDeleteTestSelector).click();
      cy.get(circleBodyTestSelector)
        .eq(i)
        .should("have.css", "border-color", colors.changing);
      cy.get(circleHeadTestSelector).eq(i).should("have.text", "head");
      cy.wait(SHORT_DELAY_IN_MS);
      cy.get(circleHeadTestSelector)
        .eq(i + 1)
        .should("have.text", "head");

      if (i !== inputValues.length - 1) {
        cy.get(circleTailTestSelector)
          .eq(inputValues.length - 1)
          .should("have.text", "tail");
      } else {
        cy.get(circleTailTestSelector).should("not.have.text");
      }
    }
  });

  it("clear button works correctly", () => {
    for (let i = 0; i < inputValues.length; i++) {
      cy.get("input").type(inputValues[i]);
      cy.get(buttonAddTestSelector).click();
    }

    cy.get(buttonClearTestSelector).click();
    cy.get(circleTestSelector).should("not.have.text");
    cy.get(circleHeadTestSelector).should("not.have.text");
    cy.get(circleTailTestSelector).should("not.have.text");
    cy.get(buttonClearTestSelector).should("be.disabled");
  });
});
