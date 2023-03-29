import { ChangeEvent, FC, useState } from "react";
import styles from "./queue-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { getEmptyQueueElements, Queue } from "./queue-page.utils";
import { sleep } from "../../utils/sleep";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { HEAD, TAIL } from "../../constants/element-captions";
import {
  QUEUE_LENGTH,
  MAX_INPUT_VALUE_LENGTH,
} from "../../constants/data-structures";

type TQueueElement = {
  value: string;
  state: ElementStates;
};

export const QueuePage: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [queueElements, setQueueElements] = useState<TQueueElement[]>(
    getEmptyQueueElements<TQueueElement>(QUEUE_LENGTH, {
      value: "",
      state: ElementStates.Default,
    })
  );
  const [queueStates, setQueueState] = useState({
    isAdding: false,
    isDeleting: false,
  });
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);
  const [queue] = useState(new Queue<TQueueElement>(QUEUE_LENGTH));

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.currentTarget.value);
  };

  const handleAddButtonClick = async () => {
    if (areButtonsDisabled) {
      return;
    }

    if (queue.getTail() === QUEUE_LENGTH) {
      return;
    }

    setQueueState({ ...queueStates, isAdding: true });
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

    setQueueState({ ...queueStates, isAdding: false });
    setAreButtonsDisabled(false);
  };

  const handleDeleteButtonClick = async () => {
    if (areButtonsDisabled) {
      return;
    }

    setQueueState({ ...queueStates, isDeleting: true });
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

    setQueueState({ ...queueStates, isDeleting: false });
    setAreButtonsDisabled(false);
  };

  const handleClearButtonClick = () => {
    if (areButtonsDisabled) {
      return;
    }

    setAreButtonsDisabled(true);

    queue.clear();
    setQueueElements(
      getEmptyQueueElements<TQueueElement>(QUEUE_LENGTH, {
        value: "",
        state: ElementStates.Default,
      })
    );

    setAreButtonsDisabled(false);
  };

  return (
    <SolutionLayout title="Очередь">
      <section>
        <div className={styles["ui-container"]}>
          <Input
            isLimitText={true}
            maxLength={MAX_INPUT_VALUE_LENGTH}
            value={inputValue}
            disabled={queueStates.isAdding || queueStates.isDeleting}
            onChange={handleInputChange}
          />
          <div className={styles["buttons-container"]}>
            <Button
              data-testid="buttonAdd"
              text="Добавить"
              isLoader={queueStates.isAdding}
              disabled={!inputValue || queueStates.isDeleting}
              onClick={handleAddButtonClick}
            />
            <Button
              data-testid="buttonDelete"
              text="Удалить"
              isLoader={queueStates.isDeleting}
              disabled={queue.isEmpty() || queueStates.isAdding}
              onClick={handleDeleteButtonClick}
            />
          </div>
          <Button
            data-testid="buttonClear"
            text="Очистить"
            disabled={
              (queue.getHead() === 0 && queue.isEmpty()) ||
              queueStates.isAdding ||
              queueStates.isDeleting
            }
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
                      (queue.getHead() === QUEUE_LENGTH &&
                        index === QUEUE_LENGTH - 1) ||
                      (queue.getHead() === index && index !== 0)
                        ? HEAD
                        : null
                    }
                    tail={
                      queue.getTail() - 1 === index && !queue.isEmpty()
                        ? TAIL
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
