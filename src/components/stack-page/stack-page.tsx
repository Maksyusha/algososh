import { ChangeEvent, FC, useState } from "react";
import styles from "./stack-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Stack } from "./stack-page.utils";
import { ElementStates } from "../../types/element-states";
import { sleep } from "../../utils/sleep";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

type TStackElements = {
  value: string;
  state: ElementStates;
};

export const StackPage: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [stackElements, setStackElements] = useState<TStackElements[]>([]);
  const [stack] = useState(new Stack<TStackElements>())

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.currentTarget.value);
  };

  const handleAddButtonClick = async () => {
    stack.push({ value: inputValue, state: ElementStates.Changing });
    const items = stack.getItems()
    setStackElements([...items]);
    setInputValue("");
    await sleep(SHORT_DELAY_IN_MS)
    items[items.length - 1].state = ElementStates.Default
    setStackElements(stack.getItems())
  };

  const handleDeleteButtonClick = async () => {
    const items = stack.getItems()
    items[items.length - 1].state = ElementStates.Changing
    setStackElements([...items]);
    await sleep(SHORT_DELAY_IN_MS)
    stack.pop();
    setStackElements(stack.getItems())
  };

  const handleClearButtonClick = () => {
    stack.clear()
    setStackElements(stack.getItems())
  }

  return (
    <SolutionLayout title="Стек">
      <section>
        <div className={styles["ui-container"]}>
          <Input
            isLimitText={true}
            maxLength={4}
            value={inputValue}
            onChange={handleInputChange}
          />
          <div className={styles["buttons-container"]}>
            <Button
              text="Добавить"
              disabled={!inputValue}
              onClick={handleAddButtonClick}
            />
            <Button
              text="Удалить"
              disabled={!stackElements.length}
              onClick={handleDeleteButtonClick}
            />
          </div>
          <Button text="Очистить" disabled={!stackElements.length} onClick={handleClearButtonClick}/>
        </div>
        <ul className={styles["circles-list"]}>
          {stackElements.map((element, index) => {
            return (
              <li key={index}>
                <Circle
                  letter={element.value}
                  state={element.state}
                  head={stackElements.length - 1 === index ? "top" : null}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </SolutionLayout>
  );
};
