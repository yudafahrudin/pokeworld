import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { css } from '@emotion/css'

// Component
import { WaitingText, Button, PokemonCardList } from '../components'

// Context
import { DeveloperContext } from "./DeveloperContext";

import {
    GET_POKEMON_LIST
} from '../graphql/queries'
import colors from "../styles/colors";

const pageDetail = css`
    font-size:.85rem;
    padding:5px;`

const scrollTopStyle = css`
    right:5vw;
    bottom:5vh;
    font-size:25px;
    position:fixed;
    font-weight:bold;
    border-radius:10px;
    padding:10px 15px 10px 15px;
    cursor:pointer;
    background-color: rgb(6,121,177) !important;
    color: ${colors.white} !important;`

function Home() {
    const limit = 10;
    const offset = 0;
    const navigate = useNavigate();
    const { developer, version } = useContext(DeveloperContext);
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

    function handleScrollToTop() {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }

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

    const handleRedirectPokemonDetail = (pokemonData) => {
        const { name, image, dreamworld } = pokemonData;
        navigate(`/pokemon-detail/${name}?image=${btoa(image)}&dreamworld=${btoa(dreamworld)}`)
    }

    return (
        <>
            <div className={css`
                display:flex;
                justify-content: space-between;
            `}>
                {/* <b>creator {developer}</b>
                <b>{" "} versi {version}</b> */}
            </div>
            <p className={pageDetail}>
                Welcome Traine~ the Pokeworld contains detailed stats for every creature
                from the pokemon world.
            </p>
            <Button
                style={scrollTopStyle}
                onClick={handleScrollToTop}
            >
                ^
            </Button>
            <ul>
                {
                    pokemonList.length ? (
                        pokemonList.map((pokemon, index) => {
                            return (
                                <PokemonCardList
                                    pokemon={pokemon}
                                    handleRedirectPokemonDetail={handleRedirectPokemonDetail}
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