import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { css } from '@emotion/css'

// Component
import { Button, Modal, WaitingText } from '../components'

// GraphQL
import {
    GET_POKEMON_DETAIL
} from "../graphql/queries"

// Helper
import { localStorage, countMyPokemon } from '../helpers'

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

function PokemonDetail() {
    // Constant
    const pocketCapacity = 10;
    const params = useParams();
    const [searchParams] = useSearchParams();
    const pokemonImageBase64 = searchParams.get('image');
    const pokemonDreamworldBase64 = searchParams.get('dreamworld');
    const pokemonImageUrl = pokemonImageBase64 ? atob(pokemonImageBase64) : null;
    const pokemonDreamworldUrl = pokemonDreamworldBase64 ? atob(pokemonDreamworldBase64) : null;

    // Presist
    const [getMyPokemons, setMyPokemons] = localStorage("mypokemon");

    // State
    const [isModalOpen, setModalIsOpen] = useState(false);
    const [isModalWarningOpen, setIsModalWarningOpen] = useState(false);
    const [loadingCatch, setLoadingCatch] = useState(false);
    const [totalOwnedPokemon, setTotalOwnedPokemon] = useState(0);
    const [nickname, setNickname] = useState("");
    const [isMultipleCatch, setIsMultipleCatch] = useState(false);

    const { loading, data } = useQuery(GET_POKEMON_DETAIL, {
        fetchPolicy: "cache-first",
        variables: {
            name: params.name
        }
    })

    const handleCatchPokemon = () => {
        if (getMyPokemons().length !== pocketCapacity) {
            setLoadingCatch(true);
            setTimeout(() => {
                setModalIsOpen(true);
                handleOwnedSamePokemon()
            }, 2000)
        } else {
            setIsModalWarningOpen(true)
        }
    }

    const handleOwnedSamePokemon = () => {
        let isExistingPokemon = false;

        if (getMyPokemons().length) {
            isExistingPokemon = getMyPokemons().every(pokemon =>
                pokemon.name === data?.pokemon?.name
            );
        }

        if (isExistingPokemon) {
            setIsMultipleCatch(true)
        }
    }

    const handleAddToPocket = () => {
        if (!isMultipleCatch) {
            setMyPokemons(JSON.stringify(
                [...getMyPokemons(), {
                    nickname,
                    image: pokemonImageUrl,
                    name: data?.pokemon?.name,
                    dreamworld: pokemonDreamworldUrl
                }
                ]))
            setTotalOwnedPokemon(countMyPokemon(data?.pokemon?.name))
            setLoadingCatch(false)
            setModalIsOpen(false);
        }
    }

    const handleRelease = () => {
        setLoadingCatch(false)
        setModalIsOpen(false);
    }

    const handleInputChange = (event) => {
        if (event.target.value) {
            setIsMultipleCatch(false);
        } else {
            setIsMultipleCatch(true);
        }
        setNickname(event.target.value ?? "")
    }

    useEffect(() => {
        setTotalOwnedPokemon(countMyPokemon(data?.pokemon?.name))
    }, [data])

    useEffect(() => {
        // const loopEffectCatch = setInterval(() => {
        //     console.log('hai')
        //     setOnCatchPokemon(!onCatchPokemon)
        // }, 2000)
        // if (!catchPokemon) {
        //     clearInterval(loopEffectCatch);
        // }
    }, [])

    const ModalCatchPokemon = () => (
        <Modal
            isOpen={isModalOpen}
        >
            <div className={modalContainer}>
                <h3>
                    CONGRATULATION
                </h3>
                <p
                    className={
                        css`margin-top:0px`
                    }
                >You got {data?.pokemon?.name}</p>
                <div className={
                    css`margin-bottom:10px`
                }>
                    <input
                        className={
                            css`
                                    border-radius:10px;
                                    border: 2px solid rgba(0, 0, 0, 0.6);
                                    background-image:none;
                                    background-color: #dadad3;
                                    -webkit-box-shadow: none;
                                    -moz-box-shadow: none;
                                    box-shadow: none;
                                    padding: 10px;
                                    &:focus {
                                        outline: none;
                                    }
                                `
                        }
                        type="text"
                        onChange={handleInputChange}
                        id="nickname-input"
                        placeholder="Give A Nickname"
                    />
                    {
                        isMultipleCatch && (
                            <div>
                                <p className={css`font-size:14px;color:red`}>
                                    You already have bulbasour.
                                    <br /> Please give it a name.
                                </p>
                            </div>
                        )
                    }
                </div>
                <div className={css`margin-bottom:10px`}>
                    <Button onClick={handleAddToPocket}>
                        Add to my pocket
                    </Button>
                    <Button
                        style={css`
                            margin-left:10px
                            `}
                        onClick={handleRelease}
                    >
                        Release
                    </Button>
                </div>
            </div>
        </Modal>
    )

    const ModalWarning = () => (
        <Modal
            isOpen={isModalWarningOpen}
            onClick={() => setIsModalWarningOpen(false)}
        >
            <div className={modalContainer}>
                <h1>SORRY</h1>
                Your pocket is full, please release some pokemon
                <p
                    className={
                        css`
                    font-weight:bold;
                    color:red;
                    `
                    }
                >owned pokemon : 10/10</p>
            </div>
        </Modal>
    )



    return (
        <div
            className={
                css`
            margin: 20px 0;
            `
            }
        >
            <ModalCatchPokemon />
            <ModalWarning />

            {
                loading ? <WaitingText /> :
                    (
                        <>
                            <div
                                className={
                                    css`
                                position:relative;
                                `
                                }
                            >
                                <span className={
                                    css`
                                    font-size:14px;
                                    `
                                }>owned : {totalOwnedPokemon}</span>
                                <Button
                                    onClick={handleCatchPokemon}
                                    disabled={loadingCatch}
                                    style={
                                        css`
                                        width:60px;
                                        font-size:12px;
                                        right:0;
                                        position:absolute;
                                        height:35px !important;
                                        `
                                    }>
                                    Catch
                                </Button>
                            </div>
                            <div className={
                                css`
                            text-align:center;
                            `
                            }>

                                <div className={
                                    css`
                                    height:255px;
                                    margin-top:20px;
                                    `
                                }>

                                    {
                                        loadingCatch ?
                                            <img
                                                className={
                                                    css`
                                                width:auto;
                                                height:250px;
                                            `
                                                }
                                                src={"https://www.pngmart.com/files/2/Pokeball-PNG-Photos.png"} />
                                            :
                                            <img
                                                className={
                                                    css`
                                            width:auto;
                                            height:250px;
                            `
                                                }
                                                src={pokemonDreamworldUrl} />
                                    }


                                </div>

                                <h1
                                    className={
                                        css`
                                    margin-top:30px;    
                                    margin-bottom:10px;    
                                    text-transform: capitalize;`
                                    }
                                >{data?.pokemon?.name}
                                </h1>
                                {
                                    data?.pokemon?.types?.map(({ type }, index) => (
                                        <p key={index}
                                            className={
                                                css`
                                        color: #9E9E9E;
                                        font-size:14px;
                                        display: inline-block;
                                        border: 1px solid;
                                        border-radius:10px;
                                        margin:5px 5px;
                                        padding:5px;
                                        `
                                            }
                                        >
                                            {type?.name}
                                        </p>
                                    ))

                                }
                            </div>
                            <ul className={
                                css`
                                margin-bottom:0px;
                                list-style:none;
                                padding:10px;
                                border-radius:10px;
                                background:#F2F2F2;
                                `
                            }>
                                <h2 className={
                                    css`margin-top:10px`
                                }>
                                    Basic Info :
                                </h2>
                                <li className={
                                    css`display:flex;`
                                }>
                                    <p
                                        className={
                                            css`
                                            font-size:12px;
                                            font-weight:bold;
                                            line-height:26px;
                                            margin:0px;
                                            margin-right:10px;
                                        `
                                        }
                                    >HEIGHT :</p>
                                    <p
                                        className={
                                            css`
                                            margin-left:10px;
                                            line-height: 26px;
                                            margin:0px;
                                            margin-right:10px;`
                                        }
                                    >
                                        {data?.pokemon?.height / 10}m
                                    </p>
                                </li>
                                <li className={
                                    css`display:flex;`
                                }>
                                    <p
                                        className={
                                            css`
                                            font-size:12px;
                                            font-weight:bold;
                                            line-height:26px;
                                            margin:0px;
                                            margin-right:10px;
                                            `
                                        }
                                    >WEIGHT :</p>
                                    <p
                                        className={
                                            css`
                                            margin-left:10px;
                                            line-height: 26px;
                                            margin:0px;
                                            margin-right:10px;`
                                        }
                                    >
                                        {data?.pokemon?.weight / 10}kg
                                    </p>
                                </li>
                            </ul>
                            <ul
                                className={
                                    css`
                                    list-style:none;
                                    margin-top:0px;
                                    padding:10px 10px 10px 0;
                                    border-radius:10px;
                                    `
                                }
                            >
                                <h2>
                                    Stats :
                                </h2>
                                {data?.pokemon?.stats.map((stat, index) => (
                                    <li key={index}
                                        className={
                                            css`
                                                margin-bottom:10px;
                                                `
                                        }
                                    >
                                        <div>
                                            <div
                                                className={
                                                    css`
                                                font-size:12px;
                                                font-weight:bold;
                                                margin-bottom:10px;
                                                `
                                                }
                                            >
                                                {stat.stat.name.toUpperCase()} :
                                            </div>
                                            <div className={
                                                css`
                                                width:100%;
                                                border-radius:5px;
                                                background:#E6E6E6;
                                                `
                                            }>
                                                <div className={
                                                    css`
                                                    display:block;
                                                    background:#559EDF;
                                                    width: ${stat.base_stat * 2}px;
                                                    padding:2px 2px 2px 10px;
                                                    color:#ffffff;
                                                    font-weight:bold;
                                                    `
                                                }>
                                                    {stat.base_stat}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )
            }
        </div >
    )
}

export default PokemonDetail;