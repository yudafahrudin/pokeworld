import React, { Suspense } from "react";
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

// Context
import { DeveloperProvider } from "./pages/DeveloperContext";

// Layouts
import Container from './layouts/Container'

// Pages
const Home = React.lazy(() => import('./pages/Home'))
const MyPokemon = React.lazy(() => import('./pages/MyPokemon'))
const PokemonDetail = React.lazy(() => import('./pages/PokemonDetail'))


const client = new ApolloClient({
  uri: "https://graphql-pokeapi.graphcdn.app/graphql",
  cache: new InMemoryCache({
    addTypename: false
  }),
});

function App() {
  return (

    <ApolloProvider client={client}>
      <Suspense fallback={<></>}>
        <Router>
          <Container>
            <DeveloperProvider>
              <Switch>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/my-pokemon" element={<MyPokemon />} />
                <Route exact path="/pokemon-detail/:name" element={<PokemonDetail />} />
              </Switch>
            </DeveloperProvider>
          </Container>
        </Router>
      </Suspense>
    </ApolloProvider>
  );
}

export default App;
