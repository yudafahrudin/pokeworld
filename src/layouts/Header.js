import React from "react";
import { css } from '@emotion/css'

import { md } from '../styles/breakpoints'
import colors from '../styles/colors'

const container = css`
    width:100%;
    max-height:15vh;
    margin-bottom:25px;
    background: rgb(6,121,177);
    background: linear-gradient(90deg, rgba(6,121,177,1) 0%, rgba(0,148,179,1) 100%);`

const wrapper = css`
    width:60vw;
    margin-left:auto;
    margin-right:auto;
    @media (max-width: ${md}) {
        width: 80vw;
    }`

const nav = css`
    display:flex;
    padding:10px 0 10px 0;`

const logo = css`
    text-decoration: none;
    color: ${colors.white};`

const menu = css`
    display:inline-flex;
    list-style: none;
    margin-left:auto;`

const menuItem = css`
    text-align: center;
    margin: 0 2px;
    overflow: hidden;
    a {
        display: block;
        text-decoration: none;
        font-weight: bold;
        padding:5px;
        border-radius:5px;
        border:1px solid ${colors.white2};
        color:${colors.white};
    }`

function Header() {
    return (
        <div className={container}>
            <div className={wrapper}>
                <nav role="navigation"
                    className={nav}>
                    <a href="/" className={logo}>
                        <h1>Pokéworld</h1>
                    </a>
                    <ul className={menu}>
                        <li className={menuItem}>
                            <a href="/my-pokemon">
                                My Pokemon
                            </a>
                        </li>
                        <li className={menuItem}>
                            <a href="/hcaptcha">
                                Hcaptcha
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Header;