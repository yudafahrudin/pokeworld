import React from "react";
import { css } from '@emotion/css'

import { md } from '../styles/breakpoints'

function Header() {
    return (
        <div className={
            css`
            width:100%;
            max-height:15vh;
            background-color: #ffffff;
            `
        }
        >
            <div className={
                css`
                width:60vw;
                margin-left:auto;
                margin-right:auto;
                @media (max-width: ${md}) {
                    width: 80vw;
                }
                `
            }>

                <nav role="navigation"
                    className={
                        css`
                    display:flex;
                    padding:10px 0 10px 0;
                    `
                    }>
                    <a href="/" className={
                        css`
                        text-decoration: none;
                        color:#E34646;
                        `
                    }>
                        <h1>Pokéworld</h1>
                    </a>
                    <ul className={
                        css`
                    display:inline-flex;
                    list-style: none;
                    margin-left:auto;
                    `
                    }>
                        <li
                            className={css`
                            text-align: center;
                            margin: 0 2px;
                            overflow: hidden;
                        `}
                        >
                            <a href="/my-pokemon"
                                className={
                                    css`
                                display: block;
                                text-decoration: none;
                                font-weight: bold;
                                display: -webkit-box;
                                display: -ms-flexbox;
                                display: flex;
                                -webkit-box-align: center;
                                -ms-flex-align: center;
                                align-items: center;
                                -webkit-box-pack: center;
                                -ms-flex-pack: center;
                                justify-content: center;
                                height: 100%;
                                color:#03a9f4;
                                `
                                }>
                                My Pokemon
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Header;