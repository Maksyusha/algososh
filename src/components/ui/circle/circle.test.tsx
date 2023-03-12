import renderer from "react-test-renderer";
import { render, screen, fireEvent } from "@testing-library/react";
import { Circle } from "./circle";
import { ElementStates } from "../../../types/element-states";

describe("Circle component", () => {
  it("renders without letters", () => {
    const tree = renderer.create(<Circle></Circle>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders with letters", () => {
    const tree = renderer.create(<Circle letter="test"/>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders with string in head", () => {
    const tree = renderer.create(<Circle head="test"/>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders with react-element in head", () => {
    const tree = renderer.create(<Circle head={<Circle/>}/>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders with letters in tail", () => {
    const tree = renderer.create(<Circle tail='test'/>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders with react-element in tail", () => {
    const tree = renderer.create(<Circle tail={<Circle/>}></Circle>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders with index", () => {
    const tree = renderer.create(<Circle index={0}></Circle>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders with prop isSmall", () => {
    const tree = renderer.create(<Circle isSmall={true}></Circle>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders with default state", () => {
    const tree = renderer.create(<Circle state={ElementStates.Default}></Circle>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders with changing state", () => {
    const tree = renderer.create(<Circle state={ElementStates.Changing}></Circle>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders with modified state", () => {
    const tree = renderer.create(<Circle state={ElementStates.Modified}></Circle>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
