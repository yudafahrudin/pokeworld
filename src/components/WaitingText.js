import React from "react";
import { css, cx } from '@emotion/css'

import colors from '../styles/colors'
const defaultStyle = css`font-size:14px;padding:5px;color:${colors.gray}`

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