import { DELAY_IN_MS } from "../../src/constants/delays";
import {
  buttonAddByIndexTestSelector,
  buttonAppendTestSelector,
  buttonDeleteByIndexTestSelector,
  buttonDeleteHeadTestSelector,
  buttonDeleteTailTestSelector,
  buttonPrependTestSelector,
  circleBodyTestSelector,
  circleHeadTestSelector,
  circleIndexTestSelector,
  circleTailTestSelector,
  circleTestSelector,
  circleTextTestSelector,
  colors,
  iconArrowTestSelector,
  inputIndexTestSelector,
  inputValueTestSelector,
} from "../../src/constants/tests";
import { DEFAULT_LIST_LENGTH } from "../../src/constants/data-structures";

describe("List page tests", () => {
  beforeEach(() => {
    cy.visit("/list");
  });

  const inputValue = "test";
  const inputIndex = "2";

  it("add button disabled when input is empty", () => {
    cy.get(inputValueTestSelector).should("be.empty");
    cy.get(buttonPrependTestSelector).should("be.disabled");
    cy.get(buttonAppendTestSelector).should("be.disabled");
    cy.get(inputIndexTestSelector).should("be.empty");
    cy.get(buttonAddByIndexTestSelector).should("be.disabled");
    cy.get(buttonDeleteByIndexTestSelector).should("be.disabled");
  });

  it("list renders correctly", () => {
    cy.get(circleTestSelector).each(($el, i, $list) => {
      cy.wrap($el)
        .find(circleBodyTestSelector)
        .should("have.css", "border-color", colors.default);
      cy.wrap($el).find(circleTextTestSelector).should("not.be.empty");
      cy.wrap($el).find(circleIndexTestSelector).should("have.text", i);
      cy.wrap($el)
        .find(circleHeadTestSelector)
        .then(($head) =>
          i === 0
            ? cy.wrap($head).should("have.text", "head")
            : cy.wrap($head).should("have.text", "")
        );
      cy.wrap($el)
        .find(circleTailTestSelector)
        .then(($tail) =>
          i === $list.length - 1
            ? cy.wrap($tail).should("have.text", "tail")
            : cy.wrap($tail).should("have.text", "")
        );
      cy.get(iconArrowTestSelector).should("have.length", $list.length - 1);
    });
  });

  it('animation of prepending element works correctly', () => {
    cy.get(inputValueTestSelector).type(inputValue)
    cy.get(buttonPrependTestSelector).click()
    cy.get(circleTestSelector).eq(0).then($circle => {
        cy.wrap($circle).find(circleHeadTestSelector).find(circleBodyTestSelector).should('have.css', 'border-color', colors.changing)
        cy.wrap($circle).find(circleHeadTestSelector).find(circleBodyTestSelector).should('have.text', inputValue)
    })
    cy.wait(DELAY_IN_MS)
    cy.get(circleTestSelector).eq(0).then($circle => {
        cy.wrap($circle).find(circleBodyTestSelector).should('have.css', 'border-color', colors.modified)
        cy.wrap($circle).find(circleTextTestSelector).should('have.text', inputValue)
    })
    cy.wait(DELAY_IN_MS)
    cy.get(circleBodyTestSelector).eq(0).should('have.css', 'border-color', colors.default)
  })

  it('animation of appending element works correctly', () => {
    cy.get(inputValueTestSelector).type(inputValue)
    cy.get(buttonAppendTestSelector).click()
    cy.get(circleTestSelector).last().then($circle => {
        cy.wrap($circle).find(circleBodyTestSelector).should('have.css', 'border-color', colors.changing)
        cy.wrap($circle).find(circleBodyTestSelector).should('have.text', inputValue)
    })
    cy.wait(DELAY_IN_MS)
    cy.get(circleTestSelector).last().then($circle => {
        cy.wrap($circle).find(circleBodyTestSelector).should('have.css', 'border-color', colors.modified)
        cy.wrap($circle).find(circleTextTestSelector).should('have.text', inputValue)
    })
    cy.wait(DELAY_IN_MS)
    cy.get(circleBodyTestSelector).last().should('have.css', 'border-color', colors.default)
  })

  it('animation of adding element by index works correctly', () => {
    cy.get(inputValueTestSelector).type(inputValue)
    cy.get(inputIndexTestSelector).type(inputIndex)
    cy.get(buttonAddByIndexTestSelector).click()

    for (let i = 0; i <= +inputIndex; i++) {
      cy.get(circleTestSelector).eq(i).find(circleHeadTestSelector).find(circleBodyTestSelector).should('have.css', 'border-color', colors.changing)
      cy.get(circleTestSelector).eq(i).find(circleHeadTestSelector).find(circleBodyTestSelector).find(circleTextTestSelector).should('have.text', inputValue)
      cy.wait(DELAY_IN_MS)
      if (i === 2) {
        cy.get(circleTestSelector).eq(i).find(circleBodyTestSelector).should('have.css', 'border-color', colors.modified)
        cy.get(circleTestSelector).eq(i).find(circleTextTestSelector).should('have.text', inputValue)
        cy.wait(DELAY_IN_MS)
        cy.get(circleTestSelector).eq(i).find(circleBodyTestSelector).should('have.css', 'border-color', colors.default)
        cy.get(circleTestSelector).eq(i).find(circleTextTestSelector).should('have.text', inputValue)
      } else {
        cy.get(circleTestSelector).eq(i).find(circleBodyTestSelector).should('have.css', 'border-color', colors.changing)
      }
    }

    cy.get(circleHeadTestSelector).eq(0).should('have.text', 'head')
    cy.get(circleTailTestSelector).last().should('have.text', 'tail')
    cy.get(circleBodyTestSelector).should('have.css', 'border-color', colors.default)
  })

  it("animation of deleting element from head works correctly", () => {
    cy.get(buttonDeleteHeadTestSelector).click();
    cy.get(circleTestSelector).should("have.length", DEFAULT_LIST_LENGTH + 1); // circles + tail circle of the deleting element
    cy.get(circleTestSelector)
      .eq(0)
      .find(circleTailTestSelector)
      .find(circleBodyTestSelector)
      .should("have.css", "border-color", colors.changing);
    cy.wait(DELAY_IN_MS);
    cy.get(circleTestSelector).should("have.length", DEFAULT_LIST_LENGTH - 1); // length after deleting
  });

  it("animation of deleting element from tail works correctly", () => {
    cy.get(buttonDeleteTailTestSelector).click();
    cy.get(circleTestSelector).should("have.length", DEFAULT_LIST_LENGTH + 1); // circles + tail circle of the deleting element
    cy.get(circleTestSelector)
      .last()
      .find(circleBodyTestSelector)
      .should("have.css", "border-color", colors.changing);
    cy.wait(DELAY_IN_MS);
    cy.get(circleTestSelector).should("have.length", DEFAULT_LIST_LENGTH - 1); // length after deleting
  });

  it("animation of deleting element by index works correctly", () => {
    cy.get(inputIndexTestSelector).type(inputIndex);
    cy.get(buttonDeleteByIndexTestSelector).click();

    for (let i = 0; i < +inputIndex; i++) {
      cy.get(circleTestSelector).each(($el, j) => {
        cy.wrap($el)
          .find(circleBodyTestSelector)
          .then(($body) => {
            j <= i
              ? cy
                  .wrap($body)
                  .should("have.css", "border-color", colors.changing)
              : cy
                  .wrap($body)
                  .should("have.css", "border-color", colors.default);
          });
      });
      cy.wait(DELAY_IN_MS);
    }

    cy.get(circleBodyTestSelector).should(
      "have.css",
      "border-color",
      colors.changing
    );
    cy.wait(DELAY_IN_MS)

    cy.get(circleBodyTestSelector).eq(+inputIndex).should('have.css', 'border-color', colors.default)
    cy.get(circleTestSelector).eq(+inputIndex).find(circleTailTestSelector).find(circleBodyTestSelector).should('have.css', 'border-color', colors.changing)
    cy.wait(DELAY_IN_MS)

    cy.get(circleTestSelector).should('have.length', DEFAULT_LIST_LENGTH - 1)
    cy.get(circleTestSelector).last().find(circleTailTestSelector).should('have.text', 'tail')
    cy.get(circleBodyTestSelector).should('have.css', 'border-color', colors.default)
  });
});
