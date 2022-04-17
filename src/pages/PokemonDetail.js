import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { css, cx } from '@emotion/css'

// Component
import { Button, Modal, WaitingText, FormInput } from '../components'

// GraphQL
import {
    GET_POKEMON_DETAIL
} from "../graphql/queries"

// Helper
import { localStorage, countMyPokemon } from '../helpers'

// Style
const container = css`
    margin: 20px 0;`

const headerInfoContainer = css`
    position:relative;
`
const headerInfoText = css`
    position:relative;`

const headerInfoButton = css`
    right:0;
    width:60px;
    position:absolute;
    height:35px !important;`

const imageContainer = css`
    text-align:center`

const imageStyle = css`
    width:250px;
    height:auto;
    margin-top:20px`

const pokemonTitle = css`
    margin-top:30px;    
    margin-bottom:10px;    
    text-transform: capitalize;`

const pokemonTypeLabel = css`
    color: #9E9E9E;
    font-size:14px;
    display: inline-block;
    border: 1px solid;
    border-radius:10px;
    margin:5px 5px;
    padding:5px;`

const basicInfoContainer = css`
    margin-bottom:0px;
    list-style:none;
    padding:10px;
    border-radius:10px;
    background:#F2F2F2;`

const basicInfoLabel = css`
    font-size:12px;
    font-weight:bold;
    line-height:26px;
    margin:0px;
    margin-right:10px;`

const basicInfoText = css`
    margin-left:10px;
    line-height: 26px;
    margin:0px;
    margin-right:10px;`

const infoStatContainer = css`
    list-style:none;
    margin-top:0px;
    padding:10px 10px 10px 0;
    border-radius:10px;`

const infoStatLabel = css`
    font-size:12px;
    font-weight:bold;
    margin-bottom:10px;`

const infoStatPower = css`
    display:block;
    background:#559EDF;
    padding:2px 2px 2px 10px;
    color:#ffffff;
    font-weight:bold;`

const infoStatPowerContainer = css`
    width:100%;
    border-radius:5px;
    background:#E6E6E6;`

const modalContainer = css`
    width:80vw;
    max-height:50vh;
    max-width:90vw;
    display:block;
    padding:10px;
    margin:auto;
    border-radius:10px;
    background:#ffffff;
    text-align:center;`

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
            isExistingPokemon = getMyPokemons().some(pokemon =>
                pokemon.id === data?.pokemon?.id
            )
        }

        if (isExistingPokemon) {
            setIsMultipleCatch(true)
        }
    }

    const handleAddToPocket = () => {
        if (!isMultipleCatch) {
            setMyPokemons(
                [...getMyPokemons(), {
                    nickname,
                    id: data?.pokemon?.id,
                    image: pokemonImageUrl,
                    name: data?.pokemon?.name,
                    dreamworld: pokemonDreamworldUrl
                }
                ])
            setTotalOwnedPokemon(countMyPokemon(data?.pokemon?.name))
            setLoadingCatch(false)
            setModalIsOpen(false);
        }
    }

    const handleRelease = () => {
        setLoadingCatch(false)
        setModalIsOpen(false);
        setNickname("")
    }

    const handleInputChange = (event) => {
        if (isMultipleCatch) {
            if (event.target.value) {
                setIsMultipleCatch(false);
            } else {
                setIsMultipleCatch(true);
            }
        }

        setNickname(event.target.value ?? "")
    }

    useEffect(() => {
        setTotalOwnedPokemon(countMyPokemon(data?.pokemon?.name))
    }, [data])

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
                    <FormInput
                        placeholder="Give A Nickname"
                        value={nickname}
                        onChange={handleInputChange}
                    />
                    {
                        isMultipleCatch && (
                            <div>
                                <p className={css`font-size:14px;color:red`}>
                                    You already have  {data?.pokemon?.name}.
                                    <br /> Please give it a name.
                                </p>
                            </div>
                        )
                    }
                </div>
                <div className={css`margin-bottom:10px`}>
                    <Button bgColor="primary" onClick={handleAddToPocket}>
                        Add to my pocket
                    </Button>
                    <Button
                        bgColor="warning"
                        style={css` margin-left:10px`}

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
                    className={css`font-weight:bold;color:red;`}
                >owned pokemon : 10/10</p>
            </div>
        </Modal>
    )

    return (
        <div className={container}>

            {ModalCatchPokemon()}
            {ModalWarning()}

            {
                loading ? <WaitingText /> :
                    (
                        <>
                            <div className={headerInfoContainer}>
                                <span className={headerInfoText}>
                                    owned : {totalOwnedPokemon}
                                </span>
                                <Button
                                    bgColor="primary"
                                    onClick={handleCatchPokemon}
                                    disabled={loadingCatch}
                                    style={headerInfoButton}
                                >
                                    Catch
                                </Button>
                            </div>

                            <div className={imageContainer}>
                                {
                                    loadingCatch ?
                                        <img
                                            className={imageStyle}
                                            src={require('../assets/pokeball-catching.gif')
                                            }
                                        />
                                        :
                                        <img
                                            className={imageStyle}
                                            src={pokemonDreamworldUrl}
                                        />
                                }
                                <h1 className={pokemonTitle}>
                                    {data?.pokemon?.name}
                                </h1>
                                {
                                    data?.pokemon?.types?.map(({ type }, index) => (
                                        <p key={index} className={pokemonTypeLabel}>
                                            {type?.name}
                                        </p>
                                    ))
                                }
                            </div>

                            {/* BASIC INFO */}
                            <ul className={basicInfoContainer}>
                                <h2 className={css`margin-top:10px`}>
                                    Basic Info :
                                </h2>
                                <li className={css`display:flex;`}>
                                    <p className={basicInfoLabel}>
                                        HEIGHT :
                                    </p>
                                    <p className={basicInfoText}>
                                        {data?.pokemon?.height / 10}m
                                    </p>
                                </li>
                                <li className={css`display:flex;`}>
                                    <p className={basicInfoLabel}>
                                        HEIGHT :
                                    </p>
                                    <p className={basicInfoText}>
                                        {data?.pokemon?.weight / 10}kg
                                    </p>
                                </li>
                            </ul>

                            {/* STATS INFORMATION */}
                            <ul
                                className={infoStatContainer}
                            >
                                <h2>
                                    Stats :
                                </h2>
                                {data?.pokemon?.stats.map((stat, index) => (
                                    <li key={index}
                                        className={css`margin-bottom:10px;`}
                                    >
                                        <>
                                            <div
                                                className={infoStatLabel}
                                            >
                                                {stat.stat.name.toUpperCase()} :
                                            </div>
                                            <div className={infoStatPowerContainer}>
                                                <div className={
                                                    cx(
                                                        infoStatPower,
                                                        css`width: ${stat.base_stat * 2}px;`
                                                    )
                                                }>
                                                    {stat.base_stat}
                                                </div>
                                            </div>
                                        </>
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