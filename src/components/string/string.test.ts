import { ElementStates } from "../../types/element-states";
import { reverseString } from "./string.utils";

// функция прогона генератора реверсирования строки
const getReversedString = (str: string) => {
  const arr = str
    .split("")
    .map((letter) => ({ value: letter, state: ElementStates.Default }));

  const gen = reverseString(arr);
  let next = gen.next();

  while (!next.done) {
    next = gen.next();
  }

  return next.value.map((item) => item.value).join("");
};

describe("String reverse function", () => {
  it("reverses a string with an even number of characters", () => {
    const str = "test";
    const reversedStr = "tset";

    expect(getReversedString(str)).toBe(reversedStr);
  });

  it("reverses a string with an odd number of characters", () => {
    const str = "testing";
    const reversedStr = "gnitset";

    expect(getReversedString(str)).toBe(reversedStr);
  });

  it("reverses a string with one character", () => {
    const str = "t";
    const reversedStr = "t";

    expect(getReversedString(str)).toBe(reversedStr);
  });

  it("reverses an empty", () => {
    const str = "";
    const reversedStr = "";

    expect(getReversedString(str)).toBe(reversedStr);
  });
});
