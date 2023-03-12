import renderer from "react-test-renderer";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("button component", () => {
  it("renders with text", () => {
    const tree = renderer.create(<Button text="test"></Button>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders without text", () => {
    const tree = renderer.create(<Button></Button>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders with disabled state", () => {
    const tree = renderer.create(<Button disabled></Button>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders with loading state", () => {
    const tree = renderer.create(<Button isLoader={true}></Button>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("callback", () => {
    const callback = jest.fn();
    render(<Button onClick={callback}></Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(callback).toHaveBeenCalled();
  });
});
