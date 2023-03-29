import { ElementStates } from "../../types/element-states";
import { swap } from "../../utils/swap";

export type TStringElement = {
  value: string;
  state: ElementStates;
};

// Переписал функцию разворота строки на генератор, чтобы убрать логику компонента
export function* reverseString(arr: TStringElement[] ) {
  let start = 0;
  let end = arr.length - 1;

  while (start <= end) {
    arr[start].state = ElementStates.Changing;
    arr[end].state = ElementStates.Changing;

    yield arr

    swap(arr, start, end);

    arr[start].state = ElementStates.Modified;
    arr[end].state = ElementStates.Modified;

    yield arr

    start++;
    end--;
  }

  return arr
};