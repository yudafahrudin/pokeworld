import React, { useState } from "react";
import { css, cx } from '@emotion/css'
import { useNavigate } from "react-router-dom";

import { PokemonCardList, Button, Modal } from '../components'

import { localStorage } from '../helpers'

import { POCKET_CAPACITY } from '../constants/general'

import { md } from '../styles/breakpoints'
import colors from '../styles/colors'

const container = css`
    margin: 20px 0;
`
const containerCapacity = css`
    display:flex; 
    justify-content: space-between;
    margin: 0 10px 0 10px;
    height:40px`

const textCapacity = css`
    font-weight:bold;
    font-size:15px;`

const textInfo = css`
    text-align:center;
    font-size:14px;
    font-weight:bold;
    color:${colors.gray};
        a {
            text-decoration:none;
            color:${colors.primary};
        }`

const modalContainer = css`
    max-height:50vh;
    max-width:80vw;
    padding: 0 1rem 2rem 1rem;
    display:block;
    margin:auto;
    border-radius:10px;
    background:#ffffff;
    text-align:center;
`

function Mypokemon() {
    const navigate = useNavigate();
    const [getMyPokemons, setMyPokemons] = localStorage("mypokemon");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReleaseAll, setIsReleaseAll] = useState(false);
    const [idPokemon, setIdPokemon] = useState(0);

    const countCapacity = () => {
        const earlyWarning = (POCKET_CAPACITY - 2);
        return `color:${earlyWarning <= getMyPokemons().length ? "red" : "green"}}`
    }

    const handleOpenModal = (id) => {
        setIsModalOpen(true)
        setIdPokemon(id)
    }

    const handleOpenModalReleaseAll = () => {
        setIsModalOpen(true)
        setIsReleaseAll(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setIsReleaseAll(false)
        setIdPokemon(0)
    }

    const handleReleasePokemon = () => {
        if (idPokemon && !isReleaseAll) {
            const notReleasedPokemon = getMyPokemons().filter(
                pokemon => (pokemon.nickname || pokemon.name) !== idPokemon
            );
            setMyPokemons(notReleasedPokemon);
            setIdPokemon(0);
        }

        if (isReleaseAll) {
            setMyPokemons([])
        }

        setIsModalOpen(false)
    }

    const handleRedirectPokemonDetail = (pokemonData) => {
        const { name, image, dreamworld } = pokemonData;
        navigate(`/pokemon-detail/${name}?image=${btoa(image)}&dreamworld=${btoa(dreamworld)}`)
    }


    const ModalConfirm = () => (
        <Modal
            isOpen={isModalOpen}
        >
            <div className={modalContainer}>
                <h3>
                    CONFIRMATION
                </h3>
                <p>
                    Are you sure you want to release this pokemon?
                </p>
                <div className={css`margin-bottom:10px`}>
                    <Button
                        bgColor={isReleaseAll ? "danger" : "warning"}
                        onClick={() => handleReleasePokemon()}
                    >
                        Release Pokemon
                    </Button>
                    <Button
                        bgColor="default"
                        style={css`margin-left:10px`}
                        onClick={handleCloseModal}
                    >
                        cancel
                    </Button>
                </div>
            </div>
        </Modal>
    )

    return (
        <div className={container}>
            <h2 className={css`margin-left:10px`}>My Pokemon</h2>
            <div className={containerCapacity}>
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
                <Button
                    bgColor="danger"
                    onClick={handleOpenModalReleaseAll}
                    style={!getMyPokemons().length && css`visibility: hidden;`}
                >
                    Release All
                </Button>
            </div>
            <ul className={css`display: block;`}>
                {
                    getMyPokemons().length ? (
                        getMyPokemons().reverse().map((pokemon, index) => {
                            return (
                                <div key={index} className={css`
                                @media (min-width: ${md}) {
                                    width:50%;
                                }
                                @media (max-width: ${md}) {
                                    width:100%;
                                }
                                float:left;
                                `}>
                                    <PokemonCardList
                                        float={false}
                                        pokemon={pokemon}
                                        showOwnedPokemon={false}
                                        style={css`margin:10px`}
                                        handleRedirectPokemonDetail={handleRedirectPokemonDetail}
                                    />
                                    <div
                                        className={css`
                                            margin-top:-10px;
                                            margin-bottom:30px;
                                            padding:10px;
                                        `}
                                    >
                                        <Button
                                            onClick={() => handleOpenModal(pokemon.nickname || pokemon.name)}
                                            bgColor="warning"
                                        >
                                            Release {pokemon.nickname || pokemon.name}
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                        )
                    ) : <></>
                }
            </ul>
            {
                !getMyPokemons().length && (<p className={textInfo}>
                    You don't have pokemon.
                    <br />go to catch
                    <a href="/"> pokemon</a>
                </p>)
            }
            <ModalConfirm />
        </div >
    )
}

export default Mypokemon;