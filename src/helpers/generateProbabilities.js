
import localStorage from './localStorage';

const [getProb, setProb] = localStorage("catchProbabilities");

const generateProbabilities = (pokemonName = "bulbasour") => {
    const NA = [...Array(4).keys()];
    const NS = NA.length / 100 * 50; // 50% threshold
    let probabilites = [];
    let probVal;
    let index = 0;
    let name = pokemonName;
    let isBreakRand = false;

    NA.forEach(() => {
        if (!isBreakRand) {
            probVal = Boolean(Math.floor(Math.random() * 4))
        }

        probabilites[index] = probVal;

        if (probabilites.filter(val => val === probVal).length === NS) {
            isBreakRand = true;
            probVal = !probVal
        }

        index = index + 1
    })
    setProb({ name, probabilites })
}

export default generateProbabilities;