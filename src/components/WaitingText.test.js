import React from "react";
import Renderer from "react-test-renderer";
import WaitingText from "./WaitingText";

test("WaitingText rendered with please wait text", () => {
    const componentRendered = Renderer.create(
        <WaitingText />
    );
    const componentInstance = componentRendered.toJSON();
    expect(componentInstance.children[0]).toBe("Please wait...");
});
