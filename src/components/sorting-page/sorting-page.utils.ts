import { ElementStates } from "../../types/element-states";

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