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
import { localStorage, countMyPokemon, generateProbabilities } from '../helpers'
import colors from "../styles/colors"

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
    text-align:center;
    display:block;`

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
    padding:15px;
    border-radius:10px;
    background: ${colors.white};`

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
    background: ${colors.white};
    padding:15px;
    border-radius:10px;`

const infoStatLabel = css`
    font-size:12px;
    font-weight:bold;
    margin-bottom:10px;`

const infoStatPower = css`
    display:block;
    background:${colors.primary};
    padding:2px 2px 2px 10px;
    color:#ffffff;
    font-weight:bold;`

const infoStatPowerContainer = css`
    width:100%;
    border-radius:5px;
    background:#CFE9FF;`
// background:${colors.white};`

const movesContainer = css`
    margin-bottom:0px;
    list-style:none;
    padding:15px;
    padding-bottom:20px;
    border-radius:10px;
    background:${colors.white};`

const modalContainer = css`
    max-height:50vh;
    max-width:80vw;
    padding: 0 1rem 2rem 1rem;
    display:block;
    cursor:pointer;
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
    const [getProbPokemon] = localStorage("catchProbabilities");

    // State
    const [isModalCatchPokemon, setIsModalCatchPokemon] = useState(false);
    const [isModalPocketFull, setIsModalPocketFull] = useState(false);
    const [isModalPokemonRun, setIsModalPokemonRun] = useState(false);
    const [loadingCatch, setLoadingCatch] = useState(false);
    const [totalOwnedPokemon, setTotalOwnedPokemon] = useState(0);
    const [nickname, setNickname] = useState("");
    const [isMultipleCatch, setIsMultipleCatch] = useState(false);
    const [probabilityReached, setProbabilityReached] = useState(0);

    const { loading, data } = useQuery(GET_POKEMON_DETAIL, {
        fetchPolicy: "cache-first",
        variables: {
            name: params.name
        }
    })

    useEffect(() => {
        if (data) {
            // Initialize probabilities
            generateProbabilities(data?.pokemon?.name)
        }
        setTotalOwnedPokemon(countMyPokemon(data?.pokemon?.name))
    }, [data])

    const handleExistingPokemon = () => {
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

    const handleCatchPossibilities = () => {
        const { probabilites } = getProbPokemon()
        const pokemonCaught = probabilites[probabilityReached]

        setLoadingCatch(true);

        // if pocket not fully
        if (getMyPokemons().length !== pocketCapacity) {
            if (pokemonCaught) {
                setTimeout(() => {
                    setIsModalCatchPokemon(true);
                    handleExistingPokemon()
                }, 2000)
            } else {
                setIsModalPokemonRun(true)
            }
        } else {
            setIsModalPocketFull(true)
        }

        // set next probability
        setProbabilityReached(probabilityReached + 1)
    }

    useEffect(() => {
        // if the probability at the end of array
        // let's regenerate the probability for the next catch
        if (probabilityReached === getProbPokemon()?.probabilites?.length) {
            generateProbabilities(data?.pokemon?.name)
            setProbabilityReached(0)
        }
    }, [probabilityReached])


    const handleAddToPocketValidation = () => {
        if (isMultipleCatch && nickname) {
            handleAddToPocket()
        }
        if (!isMultipleCatch) {
            handleAddToPocket()
        }
    }

    const handleAddToPocket = () => {
        setMyPokemons(
            [...getMyPokemons(), {
                nickname,
                id: data?.pokemon?.id,
                image: pokemonImageUrl,
                name: data?.pokemon?.name,
                dreamworld: pokemonDreamworldUrl
            }
            ])
        setNickname("")
        setLoadingCatch(false)
        setIsMultipleCatch(false);
        setIsModalCatchPokemon(false);
        setTotalOwnedPokemon(countMyPokemon(data?.pokemon?.name))
    }

    const handleRelease = () => {
        setNickname("")
        setLoadingCatch(false)
        setIsMultipleCatch(false)
        setIsModalCatchPokemon(false);
    }

    const handleClosePocketFull = () => {
        setLoadingCatch(false)
        setIsModalPocketFull(false)
    }

    const handleClosePokemonRun = () => {
        setLoadingCatch(false)
        setIsModalPokemonRun(false)
    }

    const handleInputChange = (event) => {
        setNickname(event.target.value ?? "")
    }

    const ModalCatchPokemon = () => (
        <Modal
            isOpen={isModalCatchPokemon}
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
                        (isMultipleCatch && !nickname) && (
                            <div>
                                <p className={css`font-size:14px;color:${colors.danger}`}>
                                    You already have  {data?.pokemon?.name}.
                                    <br /> Please give it a name.
                                </p>
                            </div>
                        )
                    }
                </div>
                <div className={css`margin-bottom:10px`}>
                    <Button bgColor="primary" onClick={handleAddToPocketValidation}>
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

    const ModalPocketFull = () => (
        <Modal
            isOpen={isModalPocketFull}
            onClick={handleClosePocketFull}
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

    const ModalPokemonRun = () => (
        <Modal
            isOpen={isModalPokemonRun}
            onClick={handleClosePokemonRun}
        >
            <div className={modalContainer}>
                <h1>SORRY</h1>
                <b>{data?.pokemon?.name}</b> is running, this Pokemon really strong :(
            </div>
        </Modal>
    )

    if (loading) return <WaitingText />

    if (data) {
        const { name, height, weight, types, stats, moves } = data?.pokemon;

        return (
            <div className={container}>
                <h2>Pokemon Detail</h2>
                {ModalCatchPokemon()}
                {ModalPocketFull()}
                {ModalPokemonRun()}
                <div className={headerInfoContainer}>
                    <span className={headerInfoText}>
                        owned : {totalOwnedPokemon}
                    </span>
                    <Button
                        bgColor="primary"
                        onClick={handleCatchPossibilities}
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
                                src={require('../assets/pokeball-catching.gif')}
                                alt={`pokebal-gif`}
                                width="250px"
                                height="190px"
                            />
                            :
                            <img
                                className={imageStyle}
                                src={pokemonDreamworldUrl}
                                alt={`pokemon-detail`}
                                width="250px"
                                height="250px"
                            />
                    }
                    <h1 className={pokemonTitle}>
                        {name}
                    </h1>
                    {types?.map(({ type }, index) => (
                        <p key={index} className={pokemonTypeLabel}>
                            {type?.name}
                        </p>
                    ))
                    }
                </div>

                {/* BASIC INFO */}
                <ul className={basicInfoContainer}>
                    <li>
                        <h2 className={css`margin-top:10px`}>
                            Basic Info :
                        </h2>
                    </li>
                    <li className={css`display:flex;`}>
                        <p className={basicInfoLabel}>
                            HEIGHT :
                        </p>
                        <p className={basicInfoText}>
                            {height / 10}m
                        </p>
                    </li>
                    <li className={css`display:flex;`}>
                        <p className={basicInfoLabel}>
                            HEIGHT :
                        </p>
                        <p className={basicInfoText}>
                            {weight / 10}kg
                        </p>
                    </li>
                </ul>

                {/* STATS INFORMATION */}
                <ul
                    className={infoStatContainer}
                >
                    <li>
                        <h2>
                            Stats :
                        </h2>
                    </li>
                    {stats.map((stat, index) => (
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
                {/* MOVE INFORMATION */}
                <ul
                    className={movesContainer}
                >
                    <li>
                        <h2>
                            Moves :
                        </h2>
                    </li>
                    {moves.map(({ move }, index) => (
                        <span key={index} className={css`font-size:13px`}>
                            {move.name}{moves.length - 1 !== index && ", "}
                        </span>
                    ))}
                </ul>
            </div >
        )
    }
}

export default PokemonDetail;