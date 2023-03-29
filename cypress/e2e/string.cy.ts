import {
  colors,
  buttonReverseTestSelector,
  circleBodyTestSelector,
} from "../../src/constants/tests";
import { DELAY_IN_MS } from "../../src/constants/delays";

describe("String page tests", () => {
  beforeEach(() => {
    cy.visit("/recursion");
  });

  it("button disabled when input is empty", () => {
    cy.get("input").should("be.empty");
    cy.get(buttonReverseTestSelector).should("be.disabled");
  });

  it("reverse animation works correctly", () => {
    const testData = [
      {
        value: "tests",
        borderColors: [
          colors.changing,
          colors.default,
          colors.default,
          colors.default,
          colors.changing,
        ],
      },
      {
        value: "sestt",
        borderColors: [
          colors.modified,
          colors.default,
          colors.default,
          colors.default,
          colors.modified,
        ],
      },
      {
        value: "sestt",
        borderColors: [
          colors.modified,
          colors.changing,
          colors.default,
          colors.changing,
          colors.modified,
        ],
      },
      {
        value: "stset",
        borderColors: [
          colors.modified,
          colors.modified,
          colors.default,
          colors.modified,
          colors.modified,
        ],
      },
      {
        value: "stset",
        borderColors: [
          colors.modified,
          colors.modified,
          colors.changing,
          colors.modified,
          colors.modified,
        ],
      },
      {
        value: "stset",
        borderColors: [
          colors.modified,
          colors.modified,
          colors.modified,
          colors.modified,
          colors.modified,
        ],
      },
    ];

    cy.get("input").type(testData[0].value);
    cy.get(buttonReverseTestSelector).click();

    for (let i = 0; i < testData.length; i++) {
      cy.get(circleBodyTestSelector).each(($el, j) => {
        cy.wrap($el).contains(testData[i].value[j]);
        cy.wrap($el).should(
          "have.css",
          "border-color",
          testData[i].borderColors[j]
        );
      });

      cy.wait(DELAY_IN_MS);
    }
  });
});
