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
    isPrepending: false,
    isAppending: false,
    isAddingByIndex: false,
    isDeletingHead: false,
    isDeletingTail: false,
    isDeletingByIndex: false,
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

  const handlePrependButton = async () => {
    setIsUiDisabled(true);
    setListStates({ ...listStates, isPrepending: true });
    await sleep(DELAY_IN_MS);

    const element = getElement(inputValues.string);

    setListStates({ ...listStates, isPrepending: false });
    list.prepend(inputValues.string);

    setListElements([
      { ...element, state: ElementStates.Modified },
      ...listElements,
    ]);
    await sleep(DELAY_IN_MS);

    setListElements(list.getArray());

    setInputValues({ ...inputValues, string: "" });
    setIsUiDisabled(false);
  };

  const handleAppendButton = async () => {
    setIsUiDisabled(true);
    setListStates({ ...listStates, isAppending: true });

    await sleep(DELAY_IN_MS);

    const element = getElement(inputValues.string);

    setListStates({ ...listStates, isAppending: false });
    list.append(inputValues.string);

    setListElements([
      ...listElements,
      { ...element, state: ElementStates.Modified },
    ]);
    await sleep(DELAY_IN_MS);

    setListElements(list.getArray());

    setInputValues({ ...inputValues, string: "" });
    setIsUiDisabled(false);
  };

  const handleDeleteHeadButton = async () => {
    setListStates({ ...listStates, isDeletingHead: true });
    setIsUiDisabled(true);

    setRemovingValue(listElements[0].value);
    listElements[0].value = "";
    await sleep(DELAY_IN_MS);

    list.deleteHead();
    setListElements(list.getArray());

    setListStates({ ...listStates, isDeletingHead: false });

    setIsUiDisabled(false);
  };

  const handleDeleteTailButton = async () => {
    setListStates({ ...listStates, isDeletingTail: true });
    setIsUiDisabled(true);

    setRemovingValue(listElements[listElements.length - 1].value);
    listElements[listElements.length - 1].value = "";
    await sleep(DELAY_IN_MS);

    list.deleteTail();
    setListElements(list.getArray());

    setListStates({ ...listStates, isDeletingTail: false });

    setIsUiDisabled(false);
  };

  const handleAddByIndexButton = async () => {
    setListStates({ ...listStates, isAddingByIndex: true });
    setIsUiDisabled(true);

    const index = +inputValues.index;
    const changingArr = list.getArray();

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

    list.addByIndex(inputValues.string, index);
    setChangingIndex(null);

    changingArr.splice(index, 0, {
      value: inputValues.string,
      state: ElementStates.Modified,
    });
    setListElements([...changingArr]);
    await sleep(DELAY_IN_MS);

    setListElements(list.getArray());

    setListStates({ ...listStates, isAddingByIndex: false });
    setInputValues({ string: "", index: "" });
    setIsUiDisabled(false);
  };

  const handleDeleteByIndexButton = async () => {
    setListStates({ ...listStates, isDeletingByIndex: true });
    setIsUiDisabled(true);

    const index = +inputValues.index;
    const changingArr = list.getArray();

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
    list.deleteByIndex(index);
    setListElements(list.getArray());

    setListStates({ ...listStates, isDeletingByIndex: false });
    setInputValues({ ...inputValues, index: "" });
    setIsUiDisabled(false);
  };

  const getCircleHead = (index: number) => {
    if (listStates.isPrepending && index === 0) {
      return (
        <Circle
          isSmall={true}
          letter={inputValues.string}
          state={ElementStates.Changing}
        />
      );
    }
    if (listStates.isAppending && index === list.getSize() - 1) {
      return (
        <Circle
          isSmall={true}
          letter={inputValues.string}
          state={ElementStates.Changing}
        />
      );
    }
    if (listStates.isDeletingHead && index === 0) {
      return (
        <Circle
          isSmall={true}
          letter={removingValue}
          state={ElementStates.Changing}
        />
      );
    }
    if (listStates.isDeletingTail && index === list.getSize() - 1) {
      return (
        <Circle
          isSmall={true}
          letter={removingValue}
          state={ElementStates.Changing}
        />
      );
    }
    if (listStates.isAddingByIndex && index === changingIndex) {
      console.log('1')
      return (
        <Circle
          isSmall={true}
          letter={inputValues.string}
          state={ElementStates.Changing}
        />
      );
    }
    if (listStates.isDeletingByIndex && index === changingIndex) {
      return (
        <Circle
          isSmall={true}
          letter={removingValue}
          state={ElementStates.Changing}
        />
      );
    }
    if (!listStates.isPrepending && index === 0) {
      return "head";
    }
    return null;
  };

  useEffect(() => {
    const elements = Array.from({ length: getRandomInteger(2, 6) }, () =>
      String(getRandomInteger(0, 100))
    );

    for (let element of elements) {
      list.append(element);
    }

    setListElements(list.getArray());
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
                onClick={handlePrependButton}
                isLoader={listStates.isPrepending}
                disabled={
                  !inputValues.string ||
                  (!listStates.isPrepending && isUiDisabled) ||
                  listElements.length > 5
                }
              />
              <Button
                linkedList="small"
                text="Добавить в tail"
                onClick={handleAppendButton}
                isLoader={listStates.isAppending}
                disabled={
                  !inputValues.string ||
                  (!listStates.isAppending && isUiDisabled) ||
                  listElements.length > 5
                }
              />
              <Button
                linkedList="small"
                text="Удалить из head"
                onClick={handleDeleteHeadButton}
                isLoader={listStates.isDeletingHead}
                disabled={
                  (!listStates.isDeletingHead && isUiDisabled) ||
                  !listElements.length
                }
              />
              <Button
                linkedList="small"
                text="Удалить из tail"
                onClick={handleDeleteTailButton}
                isLoader={listStates.isDeletingTail}
                disabled={
                  (!listStates.isDeletingTail && isUiDisabled) ||
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
                onClick={handleAddByIndexButton}
                isLoader={listStates.isAddingByIndex}
                disabled={
                  !inputValues.string ||
                  !inputValues.index ||
                  (!listStates.isAddingByIndex && isUiDisabled) ||
                  listElements.length > 5
                }
              />
              <Button
                linkedList="big"
                text="Удалить по индексу"
                onClick={handleDeleteByIndexButton}
                isLoader={listStates.isDeletingByIndex}
                disabled={
                  !inputValues.index ||
                  (!listStates.isDeletingByIndex && isUiDisabled) ||
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
