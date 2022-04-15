import localStorage from './localStorage';

const [getMyPokemons] = localStorage("mypokemon");

const countMyPokemon = (name) => {
    let count = 0;
    getMyPokemons()?.forEach(pokemon => {
        if (name === pokemon.name) {
            count = count + 1
        }
    });
    return count;
}

export default countMyPokemon;