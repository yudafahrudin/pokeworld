import React from "react";
import Renderer from "react-test-renderer";
import FormInput from "./FormInput";

test("FormInput property as expected", () => {
    const componentRendered = Renderer.create(
        <FormInput type="text" name="pokemon" value="bulbasaur" />
    );
    const componentInstance = componentRendered.toJSON();
    expect(componentInstance.props).toHaveProperty("type", "text");
    expect(componentInstance.props).toHaveProperty("name", "pokemon");
    expect(componentInstance.props).toHaveProperty("value", "bulbasaur");
});

test("FormInput onChange function works as expected", () => {
    const clickMock = jest.fn();

    const componentRendered = Renderer.create(
        <FormInput onChange={clickMock} />
    );
    const componentInstance = componentRendered.toJSON();
    componentInstance.props.onChange();
    expect(clickMock).toHaveBeenCalled();
});
