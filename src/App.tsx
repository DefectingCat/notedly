import React, { useEffect } from 'react';
import Pages from './pages/index';
import { gql, useLazyQuery } from '@apollo/client';
import useStore from './store';

const ME = gql`
  query Query {
    me {
      id
      username
    }
  }
`;

interface QueryKey {
  me: {
    id: string;
    username: string;
  };
}

function App(): JSX.Element {
  const { state, setUserState } = useStore();
  const [fetchQuery, { data }] = useLazyQuery<QueryKey>(ME);

  /**
   * 这两个 effect 用于第一次判断用户是否登录
   * 如果用户已经登录，则保存当前用户信息到 state
   */
  useEffect(() => {
    if (state.isLoggedIn) {
      fetchQuery();
    }
  }, [fetchQuery, state.isLoggedIn]);
  useEffect(() => {
    data?.me && setUserState({ ...state, user: data.me });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setUserState]);

  return (
    <>
      <Pages />
    </>
  );
}

export default App;
