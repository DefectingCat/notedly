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
import { Notes } from '../hooks/graphQL/useHomeQL';

interface State {
  isLoggedIn: boolean;
  scrolledTop: number;
  user: {
    id: string;
    username: string;
  };

  /**
   * 该数据为缓存首页的 post list
   * 为了方便更新，将 homeCursor homeNext 单独存储
   */
  notes?: Notes[];
  homeCursor: string;
  homeNext: boolean;

  /**
   * 该数据为【我的动态】的 post lost
   * 其数据格式与首页相同
   */
  myNotes?: Notes[];
  myCursor: string;
  myNext: boolean;
  openRely: boolean;
}

const userState = atom({
  key: 'userState',
  default: {
    isLoggedIn: !!window.localStorage.getItem('token'),
    scrolledTop: 0,
    user: {
      id: '',
      username: '',
    },
    homeCursor: '',
    homeNext: false,
    myCursor: '',
    myNext: false,
    openRely: false,
  },
});

/**
 * 基本封装的状态
 * @returns
 */
const useStore = (): {
  state: State;
  setUserState: SetterOrUpdater<State>;
} => {
  const [state, setUserState] = useRecoilState(userState);

  return {
    state,
    setUserState,
  };
};

export default useStore;
