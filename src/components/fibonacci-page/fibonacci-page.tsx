import { ChangeEvent, useState, FC } from "react";
import styles from "./fibonacci-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { sleep } from "../../utils/sleep";
import { getFibonacciNumbers } from "./fibonacci-page.utils";

export const FibonacciPage: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [fibonacciNumbers, setFibonacciNumbers] = useState<number[]>([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const setFibonacciNumbersWithSleep = async (number: number) => {
    setIsLoader(true);

    const numbers = getFibonacciNumbers(number);

    for (let i = 0; i <= numbers.length; i++) {
      setFibonacciNumbers(numbers.slice(0, i));
      await sleep(SHORT_DELAY_IN_MS);
    }

    setIsLoader(false);
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.currentTarget.value;

    if (+value >= 1 && +value <= 19) {
      setInputValue(value);
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const handleButtonClick = () => {
    setFibonacciNumbersWithSleep(+inputValue);
  };

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <section>
        <div className={styles["input-container"]}>
          <Input
            placeholder="Введите число"
            type={"number"}
            isLimitText={true}
            min={"1"}
            max={"19"}
            onChange={handleInputChange}
          />
          <Button
            text="Рассчитать"
            isLoader={isLoader}
            disabled={isDisabled}
            onClick={handleButtonClick}
          />
        </div>
        <ul className={styles["circles-list"]}>
          {fibonacciNumbers.map((number, index) => {
            return (
              <li key={index}>
                <Circle state={ElementStates.Default} letter={String(number)} />
                <p className={styles["fibonacci-index"]}>{index}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </SolutionLayout>
  );
};
