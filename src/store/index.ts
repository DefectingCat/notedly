// import React, { useContext } from 'react';
// import { Action } from './action';
// import store, { Store } from './state';

// export const storeContext = React.createContext<{
//   state: Store;
//   dispatch: React.Dispatch<Action>;
// }>({
//   state: store,
//   dispatch: () => undefined,
// });

// export const useStore = (): {
//   state: Store;
//   dispatch: React.Dispatch<Action>;
// } => useContext(storeContext);
import { atom, useRecoilState, SetterOrUpdater } from 'recoil';

const userState = atom({
  key: 'userState',
  default: {
    isLoggedIn: !!window.localStorage.getItem('token'),
  },
});

/**
 * 基本封装的状态
 * @returns
 */
const useStore = (): {
  state: {
    isLoggedIn: boolean;
  };
  setUserState: SetterOrUpdater<{
    isLoggedIn: boolean;
  }>;
} => {
  const [state, setUserState] = useRecoilState(userState);

  return {
    state,
    setUserState,
  };
};

export default useStore;
