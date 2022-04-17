import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { css } from '@emotion/css'

import { WaitingText, PokemonCardList } from '../components'

import {
    GET_POKEMON_LIST
} from '../graphql/queries'

const pageDetail = css`
    font-size:.85rem;
    padding:5px;
`
function Home() {
    const limit = 10;
    const offset = 0;
    const [pokemonList, setPokemonList] = useState([])
    const [isFetching, setIsFetching] = useState(false)

    const [getPokemonList, { data }] = useLazyQuery(GET_POKEMON_LIST, {
        fetchPolicy: "cache-first",
        onCompleted: data => {
            setPokemonList(prevState => ([...prevState, ...data.pokemons.results]))
            setIsFetching(false);
        }
    })

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
        // initialize first reload page
        getPokemonList({
            variables: {
                limit,
                offset
            }
        });
    }, [])

    return (
        <>
            <p className={pageDetail}>
                Welcome Traine~ the Pokeworld contains detailed stats for every creature
                from the pokemon world.
            </p>
            <ul>
                {
                    pokemonList.length ? (
                        pokemonList.map((pokemon, index) => {
                            return (
                                <PokemonCardList
                                    pokemon={pokemon}
                                    key={index + `pokemon-list`}
                                />
                            )
                        }
                        )
                    ) : <WaitingText />
                }
            </ul>
            {
                isFetching && <WaitingText />
            }
        </>

    )
}

export default Home;