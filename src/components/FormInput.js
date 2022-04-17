import React from "react";
import { css, cx } from "@emotion/css";

function FormInput({
    name,
    style = css``,
    placeholder = "Please input text",
    onChange,
    value
}) {
    const defaultCss = css`
        border-radius:10px;
        border: 2px solid rgba(0, 0, 0, 0.6);
        background-image:none;
        background-color: #dadad3;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        padding: 10px;
        &:focus {
            outline: none;
        }`

    return (
        <input
            type="text"
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            className={cx(defaultCss, style)}
            value={value}
        />

    )
}

export default FormInput;