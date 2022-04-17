import React, { useState } from "react";
import { css, cx } from '@emotion/css'

import { PokemonCardList, Button, Modal } from '../components'

import { localStorage } from '../helpers'

import { POCKET_CAPACITY } from '../constants/general'

const container = css`
    margin: 20px 0;
`
const textCapacity = css`
    font-weight:bold;
    font-size:15px;
`
const modalContainer = css`
    width:80vw;
    max-height:50vh;
    max-width:90vw;
    display:block;
    padding:10px;
    margin:auto;
    border-radius:10px;
    background:#ffffff;
    text-align:center;
`

function Mypokemon() {
    const [getMyPokemons, setMyPokemons] = localStorage("mypokemon");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idPokemon, setIdPokemon] = useState(0);

    const countCapacity = () => {
        const earlyWarning = (POCKET_CAPACITY - 2);
        return `color:${earlyWarning <= getMyPokemons().length ? "red" : "green"}}`
    }

    const handleOpenModal = (id) => {
        setIsModalOpen(true)
        setIdPokemon(id)
    }

    const handleReleasePokemon = () => {
        if (idPokemon) {
            const notReleasedPokemon = getMyPokemons().filter(
                pokemon => (pokemon.nickname || pokemon.name) !== idPokemon
            );
            setMyPokemons(notReleasedPokemon);
            setIsModalOpen(false)
            setIdPokemon(0);
        }
    }

    const ModalConfirm = () => (
        <Modal
            isOpen={isModalOpen}
        >
            <div className={modalContainer}>
                <h3>
                    CONFIRMATION
                </h3>
                <div className={css`margin-bottom:10px`}>
                    <Button
                        bgColor="warning"
                        onClick={() => handleReleasePokemon()}
                    >
                        Release Pokemon
                    </Button>
                    <Button
                        bgColor="default"
                        style={css`
                        margin-left:10px
                        `}
                        onClick={() => setIsModalOpen(false)}
                    >
                        cancel
                    </Button>
                </div>
            </div>
        </Modal>
    )

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
                        getMyPokemons().reverse().map((pokemon, index) => {
                            return (
                                <div key={index}>
                                    <PokemonCardList
                                        pokemon={pokemon}
                                        bgColor="default"
                                        showOwnedPokemon={false}
                                    />
                                    <div
                                        className={css`
                                        margin-bottom:30px;
                                        `}
                                    >
                                        <Button
                                            onClick={() => handleOpenModal(pokemon.nickname || pokemon.name)}
                                            bgColor="warning"
                                        >
                                            Release {pokemon.nickname || pokemon.name}
                                        </Button>
                                        <Button
                                            bgColor="default"
                                            style={css`margin-left:20px`}
                                        >
                                            Rename pokemon
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                        )
                    ) : <p className={css`
                        text-align:center;
                        font-size:14px;
                        color:#dadad3;
                    `}>
                        You don't have pokemon. <br />go to catch
                        <a className={css`text-decoration:none;color:#03a9f4;`} href="/"> pokemon</a>
                    </p>
                }
            </ul>
            <ModalConfirm />
        </div >
    )
}

export default Mypokemon;