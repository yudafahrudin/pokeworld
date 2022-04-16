import React from "react";
import { useNavigate } from "react-router-dom";
import { css } from '@emotion/css'

import { localStorage } from '../helpers'

function Mypokemon() {
    const navigate = useNavigate();
    const [getMyPokemons] = localStorage("mypokemon");

    const handleRedirectPokemonDetail = (pokemonData) => {
        const { name, image, dreamworld } = pokemonData;
        navigate(`/pokemon-detail/${name}?image=${btoa(image)}&dreamworld=${btoa(dreamworld)}`)
    }
    const PokemonCardList = ({ list }) => {
        if (list.length) {
            return [...list].reverse().map((pokemon, index) => (
                <li key={index} className={css`
                display:flex;
                margin: 0 auto 10px auto;
                border-radius:10px;
                cursor: pointer;
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