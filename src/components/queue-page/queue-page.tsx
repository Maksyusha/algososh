import { ChangeEvent, FC, useState } from "react";
import styles from "./queue-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { Queue } from "./queue-page.utils";
import { sleep } from "../../utils/sleep";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

type TQueueElement = {
  value: string;
  state: ElementStates;
};

const getEmptyQueueElements = (size: number) => {
  return Array.from(
    { length: size },
    (): TQueueElement => ({
      value: "",
      state: ElementStates.Default,
    })
  );
};

export const QueuePage: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [queueElements, setQueueElements] = useState<TQueueElement[]>(
    getEmptyQueueElements(7)
  );
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);
  const [queue] = useState(new Queue<TQueueElement>(7));

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.currentTarget.value);
  };

  const handleAddButtonClick = async () => {
    if (areButtonsDisabled) {
      return;
    }

    if (queue.getTail() === 7) {
      return;
    }

    setAreButtonsDisabled(true);
    setInputValue("");

    queueElements[queue.getTail()] = {
      value: "",
      state: ElementStates.Changing,
    };
    setQueueElements([...queueElements]);
    await sleep(SHORT_DELAY_IN_MS);

    queue.enqueue({ value: inputValue, state: ElementStates.Default });

    queueElements[queue.getTail() - 1] = {
      value: inputValue,
      state: ElementStates.Changing,
    };
    setQueueElements([...queueElements]);
    await sleep(SHORT_DELAY_IN_MS);

    queueElements[queue.getTail() - 1] = {
      value: inputValue,
      state: ElementStates.Default,
    };
    setQueueElements([...queueElements]);

    setAreButtonsDisabled(false);
  };

  const handleDeleteButtonClick = async () => {
    if (areButtonsDisabled) {
      return;
    }

    setAreButtonsDisabled(true);

    queueElements[queue.getHead()] = {
      value: queueElements[queue.getHead()].value,
      state: ElementStates.Changing,
    };
    setQueueElements([...queueElements]);
    await sleep(SHORT_DELAY_IN_MS);

    queue.dequeue();

    queueElements[queue.getHead() - 1] = {
      value: "",
      state: ElementStates.Default,
    };
    setQueueElements([...queueElements]);

    setAreButtonsDisabled(false);
  };

  const handleClearButtonClick = () => {
    if (areButtonsDisabled) {
      return;
    }

    setAreButtonsDisabled(true);

    queue.clear();
    setQueueElements(getEmptyQueueElements(7));

    setAreButtonsDisabled(false);
  };

  return (
    <SolutionLayout title="Очередь">
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
              disabled={queue.isEmpty()}
              onClick={handleDeleteButtonClick}
            />
          </div>
          <Button
            text="Очистить"
            disabled={!queueElements.length}
            onClick={handleClearButtonClick}
          />
        </div>
        <ul className={styles["circles-list"]}>
          {queueElements &&
            queueElements.map((element, index) => {
              return (
                <li key={index}>
                  <Circle
                    letter={element === null ? "" : element.value}
                    state={
                      element === null ? ElementStates.Default : element.state
                    }
                    head={
                      (queue.getHead() === index && !queue.isEmpty()) ||
                      (queue.getHead() === 7 && index === 6) ||
                      (queue.getHead() === index && index !== 0)
                        ? "head"
                        : null
                    }
                    tail={
                      queue.getTail() - 1 === index && !queue.isEmpty()
                        ? "tail"
                        : null
                    }
                  />
                </li>
              );
            })}
        </ul>
      </section>
    </SolutionLayout>
  );
};
