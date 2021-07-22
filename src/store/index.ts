import React, { useContext } from 'react';
import { Action } from './action';
import store, { Store } from './state';

export const storeContext = React.createContext<{
  state: Store;
  dispatch: React.Dispatch<Action>;
}>({
  state: store,
  dispatch: () => undefined,
});

export const useStore = (): {
  state: Store;
  dispatch: React.Dispatch<Action>;
} => useContext(storeContext);
