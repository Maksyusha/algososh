import { ChangeEvent, useState, FC } from "react";
import styles from "./string.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { ElementStates } from "../../types/element-states";
import { Circle } from "../ui/circle/circle";
import { sleep } from "../../utils/sleep";
import { DELAY_IN_MS } from "../../constants/delays";
import { reverseString } from "./string.utils";
import { TStringElement } from "./string.utils";

export const StringComponent: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [stringElements, setStringElements] = useState<TStringElement[]>([]);
  const [isLoader, setIsLoader] = useState(false);

  const reverseStringWithDelay = async () => {
    setIsLoader(true);

    const elementsArr: TStringElement[] = inputValue
      .split("")
      .map((letter) => ({ value: letter, state: ElementStates.Default }));

    const gen = reverseString(elementsArr);
    let next = gen.next();

    while (!next.done) {
      setStringElements(next.value.slice());
      await sleep(DELAY_IN_MS);
      next = gen.next();
    }

    setIsLoader(false);
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.currentTarget.value);
  };

  const handleButtonClick = () => {
    reverseStringWithDelay();
  };

  return (
    <SolutionLayout title="Строка">
      <section>
        <div className={styles["input-container"]}>
          <Input
            isLimitText={true}
            maxLength={11}
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button
            data-testid="buttonReverse"
            type="button"
            text="Развернуть"
            isLoader={isLoader}
            disabled={inputValue === ""}
            onClick={handleButtonClick}
          />
        </div>
        <ul className={styles["circles-list"]}>
          {stringElements.map((element, index) => {
            return (
              <li key={index}>
                <Circle state={element.state} letter={element.value} />
              </li>
            );
          })}
        </ul>
      </section>
    </SolutionLayout>
  );
};
