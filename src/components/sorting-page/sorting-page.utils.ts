import { Direction } from "../../types/direction";
import { ElementStates } from "../../types/element-states";
import { swap } from "../../utils/swap";

export enum ESortingType {
  Selection = "selection",
  Bubble = "bubble",
}

export type TColumn = {
  number: number;
  state: ElementStates;
};

export const getRandomInteger = (min: number, max: number) => {
  const randomInteger = Math.floor(min + Math.random() * (max + 1 - min));
  return randomInteger;
};

export const getRandomColumns = () => {
  const randomColumns = [];

  const randomLength = getRandomInteger(3, 17);

  for (let i = 0; i < randomLength; i++) {
    randomColumns.push({
      number: getRandomInteger(0, 100),
      state: ElementStates.Default,
    });
  }

  return randomColumns;
};

export function* sortBySelection(arr: TColumn[], sortingDirection: Direction) {
  if (!arr.length) {
    return arr;
  }

  arr[0].state = ElementStates.Changing;
  yield arr;

  for (let i = 0; i < arr.length; i++) {
    let index = i;

    for (let j = i; j < arr.length; j++) {
      arr[j].state = ElementStates.Changing;
      yield arr;

      const sortingCondition =
        sortingDirection === Direction.Ascending
          ? arr[index].number > arr[j].number
          : arr[index].number < arr[j].number;

      if (sortingCondition) {
        index = j;
      }

      arr[j].state = ElementStates.Default;
    }

    swap(arr, i, index);
    arr[i].state = ElementStates.Modified;
  }

  return arr;
}

export function* sortByBubble(arr: TColumn[], sortingDirection: Direction) {
  if (!arr.length) {
    return arr;
  }

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      arr[j].state = ElementStates.Changing;
      arr[j + 1].state = ElementStates.Changing;
      yield arr;

      const sortingCondition =
        sortingDirection === Direction.Ascending
          ? arr[j].number > arr[j + 1].number
          : arr[j].number < arr[j + 1].number;

      if (sortingCondition) {
        swap(arr, j, j + 1);
      }

      arr[j].state = ElementStates.Default;
    }
    arr[arr.length - i - 1].state = ElementStates.Modified;
    yield arr;
  }

  return arr;
}
