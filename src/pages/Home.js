import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { css } from '@emotion/css'

import {
    GET_POKEMON_LIST
} from '../graphql/queries'

import { countMyPokemon } from '../helpers/index'

function Home() {
    const limit = 5;
    const offset = 0;
    const navigate = useNavigate();
    const [pokemonList, setPokemonList] = useState([])
    const [isFetching, setIsFetching] = useState(false)

    const [getPokemonList, { data }] = useLazyQuery(GET_POKEMON_LIST, {
        fetchPolicy: "cache-first",
        onCompleted: data => {
            setPokemonList(prevState => ([...prevState, ...data.pokemons.results]))
            setIsFetching(false);
        }
    })

    const ImageMemo = ({ src, key }) => (React.useMemo(() => {
        return <img src={src} key={key} />
    }))

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        fetchMoreListItems();
    }, [isFetching]);

    function handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop + 1 <= document.documentElement.offsetHeight || isFetching) return;
        setIsFetching(true);
    }

    function fetchMoreListItems() {
        setTimeout(() => {
            getPokemonList({
                variables: {
                    limit,
                    offset: data?.pokemons?.nextOffset
                }
            });
        }, 2000);
    }

    useEffect(() => {
        getPokemonList({
            variables: {
                limit,
                offset
            }
        });
    }, [])

    const handleRedirectPokemonDetail = (pokemonData) => {
        const { name, image, dreamworld } = pokemonData;
        navigate(`/pokemon-detail/${name}?image=${btoa(image)}&dreamworld=${btoa(dreamworld)}`)
    }

    const PokemonCardList = ({ pokemon, key }) => {
        return (
            <div key={key} className={css`
                width:98%;
                display:flex;
                cursor: pointer;
                border-radius:10px;
                margin: 0 auto 10px auto;
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
                    <ImageMemo src={pokemon.image} key={key} />
                    {/* <img
                        className={css`
                        transition: all .5s;
                        `}
                        src={pokemon.image}
                        width={"100%"}
                        height={"auto"}
                        alt={pokemon.name}
                    /> */}
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
            </div>
        )
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
            <ul>
                {
                    pokemonList.length ? (
                        pokemonList.map((pokemon, index) => (
                            <PokemonCardList
                                pokemon={pokemon}
                                key={index}
                            />
                        ))
                    ) : <p className={css`font-size:14px;padding:5px;color:#dadad3`}>data not found</p>
                }
                {/* <div className={
                    css`
                    width:98%;
                    margin:auto;
                    margin-top:15px;
                    `
                }>
                    <Button
                        fullWidth
                        disabled={loading}
                        onClick={loadMore}
                    >
                        {loading ? "please wait" : "load more"}
                    </Button>
                </div> */}
            </ul>
            {
                isFetching && <div className={
                    css`text-align: center;
                    margin: 0 0 30px 0;`
                }><p className={css`color:#dadad3`}>please wait...</p></div>
            }
        </>

    )
}

export default Home;