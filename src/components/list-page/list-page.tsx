import { FC, useState, ChangeEvent, useEffect } from "react";
import styles from "./list-page.module.css";
import { LinkedList } from "./list-page.utils";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { getRandomInteger } from "../sorting-page/sorting-page.utils";
import { sleep } from "../../utils/sleep";
import { DELAY_IN_MS, SHORT_DELAY_IN_MS } from "../../constants/delays";

type TLinkedListItem = {
  value: string;
  state: ElementStates;
};

export const ListPage: FC = () => {
  const [inputValues, setInputValues] = useState({
    string: "",
    index: "",
  });
  const [listElements, setListElements] = useState<TLinkedListItem[]>([]);
  const [list] = useState(new LinkedList<string>());
  const [isUiDisabled, setIsUiDisabled] = useState(false);
  const [listStates, setListStates] = useState({
    isAppendingAtHead: false,
    isAppendingAtTail: false,
    isInsertingAt: false,
    isRemovingFromHead: false,
    isRemovingFromTail: false,
    isRemovingFrom: false,
  });
  const [removingValue, setRemovingValue] = useState("");
  const [changingIndex, setChangingIndex] = useState<number | null>();

  const getElement = (
    value: string,
    state?: ElementStates
  ): TLinkedListItem => {
    return {
      value,
      state:
        state === undefined ? ElementStates.Default : ElementStates.Modified,
    };
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget.name === "index") {
      if (
        +evt.currentTarget.value >= 0 &&
        +evt.currentTarget.value < list.getSize()
      ) {
        setInputValues({ ...inputValues, index: evt.currentTarget.value });
      }
    } else {
      setInputValues({ ...inputValues, string: evt.currentTarget.value });
    }
  };

  const handleAppendAtHeadButton = async () => {
    setIsUiDisabled(true);
    setListStates({ ...listStates, isAppendingAtHead: true });
    await sleep(DELAY_IN_MS);

    const element = getElement(inputValues.string);

    setListStates({ ...listStates, isAppendingAtHead: false });
    list.appendAtHead(inputValues.string);

    setListElements([
      { ...element, state: ElementStates.Modified },
      ...listElements,
    ]);
    await sleep(DELAY_IN_MS);

    setListElements(list.getArr());

    setInputValues({ ...inputValues, string: "" });
    setIsUiDisabled(false);
  };

  const handleAppendAtTailButton = async () => {
    setIsUiDisabled(true);
    setListStates({ ...listStates, isAppendingAtTail: true });

    await sleep(DELAY_IN_MS);

    const element = getElement(inputValues.string);

    setListStates({ ...listStates, isAppendingAtTail: false });
    list.appendAtTail(inputValues.string);

    setListElements([
      ...listElements,
      { ...element, state: ElementStates.Modified },
    ]);
    await sleep(DELAY_IN_MS);

    setListElements(list.getArr());

    setInputValues({ ...inputValues, string: "" });
    setIsUiDisabled(false);
  };

  const handleRemoveFromHeadButton = async () => {
    setListStates({ ...listStates, isRemovingFromHead: true });
    setIsUiDisabled(true);

    setRemovingValue(listElements[0].value);
    listElements[0].value = "";
    await sleep(DELAY_IN_MS);

    list.removeFromHead();
    setListElements(list.getArr());

    setListStates({ ...listStates, isRemovingFromHead: false });

    setIsUiDisabled(false);
  };

  const handleRemoveFromTailButton = async () => {
    setListStates({ ...listStates, isRemovingFromTail: true });
    setIsUiDisabled(true);

    setRemovingValue(listElements[listElements.length - 1].value);
    listElements[listElements.length - 1].value = "";
    await sleep(DELAY_IN_MS);

    list.removeFromTail();
    setListElements(list.getArr());

    setListStates({ ...listStates, isRemovingFromTail: false });

    setIsUiDisabled(false);
  };

  const handleInsertAtButton = async () => {
    setListStates({ ...listStates, isInsertingAt: true });
    setIsUiDisabled(true);

    const index = +inputValues.index;
    const changingArr = list.getArr();

    setChangingIndex(0);
    await sleep(SHORT_DELAY_IN_MS);

    for (let i = 0; i < index; i++) {
      setChangingIndex(i + 1);

      changingArr[i] = {
        value: changingArr[i].value,
        state: ElementStates.Changing,
      };
      setListElements([...changingArr]);
      await sleep(DELAY_IN_MS);
    }

    list.insertAt(inputValues.string, index);
    setChangingIndex(null);

    changingArr.splice(index, 0, {
      value: inputValues.string,
      state: ElementStates.Modified,
    });
    setListElements([...changingArr]);
    await sleep(DELAY_IN_MS);

    setListElements(list.getArr());

    setListStates({ ...listStates, isInsertingAt: false });
    setInputValues({ string: "", index: "" });
    setIsUiDisabled(false);
  };

  const handleRemoveFromButton = async () => {
    setListStates({ ...listStates, isRemovingFrom: true });
    setIsUiDisabled(true);

    const index = +inputValues.index;
    const changingArr = list.getArr();

    for (let i = 0; i <= index; i++) {
      changingArr[i] = {
        ...changingArr[i],
        state: ElementStates.Changing,
      };
      setListElements([...changingArr]);
      await sleep(DELAY_IN_MS);
    }

    setRemovingValue(changingArr[index].value);
    setChangingIndex(index);
    changingArr[index] = { value: "", state: ElementStates.Default };
    setListElements([...changingArr]);
    await sleep(DELAY_IN_MS);

    setChangingIndex(null);
    list.removeFrom(index);
    setListElements(list.getArr());

    setListStates({ ...listStates, isRemovingFrom: false });
    setInputValues({ ...inputValues, index: "" });
    setIsUiDisabled(false);
  };

  const getCircleHead = (index: number) => {
    if (listStates.isAppendingAtHead && index === 0) {
      return (
        <Circle
          isSmall={true}
          letter={inputValues.string}
          state={ElementStates.Changing}
        />
      );
    }
    if (listStates.isAppendingAtTail && index === list.getSize() - 1) {
      return (
        <Circle
          isSmall={true}
          letter={inputValues.string}
          state={ElementStates.Changing}
        />
      );
    }
    if (listStates.isRemovingFromHead && index === 0) {
      return (
        <Circle
          isSmall={true}
          letter={removingValue}
          state={ElementStates.Changing}
        />
      );
    }
    if (listStates.isRemovingFromTail && index === list.getSize() - 1) {
      return (
        <Circle
          isSmall={true}
          letter={removingValue}
          state={ElementStates.Changing}
        />
      );
    }
    if (listStates.isInsertingAt && index === changingIndex) {
      console.log('1')
      return (
        <Circle
          isSmall={true}
          letter={inputValues.string}
          state={ElementStates.Changing}
        />
      );
    }
    if (listStates.isRemovingFrom && index === changingIndex) {
      return (
        <Circle
          isSmall={true}
          letter={removingValue}
          state={ElementStates.Changing}
        />
      );
    }
    if (!listStates.isAppendingAtHead && index === 0) {
      return "head";
    }
    return null;
  };

  useEffect(() => {
    const elements = Array.from({ length: 4 }, () =>
      String(getRandomInteger(0, 100))
    );

    for (let element of elements) {
      list.appendAtTail(element);
    }

    setListElements(list.getArr());
  }, [list]);

  return (
    <SolutionLayout title="Связный список">
      <section>
        <ul className={styles["ui-list"]}>
          <li className={styles["ui-list-item"]}>
            <Input
              name="string"
              placeholder="Введите значение"
              isLimitText={true}
              maxLength={4}
              value={inputValues.string}
              onChange={handleInputChange}
              disabled={isUiDisabled}
            />
            <div className={styles["buttons-container"]}>
              <Button
                linkedList="small"
                text="Добавить в head"
                onClick={handleAppendAtHeadButton}
                isLoader={listStates.isAppendingAtHead}
                disabled={
                  !inputValues.string ||
                  (!listStates.isAppendingAtHead && isUiDisabled) ||
                  listElements.length > 5
                }
              />
              <Button
                linkedList="small"
                text="Добавить в tail"
                onClick={handleAppendAtTailButton}
                isLoader={listStates.isAppendingAtTail}
                disabled={
                  !inputValues.string ||
                  (!listStates.isAppendingAtTail && isUiDisabled) ||
                  listElements.length > 5
                }
              />
              <Button
                linkedList="small"
                text="Удалить из head"
                onClick={handleRemoveFromHeadButton}
                isLoader={listStates.isRemovingFromHead}
                disabled={
                  (!listStates.isRemovingFromHead && isUiDisabled) ||
                  !listElements.length
                }
              />
              <Button
                linkedList="small"
                text="Удалить из tail"
                onClick={handleRemoveFromTailButton}
                isLoader={listStates.isRemovingFromTail}
                disabled={
                  (!listStates.isRemovingFromTail && isUiDisabled) ||
                  !listElements.length
                }
              />
            </div>
          </li>
          <li className={styles["ui-list-item"]}>
            <Input
              name="index"
              type="number"
              min={0}
              max={list.getSize() - 1}
              placeholder="Введите индекс"
              value={inputValues.index}
              onChange={handleInputChange}
              disabled={isUiDisabled}
            />
            <div className={styles["buttons-container"]}>
              <Button
                linkedList="big"
                text="Добавить по индексу"
                onClick={handleInsertAtButton}
                isLoader={listStates.isInsertingAt}
                disabled={
                  !inputValues.string ||
                  !inputValues.index ||
                  (!listStates.isInsertingAt && isUiDisabled) ||
                  listElements.length > 5
                }
              />
              <Button
                linkedList="big"
                text="Удалить по индексу"
                onClick={handleRemoveFromButton}
                isLoader={listStates.isRemovingFrom}
                disabled={
                  !inputValues.index ||
                  (!listStates.isRemovingFrom && isUiDisabled) ||
                  !listElements.length
                }
              />
            </div>
          </li>
        </ul>
        <ul className={styles["circles-list"]}>
          {listElements.map((element, index) => {
            return (
              <li className={styles["circle"]} key={index}>
                <Circle
                  letter={element.value}
                  state={element.state}
                  index={index}
                  head={getCircleHead(index)}
                  tail={index === list.getSize() - 1 ? "tail" : null}
                />
                {index !== list.getSize() - 1 ? (
                  <div className={styles["arrow"]}>
                    <ArrowIcon />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>
    </SolutionLayout>
  );
};
