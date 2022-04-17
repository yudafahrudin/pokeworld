import { gql } from "@apollo/client";

export const GET_POKEMON_LIST = gql`
    query pokemon($limit: Int, $offset: Int) {
        pokemons(limit: $limit,offset: $offset) {
            nextOffset,
            results {
                id
                url
                name
                image
                dreamworld
            }
        }
    }
`;

export const GET_POKEMON_DETAIL = gql`
query pokemon_detail($name: String!) {
  pokemon(name: $name) {
    id,
    name,
    height,
    weight,
    types {
        type {
          name
        }
      },
    moves {
        move {
          name
        }
    }
    stats {
      base_stat,
      effort,
      stat {
        id,
        url,
        name,
      }
    },
  }
}
`;