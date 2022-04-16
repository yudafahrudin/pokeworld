import React from "react";
import { css, cx } from '@emotion/css'

import { WaitingText, PokemonCardList } from '../components'

import { localStorage } from '../helpers'

import { POCKET_CAPACITY } from '../constants/general'

const container = css`
    margin: 20px 0;
`
const textCapacity = css`
    font-weight:bold;
    font-size:15px;
`

function Mypokemon() {
    const [getMyPokemons] = localStorage("mypokemon");

    const countCapacity = () => {
        const earlyWarning = (POCKET_CAPACITY - 2);
        return `color:${earlyWarning <= getMyPokemons().length ? "red" : "green"}}`
    }

    return (
        <div
            className={container}
        >
            <p
                className={
                    cx(
                        textCapacity,
                        css`${countCapacity()}`
                    )
                }
            >
                pocket capacity : {getMyPokemons().length} / {POCKET_CAPACITY}
            </p>
            <ul>
                {
                    getMyPokemons().length ? (
                        getMyPokemons().map((pokemon, index) => {
                            return (
                                <PokemonCardList
                                    pokemon={pokemon}
                                    showOwnedPokemon={false}
                                    key={index + `pokemon-list`}
                                />
                            )
                        }
                        )
                    ) : <WaitingText />
                }
            </ul>
        </div >
    )
}

export default Mypokemon;