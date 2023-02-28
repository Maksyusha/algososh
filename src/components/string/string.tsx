import { ChangeEvent, useState, FC } from "react";
import styles from "./string.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { ElementStates } from "../../types/element-states";
import { Circle } from "../ui/circle/circle";
import { swap } from "../../utils/swap";
import { sleep } from "../../utils/sleep";
import { DELAY_IN_MS } from "../../constants/delays";

type TStringElement = {
  value: string;
  state: ElementStates;
};

export const StringComponent: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [stringElements, setStringElements] = useState<TStringElement[]>([]);
  const [isLoader, setIsLoader] = useState(false);

  const reverseString = async (
    arr: TStringElement[]
  ) => {
    setIsLoader(true);
  
    let start = 0;
    let end = arr.length - 1;
  
    while (start <= end) {
      arr[start].state = ElementStates.Changing;
      arr[end].state = ElementStates.Changing;
  
      setStringElements([...arr]);
  
      await sleep(DELAY_IN_MS);
  
      arr[start].state = ElementStates.Modified;
      arr[end].state = ElementStates.Modified;
  
      swap(arr, start, end);
  
      setStringElements([...arr]);
  
      start++;
      end--;
    }
  
    setIsLoader(false);
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.currentTarget.value);
  };

  const handleButtonClick = () => {
    const elements: TStringElement[] = inputValue.split("").map((value) => {
      return {
        value,
        state: ElementStates.Default,
      };
    });
    reverseString(elements);
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
