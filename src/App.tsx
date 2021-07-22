import React from 'react';
import './App.css';
import Pages from './pages/index';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import cache from './cache';

const client = new ApolloClient({
  uri: 'https://api.defectink.com/notedly/graphql',
  cache,
});

function App(): JSX.Element {
  return (
    <>
      <ApolloProvider client={client}>
        <Pages />
      </ApolloProvider>
    </>
  );
}

export default App;
