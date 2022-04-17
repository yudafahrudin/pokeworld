import React from "react";
import { useNavigate } from "react-router-dom";
import { css } from '@emotion/css'

import { countMyPokemon } from '../helpers'

function PokemonCardList({ pokemon, showOwnedPokemon = true, bgColor }) {
    const navigate = useNavigate();
    const enumColor = () => {
        switch (bgColor) {
            case "primary":
                return { bgColor: "#339DE8", fontColor: "white" };
            case "default":
                return { bgColor: "#F5F5F5", fontColor: "black" };
            case "warning":
                return { bgColor: "#E3C446", fontColor: "black" };
            default:
                return { bgColor: "#ffffff", fontColor: "black" };
        }
    }

    const handleRedirectPokemonDetail = (pokemonData) => {
        const { name, image, dreamworld } = pokemonData;
        navigate(`/pokemon-detail/${name}?image=${btoa(image)}&dreamworld=${btoa(dreamworld)}`)
    }

    return (
        <li
            className={css`
            width:100%;
            display:flex;
            cursor: pointer;
            border-radius:10px;
            margin: 0 auto 10px auto;
            box-shadow: rgba(9, 30, 66, 0.25) 0px 3px 4px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
            background-color: ${enumColor().bgColor};
            color: ${enumColor().fontColor};
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
                <img
                    className={css`
                    transition: all .5s;
                    `}
                    src={pokemon.image}
                    width={"100%"}
                    height={"auto"}
                    alt={pokemon.nickname || pokemon.name}
                />
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
                    {pokemon.nickname || pokemon.name}
                </h3>
                {
                    showOwnedPokemon && (<p className={css`
                    font-size: .745rem;
                    `}>
                        you've owned: {countMyPokemon(pokemon.name)}
                    </p>)
                }

            </div>
        </li>
    )
}

export default PokemonCardList;