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
import { MAX_INPUT_VALUE_LENGTH } from "../../constants/data-structures";

type TStackElements = {
  value: string;
  state: ElementStates;
};

export const StackPage: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [stackElements, setStackElements] = useState<TStackElements[]>([]);
  const [stack] = useState(new Stack<TStackElements>());
  const [stackStates, setStackStates] = useState({
    isAdding: false,
    isDeleting: false,
  });

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.currentTarget.value);
  };

  const handleAddButtonClick = async () => {
    setStackStates({ ...stackStates, isAdding: true });

    stack.push({ value: inputValue, state: ElementStates.Changing });
    const items = stack.getItems();
    setStackElements([...items]);
    setInputValue("");
    await sleep(SHORT_DELAY_IN_MS);
    items[items.length - 1].state = ElementStates.Default;
    setStackElements(stack.getItems());

    setStackStates({ ...stackStates, isAdding: false });
  };

  const handleDeleteButtonClick = async () => {
    setStackStates({ ...stackStates, isDeleting: true });

    const items = stack.getItems();
    items[items.length - 1].state = ElementStates.Changing;
    setStackElements([...items]);
    await sleep(SHORT_DELAY_IN_MS);
    stack.pop();
    setStackElements(stack.getItems());

    setStackStates({ ...stackStates, isDeleting: false });
  };

  const handleClearButtonClick = () => {
    stack.clear();
    setStackElements(stack.getItems());
  };

  return (
    <SolutionLayout title="Стек">
      <section>
        <div className={styles["ui-container"]}>
          <Input
            isLimitText={true}
            maxLength={MAX_INPUT_VALUE_LENGTH}
            value={inputValue}
            disabled={stackStates.isAdding || stackStates.isDeleting}
            onChange={handleInputChange}
          />
          <div className={styles["buttons-container"]}>
            <Button
              text="Добавить"
              isLoader={stackStates.isAdding}
              disabled={
                !inputValue ||
                (!inputValue && !stackElements.length) ||
                stackStates.isDeleting
              }
              onClick={handleAddButtonClick}
            />
            <Button
              text="Удалить"
              isLoader={stackStates.isDeleting}
              disabled={!stackElements.length || stackStates.isAdding}
              onClick={handleDeleteButtonClick}
            />
          </div>
          <Button
            text="Очистить"
            disabled={!stackElements.length || stackStates.isAdding || stackStates.isDeleting}
            onClick={handleClearButtonClick}
          />
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
