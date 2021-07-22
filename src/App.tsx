import React, { useReducer } from 'react';
import './App.css';
import Pages from './pages/index';
import { ApolloClient, ApolloProvider, createHttpLink } from '@apollo/client';
import cache from './cache';
import { setContext } from '@apollo/client/link/context';
import { storeContext } from './store/index';
import reducer from './store/action';
import store from './store/state';

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
  const [state, dispatch] = useReducer(reducer, store);

  return (
    <>
      <ApolloProvider client={client}>
        <storeContext.Provider value={{ state, dispatch }}>
          <Pages />
        </storeContext.Provider>
      </ApolloProvider>
    </>
  );
}

export default App;
