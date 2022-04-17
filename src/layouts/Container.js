import React from "react";
import { css, cx } from '@emotion/css'

import Header from './Header'

import { md } from '../styles/breakpoints'

const main = css`
    width:100%;
    display:flex;`

const body = css`
    width:60vw;
    margin-left:auto;
    margin-right:auto;
    @media (max-width: ${md}) {
        width: 80vw;
    }`

function Container({ children }) {
    return (
        <div className="container">
            <Header />
            <div className={cx(main)}>
                <div className={body}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Container;