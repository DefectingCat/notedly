import React from 'react';
import Pages from './pages/index';
import { ApolloClient, ApolloProvider, createHttpLink } from '@apollo/client';
import cache from './cache';
import { setContext } from '@apollo/client/link/context';
import { RecoilRoot } from 'recoil';

/**
 * 这是为 HTTP 头添加 authorization 的方法
 */
const authLink = setContext((_, { headers }) => {
  const token = window.localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token || '',
    },
  };
});

const httpLink = createHttpLink({
  uri: 'https://api.defectink.com/notedly/graphql',
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  connectToDevTools: process.env.NODE_ENV !== 'production',
});

function App(): JSX.Element {
  return (
    <>
      <RecoilRoot>
        <ApolloProvider client={client}>
          <Pages />
        </ApolloProvider>
      </RecoilRoot>
    </>
  );
}

export default App;
