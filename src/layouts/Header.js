import React from "react";
import { css } from '@emotion/css'

import { md } from '../styles/breakpoints'
import colors from '../styles/colors'

const container = css`
    width:100%;
    max-height:15vh;`

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
    color: ${colors.title};`

const menu = css`
    display:inline-flex;
    list-style: none;
    margin-left:auto;`

const menuItem = css`
    text-align: center;
    margin: 0 2px;
    overflow: hidden;
    a {
        line-height:25px;
        display: block;
        text-decoration: none;
        font-weight: bold;
        height: 100%;
        color:${colors.primary};
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
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Header;