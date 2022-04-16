import React from "react";
import { css, cx } from '@emotion/css'

const defaultStyle = css`font-size:14px;padding:5px;color:#dadad3`

function WaitingText({ style }) {
    return (
        <>
            <p className={
                cx(defaultStyle, style)
            }>
                Please wait...
            </p>

        </>
    )
}

export default WaitingText;