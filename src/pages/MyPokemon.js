import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { css } from '@emotion/css'

import { Button } from '../components'

import {
    GET_POKEMON_DETAIL
} from "../graphql/queries"

import { localStorage, countMyPokemon } from '../helpers'

function Mypokemon() {
    const params = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const pokemonImageBase64 = searchParams.get('img');
    const pokemonImageUrl = pokemonImageBase64 ? atob(searchParams.get('img')) : null;
    const [getMyPokemons, setMyPokemons] = localStorage("mypokemon");

    const [catchPokemon, setCatchPokemon] = useState(false);
    const [loadingCatch, setLoadingCatch] = useState(false);
    const [ownedPokemon, setOwnedPokemon] = useState(0);

    // const { loading, data } = useQuery(GET_POKEMON_DETAIL, {
    //     fetchPolicy: "network-only",
    //     variables: {
    //         name: params.name
    //     }
    // })

    const handleCatchPokemon = () => {
        setLoadingCatch(true);
        // setTimeout(() => {
        //     setMyPokemons(JSON.stringify([...getMyPokemons(), { name: data?.pokemon?.name }]))
        //     setOwnedPokemon(countMyPokemon(data?.pokemon?.name))
        //     setLoadingCatch(false)
        // }, 2000)
    }

    useEffect(() => {
        // const loopEffectCatch = setInterval(() => {
        //     console.log('hai')
        //     setOnCatchPokemon(!onCatchPokemon)
        // }, 2000)
        // if (!catchPokemon) {
        //     clearInterval(loopEffectCatch);
        // }
    }, [catchPokemon])

    const handleRedirectPokemonDetail = (pokemonData) => {
        const { name, image, dreamworld } = pokemonData;
        navigate(`/pokemon-detail/${name}?image=${btoa(image)}&dreamworld=${btoa(dreamworld)}`)
    }
    const PokemonCardList = ({ list }) => {
        if (list.length) {
            return list.map((pokemon, index) => (
                <li key={index} className={css`
                display:flex;
                margin: 0 auto 10px auto;
                border-radius:10px;
                width:98%;
                box-shadow: rgba(9, 30, 66, 0.25) 0px 3px 4px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
                `}
                    onClick={() => handleRedirectPokemonDetail({
                        name: pokemon.name,
                        image: pokemon.image,
                        dreamworld: pokemon.dreamworld
                    })}>
                    <div className={css`
                    border-radius:10px;
                    padding:5px;
                    height:100px;
                    width:100px;
                    max-width:100px;
                    `}>
                        <img src={pokemon.image} width={"100%"} height={"auto"} alt="pokemon photo" />
                    </div>
                    <div
                        className={
                            css`
                        padding:10px;
                        display:flex;
                        `
                        }
                    >
                        <h3 className={
                            css`
                            margin:auto;
                            text-transform: capitalize;
                            `
                        }>
                            {pokemon.nickname || pokemon.name}
                        </h3>
                    </div>
                </li>
            ))
        }
        return <>
            <p className={
                css`
            text-align:center;
            `
            }>
                You Dont Have Pokemon. <br /> Go to catch <a href="/">pokemon</a>
            </p>
        </>
    }

    return (
        <div
            className={
                css`
            margin: 20px 0;
            `
            }
        >
            <>
                <p>
                    pokemon owned : {getMyPokemons().length}
                </p>
                <PokemonCardList list={getMyPokemons()} />
            </>
        </div >
    )
}

export default Mypokemon;