import React from "react";
import Renderer from "react-test-renderer";
import Modal from "./Modal";

test("Modal property as expected", () => {
    const componentRendered = Renderer.create(
        <Modal>
            <p>Modal Me</p>
        </Modal>
    );
    const componentInstance = componentRendered.toJSON();
    expect(componentInstance.children[0].children[0]).toBe("Modal Me")
});

test("Modal onClick as expected", () => {
    const clickMock = jest.fn();

    const componentRendered = Renderer.create(
        <Modal onClick={clickMock}>
            Click Me
        </Modal>
    );
    const componentInstance = componentRendered.toJSON();
    componentInstance.props.onClick();
    expect(clickMock).toHaveBeenCalled();
});
