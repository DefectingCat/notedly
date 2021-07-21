import React from 'react';
import './App.css';
import Pages from './pages/index';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.defectink.com/notedly/graphql',
  cache: new InMemoryCache(),
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
