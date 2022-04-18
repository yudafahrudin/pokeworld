import React from "react";
import Renderer from "react-test-renderer";
import PokemonCardList from "./PokemonCardList";

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

const image = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png";
const dreamworld = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/9.svg";

const mockPokemonDataWithNickname = {
    name: "bulbasaur",
    nickname: "boba",
    image,
    dreamworld
}
const mockPokemonDataWithOutNickname = {
    name: "bulbasaur",
    nickname: "",
    image,
    dreamworld
}

describe("Name and Nickname", () => {
    test("if there is nickname, must show the nickname", () => {
        const componentRendered = Renderer.create(
            <PokemonCardList
                pokemon={mockPokemonDataWithNickname}
            />
        );
        const componentInstance = componentRendered.toJSON();
        expect(componentInstance.children[1].children[0].children[0]).toBe("boba");
    });

    test("if there is no nickname,  must be show the name", () => {
        const componentRendered = Renderer.create(
            <PokemonCardList
                pokemon={mockPokemonDataWithOutNickname}
            />
        );
        const componentInstance = componentRendered.toJSON();
        expect(componentInstance.children[1].children[0].children[0]).toBe("bulbasaur");
    });
})

describe("not show owned pokemon", () => {
    test("owned pokemon must not show as espected ", () => {

        const componentRendered = Renderer.create(
            <PokemonCardList
                pokemon={mockPokemonDataWithNickname}
                showOwnedPokemon={false}
            />
        );

        const componentInstance = componentRendered.toJSON();
        expect(componentInstance.children[1].children.length).toBe(1)
    });
})

describe("function callback", () => {
    test("handleRedirectPokemonDetail work as espected ", () => {
        const clickMock = jest.fn();

        const componentRendered = Renderer.create(
            <PokemonCardList
                pokemon={mockPokemonDataWithNickname}
                handleRedirectPokemonDetail={clickMock}
            />
        );

        const componentInstance = componentRendered.toJSON();
        componentInstance.props.onClick();
        expect(clickMock).toHaveBeenCalled();
    });
})
