import React from "react";
import { css, cx } from "@emotion/css";

import colors from '../styles/colors';

function Button({ children, fullWidth, disabled, style = css``, bgColor, onClick }) {

  const defaultCss = css`
    ${style}
    width: ${fullWidth && "100%"};
    max-height: 50px;
    padding:10px;
    border: none;
    border-radius: 5px;
    font-weight:bold;
    font-size:.85rem;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    :disabled {
    background-color: ${colors.grayDisable};
    color: ${colors.grayDisableText};
    }
      :active {
        transform: translateY(2px);
      }
    `

  const enumColor = () => {
    switch (bgColor) {
      case "primary":
        return { bgColor: colors.primary, fontColor: colors.white };
      case "default":
        return { bgColor: colors.white2, fontColor: colors.black };
      case "warning":
        return { bgColor: colors.warning, fontColor: colors.black };
      case "danger":
        return { bgColor: colors.danger, fontColor: colors.white };
      default:
        return { bgColor: colors.white, fontColor: colors.black };
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