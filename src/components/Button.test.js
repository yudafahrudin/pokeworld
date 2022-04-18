import React from "react";
import Renderer from "react-test-renderer";
import Button from "./Button";

test("Button rendered with disabled", () => {
    const componentRendered = Renderer.create(
        <Button disabled={true}>
            Click me
        </Button>
    );
    const componentInstance = componentRendered.toJSON();
    expect(componentInstance.props).toHaveProperty("disabled", true);
});


test("Button onClick function works as expected", () => {
    const clickMock = jest.fn();

    const componentRendered = Renderer.create(
        <Button onClick={clickMock}>
            Click Me
        </Button>
    );
    const componentInstance = componentRendered.toJSON();
    componentInstance.props.onClick();
    expect(clickMock).toHaveBeenCalled();
});
