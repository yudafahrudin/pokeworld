import React from "react";
import { css, cx } from "@emotion/css";

function Button({ children, fullWidth, disabled, style = css``, onClick }) {
  const defaultCss = css`
    ${style}
    width: ${fullWidth && "100%"};
    max-height: 50px;
    padding:10px;
    border: none;
    border-radius: 10px;
    background:#339DE8;
    color: #ffffff;
    font-weight:bold;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    :disabled {
    background-color: #cccccc;
    color: #666666;
    }
      :active {
        transform: translateY(2px);
      }
    `
  return (
    <button
      onClick={onClick}
      disabled={Boolean(disabled)}
      className={cx(defaultCss, style)}
    >
      {children}
    </button>
  )
}

export default Button;