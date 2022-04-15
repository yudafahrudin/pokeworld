import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { css } from '@emotion/css'

import {
    Button
} from '../components'

import {
    GET_POKEMON_LIST
} from '../graphql/queries'

import { countMyPokemon } from '../helpers/index'

function Home() {
    const navigate = useNavigate();
    const limit = 30;
    const offset = 0;
    const [pokemonList, setPokemonList] = useState([])

    const [getPokemonList, { loading, data }] = useLazyQuery(GET_POKEMON_LIST, {
        fetchPolicy: "cache-first",
        onCompleted: data => {
            setTimeout(() => {
                setPokemonList([...pokemonList, ...data.pokemons.results])
            }, 500)
        }
    })

    useEffect(() => {
        getPokemonList({
            variables: {
                limit,
                offset
            }
        });
    }, [])

    const loadMore = () => {
        getPokemonList({
            variables: {
                limit,
                offset: data?.pokemons?.nextOffset
            }
        })
    }

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
                        padding:10px
                        `
                        }
                    >
                        <h3 className={
                            css`
                            margin-bottom: .5em;
                            text-transform: capitalize;
                            `
                        }>
                            {pokemon.name}
                        </h3>
                        <p className={css`
                        font-size: .745rem;
                        `}>
                            you've owned: {countMyPokemon(pokemon.name)}
                        </p>
                    </div>
                </li>
            ))
        }
    }

    return (
        <>
            <p className={css`
            font-size:.85rem;
            padding:5px;
            `}>
                Welcome Traine~ the Pokeworld contains detailed stats for every creature
                from the pokemon world.
            </p>
            <ul className={
                css`
                padding:0px;
                padding-top: 10px;
                list-style:none;
                `
            }>
                <PokemonCardList list={pokemonList} />
                <div className={
                    css`
                    width:98%;
                    margin:auto;
                    margin-top:15px;
                    margin-bottom:20px;
                    `
                }>
                    <Button
                        fullWidth
                        disabled={loading}
                        onClick={loadMore}
                    >
                        {loading ? "please wait" : "load more"}
                    </Button>
                </div>
            </ul>
        </>

    )
}

export default Home;