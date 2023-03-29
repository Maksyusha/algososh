import { ChangeEvent, FC, useEffect, useState } from "react";
import styles from "./sorting-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";
import { Direction } from "../../types/direction";
import {
  ESortingType,
  TColumn,
  getRandomColumns,
  sortBySelection,
  sortByBubble,
} from "./sorting-page.utils";
import { sleep } from "../../utils/sleep";
import { DELAY_IN_MS } from "../../constants/delays";

export const SortingPage: FC = () => {
  const [isLoader, setIsLoader] = useState(false);
  const [SortingType, setSortingType] = useState(ESortingType.Selection);
  const [SortingDirection, setSortingDirection] = useState<Direction>(
    Direction.Ascending
  );
  const [randomColumns, setRandomColumns] = useState<TColumn[]>([]);

  const sortBySelectionWithDelay = async (SortingDirection: Direction) => {
    setIsLoader(true);

    const gen = sortBySelection(randomColumns.slice(), SortingDirection);
    let next = gen.next();

    while (!next.done) {
      setRandomColumns(next.value.slice());
      await sleep(DELAY_IN_MS);
      next = gen.next();
    }

    setIsLoader(false);
  };

  const sortByBubbleWithDelay = async (SortingDirection: Direction) => {
    setIsLoader(true);

    const gen = sortByBubble(randomColumns.slice(), SortingDirection);
    let next = gen.next();

    while (!next.done) {
      setRandomColumns(next.value.slice());
      await sleep(DELAY_IN_MS);
      next = gen.next();
    }

    setIsLoader(false);
  };

  const sortElements = (SortingDirection: Direction) => {
    setSortingDirection(SortingDirection);

    if (SortingType === ESortingType.Selection) {
      sortBySelectionWithDelay(SortingDirection);
    } else {
      sortByBubbleWithDelay(SortingDirection);
    }
  };

  const handleRadioInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget.value === ESortingType.Selection) {
      setSortingType(ESortingType.Selection);
    } else {
      setSortingType(ESortingType.Bubble);
    }
  };

  const handleSortButtonClick = (SortingDirection: Direction) => {
    sortElements(SortingDirection);
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
              value={ESortingType.Selection}
              checked={SortingType === ESortingType.Selection ? true : false}
              disabled={isLoader}
              onChange={handleRadioInputChange}
            />
            <RadioInput
              label="Пузырёк"
              value={ESortingType.Bubble}
              checked={SortingType === ESortingType.Bubble ? true : false}
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
                SortingDirection === Direction.Ascending && isLoader ? true : false
              }
              disabled={
                (SortingDirection === Direction.Ascending && isLoader) || !isLoader
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
                SortingDirection === Direction.Descending && isLoader
                  ? true
                  : false
              }
              disabled={
                (SortingDirection === Direction.Descending && isLoader) ||
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
