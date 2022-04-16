import React from "react";
import { css, cx } from "@emotion/css";

function Button({ children, fullWidth, disabled, style = css``, bgColor, onClick }) {

  const defaultCss = css`
    ${style}
    width: ${fullWidth && "100%"};
    max-height: 50px;
    padding:10px;
    border: none;
    border-radius: 5px;
    background:#339DE8;
    color: #ffffff;
    font-weight:bold;
    font-size:.85rem;
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

  const enumColor = () => {
    switch (bgColor) {
      case "primary":
        return { bgColor: "#339DE8", fontColor: "white" };
      case "default":
        return { bgColor: "#F5F5F5", fontColor: "black" };
      case "warning":
        return { bgColor: "#E3C446", fontColor: "black" };
      default:
        return { bgColor: "#ffffff", fontColor: "black" };
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={Boolean(disabled)}
      className={
        cx(
          defaultCss,
          style,
          css`background-color:${enumColor().bgColor}; color: ${enumColor().fontColor}`
        )
      }
    >
      {children}
    </button>
  )
}

export default Button;