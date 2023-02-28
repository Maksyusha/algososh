import { ChangeEvent, FC, useEffect, useState } from "react";
import styles from "./sorting-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";
import { Direction } from "../../types/direction";
import { ElementStates } from "../../types/element-states";
import { getRandomColumns } from "./sorting-page.utils";
import { swap } from "../../utils/swap";
import { sleep } from "../../utils/sleep";
import { DELAY_IN_MS } from "../../constants/delays";

enum SortType {
  Selection = "selection",
  Bubble = "bubble",
}

type TColumn = {
  number: number;
  state: ElementStates;
};

export const SortingPage: FC = () => {
  const [isLoader, setIsLoader] = useState(false);
  const [sortType, setSortType] = useState(SortType.Selection);
  const [sortDirection, setSortDirection] = useState<Direction>(
    Direction.Ascending
  );
  const [randomColumns, setRandomColumns] = useState<TColumn[]>([]);

  const sortBySelectionAscending = async () => {
    setIsLoader(true);
    const arr = randomColumns.slice();

    for (let i = 0; i < arr.length; i++) {
      let minIndex = i;

      for (let j = i; j < arr.length; j++) {
        arr[j].state = ElementStates.Changing;
        setRandomColumns([...arr]);
        await sleep(DELAY_IN_MS);

        if (arr[minIndex].number > arr[j].number) {
          minIndex = j;
        }

        arr[j].state = ElementStates.Default;
      }

      swap(arr, i, minIndex);
      arr[i].state = ElementStates.Modified;
      setRandomColumns([...arr]);
    }
    setIsLoader(false);
  };

  const sortBySelectionDescending = async () => {
    setIsLoader(true);
    const arr = randomColumns.slice();

    for (let i = 0; i < arr.length; i++) {
      let maxIndex = i;

      for (let j = i; j < arr.length; j++) {
        arr[j].state = ElementStates.Changing;
        setRandomColumns([...arr]);
        await sleep(DELAY_IN_MS);

        if (arr[maxIndex].number < arr[j].number) {
          maxIndex = j;
        }

        arr[j].state = ElementStates.Default;
      }

      swap(arr, i, maxIndex);
      arr[i].state = ElementStates.Modified;
      setRandomColumns([...arr]);
    }
    setIsLoader(false);
  };

  const sortByBubbleAscending = async () => {
    setIsLoader(true);
    const arr = [...randomColumns];

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        arr[j].state = ElementStates.Changing;
        arr[j + 1].state = ElementStates.Changing;
        setRandomColumns([...arr]);
        await sleep(DELAY_IN_MS);

        if (arr[j].number > arr[j + 1].number) {
          swap(arr, j, j + 1);
        }

        arr[j].state = ElementStates.Default;
      }
      arr[arr.length - i - 1].state = ElementStates.Modified;
      setRandomColumns([...arr]);
    }
    setIsLoader(false);
  };

  const sortByBubbleDescending = async () => {
    setIsLoader(true);
    const arr = [...randomColumns];

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        arr[j].state = ElementStates.Changing;
        arr[j + 1].state = ElementStates.Changing;
        setRandomColumns([...arr]);
        await sleep(DELAY_IN_MS);

        if (arr[j].number < arr[j + 1].number) {
          swap(arr, j, j + 1);
        }

        arr[j].state = ElementStates.Default;
      }
      arr[arr.length - i - 1].state = ElementStates.Modified;
      setRandomColumns([...arr]);
    }
    setIsLoader(false);
  };

  const sortElements = (sortDirection: Direction) => {
    setSortDirection(sortDirection);

    if (sortType === SortType.Selection) {
      if (sortDirection === Direction.Ascending) {
        sortBySelectionAscending();
      } else {
        sortBySelectionDescending();
      }
    } else {
      if (sortDirection === Direction.Ascending) {
        sortByBubbleAscending();
      } else {
        sortByBubbleDescending();
      }
    }
  };

  const handleRadioInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget.value === SortType.Selection) {
      setSortType(SortType.Selection);
    } else {
      setSortType(SortType.Bubble);
    }
  };

  const handleSortButtonClick = (sortDirection: Direction) => {
    sortElements(sortDirection);
  };

  const handleNewArrButtonClick = () => {
    setRandomColumns(getRandomColumns());
  };

  useEffect(() => setRandomColumns(getRandomColumns()), []);

  return (
    <SolutionLayout title="Сортировка массива">
      <section className={styles["section"]}>
        <div className={styles["ui-container"]}>
          <div className={styles["radio-inputs-container"]}>
            <RadioInput
              label="Выбор"
              value={SortType.Selection}
              checked={sortType === SortType.Selection ? true : false}
              disabled={isLoader}
              onChange={handleRadioInputChange}
            />
            <RadioInput
              label="Пузырёк"
              value={SortType.Bubble}
              checked={sortType === SortType.Bubble ? true : false}
              disabled={isLoader}
              onChange={handleRadioInputChange}
            />
          </div>
          <div className={styles["sort-buttons-container"]}>
            <Button
              type="button"
              text="По возрастанию"
              sorting={Direction.Ascending}
              isLoader={
                sortDirection === Direction.Ascending && isLoader ? true : false
              }
              disabled={
                (sortDirection === Direction.Ascending && isLoader) || !isLoader
                  ? false
                  : true
              }
              onClick={() => handleSortButtonClick(Direction.Ascending)}
            />
            <Button
              type="button"
              text="По убыванию"
              sorting={Direction.Descending}
              isLoader={
                sortDirection === Direction.Descending && isLoader
                  ? true
                  : false
              }
              disabled={
                (sortDirection === Direction.Descending && isLoader) ||
                !isLoader
                  ? false
                  : true
              }
              onClick={() => handleSortButtonClick(Direction.Descending)}
            />
          </div>
          <Button
            type="button"
            text="Новый массив"
            disabled={isLoader}
            onClick={handleNewArrButtonClick}
          />
        </div>
        <ul className={styles["random-columns-list"]}>
          {randomColumns.map((column, index) => {
            return (
              <li key={index}>
                <Column index={column.number} state={column.state} />
              </li>
            );
          })}
        </ul>
      </section>
    </SolutionLayout>
  );
};
