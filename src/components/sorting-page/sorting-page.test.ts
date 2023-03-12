import { ElementStates } from "../../types/element-states";
import {
  ESortingType,
  sortByBubble,
  sortBySelection,
  TColumn,
} from "./sorting-page.utils";
import { Direction } from "../../types/direction";

const getSortedNumber = (
  arr: TColumn[],
  sortingType: ESortingType,
  sortingDirection: Direction
) => {
  const gen =
    sortingType === ESortingType.Selection
      ? sortingDirection === Direction.Ascending
        ? sortBySelection(arr, Direction.Ascending)
        : sortBySelection(arr, Direction.Descending)
      : sortingDirection === Direction.Ascending
      ? sortByBubble(arr, Direction.Ascending)
      : sortByBubble(arr, Direction.Descending);

  let next = gen.next();
  while (!next.done) {
    next = gen.next();
  }

  return next.value;
};

const testData = {
  emptyArr: [],
  oneElementArr: [{ number: 0, state: ElementStates.Default }],
  sortedOneElementArr: [{ number: 0, state: ElementStates.Modified }],
  fewElementsArr: [
    { number: 22, state: ElementStates.Default },
    { number: 11, state: ElementStates.Default },
    { number: 33, state: ElementStates.Default },
  ],
  sortedFewElementsArrAsc: [
    { number: 11, state: ElementStates.Modified },
    { number: 22, state: ElementStates.Modified },
    { number: 33, state: ElementStates.Modified },
  ],
  sortedFewElementsArrDesc: [
    { number: 33, state: ElementStates.Modified },
    { number: 22, state: ElementStates.Modified },
    { number: 11, state: ElementStates.Modified },
  ],
};

describe("Sorting by selection and bubble functions", () => {
  it("sorts empty array by selection in ascending order", () => {
    expect(
      getSortedNumber(
        testData.emptyArr,
        ESortingType.Selection,
        Direction.Ascending
      )
    ).toStrictEqual(testData.emptyArr);
  });

  it("sorts empty array by selection in descending order", () => {
    expect(
      getSortedNumber(
        testData.emptyArr,
        ESortingType.Selection,
        Direction.Descending
      )
    ).toStrictEqual(testData.emptyArr);
  });

  it("sorts empty array by bubble in ascending order", () => {
    expect(
      getSortedNumber(
        testData.emptyArr,
        ESortingType.Bubble,
        Direction.Ascending
      )
    ).toStrictEqual(testData.emptyArr);
  });

  it("sorts one item array by bubble in descending order", () => {
    expect(
      getSortedNumber(
        testData.emptyArr,
        ESortingType.Bubble,
        Direction.Descending
      )
    ).toStrictEqual(testData.emptyArr);
  });

  it("sorts one element array by selection in ascending order", () => {
    expect(
      getSortedNumber(
        testData.oneElementArr,
        ESortingType.Selection,
        Direction.Ascending
      )
    ).toStrictEqual(testData.sortedOneElementArr);
  });

  it("sorts one element array by selection in descending order", () => {
    expect(
      getSortedNumber(
        testData.oneElementArr,
        ESortingType.Selection,
        Direction.Descending
      )
    ).toStrictEqual(testData.sortedOneElementArr);
  });

  it("sorts one element array by bubble in ascending order", () => {
    expect(
      getSortedNumber(
        testData.oneElementArr,
        ESortingType.Bubble,
        Direction.Ascending
      )
    ).toStrictEqual(testData.sortedOneElementArr);
  });

  it("sorts one element array by bubble in descending order", () => {
    expect(
      getSortedNumber(
        testData.oneElementArr,
        ESortingType.Bubble,
        Direction.Descending
      )
    ).toStrictEqual(testData.sortedOneElementArr);
  });

  it("sorts a few elements array by selection in ascending order", () => {
    expect(
      getSortedNumber(
        testData.fewElementsArr,
        ESortingType.Selection,
        Direction.Ascending
      )
    ).toStrictEqual(testData.sortedFewElementsArrAsc);
  });

  it("sorts a few elements array by selection in descending order", () => {
    expect(
      getSortedNumber(
        testData.fewElementsArr,
        ESortingType.Selection,
        Direction.Descending
      )
    ).toStrictEqual(testData.sortedFewElementsArrDesc);
  });

  it("sorts a few elements array by bubble in ascending order", () => {
    expect(
      getSortedNumber(
        testData.fewElementsArr,
        ESortingType.Bubble,
        Direction.Ascending
      )
    ).toStrictEqual(testData.sortedFewElementsArrAsc);
  });

  it("sorts a few elements array by bubble in descending order", () => {
    expect(
      getSortedNumber(
        testData.fewElementsArr,
        ESortingType.Bubble,
        Direction.Descending
      )
    ).toStrictEqual(testData.sortedFewElementsArrDesc);
  });
});
