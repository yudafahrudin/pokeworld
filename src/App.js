import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route
} from "react-router-dom";

// Layouts
import Container from './layouts/Container'

// Pages
import Home from './pages/Home'
import Mypokemon from './pages/MyPokemon'
import PokemonDetail from './pages/PokemonDetail'

const client = new ApolloClient({
  uri: "https://graphql-pokeapi.graphcdn.app/graphql",
  cache: new InMemoryCache({
    addTypename: false
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Container>
          <Switch>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/my-pokemon" element={<Mypokemon />} />
            <Route exact path="/pokemon-detail/:name" element={<PokemonDetail />} />
          </Switch>
        </Container>
      </Router>
    </ApolloProvider>
  );
}

export default App;
