import React from "react";
import { css } from '@emotion/css'

function Footer() {
    return (
        <div className={
            css`
            width:100%;
            height:7vh;
            background-color: #ffffff;
            text-align:center;
            display:flex;
            `
        }>
            <p className={
                css`
                margin:auto
                `
            }>
                Footer
            </p>
        </div>
    )
}

export default Footer;