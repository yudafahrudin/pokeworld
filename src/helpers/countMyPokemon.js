import localStorage from './localStorage';

const [getMyPokemons] = localStorage("mypokemon");

const countMyPokemon = (name) => {
    let count = getMyPokemons()?.filter(pokemon => name === pokemon.name);
    return count.length;
}

export default countMyPokemon;